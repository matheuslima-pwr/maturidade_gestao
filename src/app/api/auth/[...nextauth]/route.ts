import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

interface ExtendedUser extends User {
  id: string; // Adicione o id ao tipo User
  username?: string; // Adicione username como opcional
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        const user: ExtendedUser = {
          id: "1", // Esse ID deve vir do seu banco de dados ou lógica de autenticação
          name: "John Doe", // Substitua conforme necessário
          username: credentials?.username, // Adiciona o username aqui
        };

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (
          credentials?.username === adminUsername &&
          await bcrypt.compare(credentials?.password ?? '', adminPasswordHash ?? '')
        ) {
          return user; // Retorne o usuário se as credenciais estiverem corretas
        }

        return null; // Retorne null se as credenciais forem inválidas
      },
    }),
  ],
  pages: {
    signIn: "/admin", // Altere para a rota do seu formulário de login
  },
  session: {
    strategy: "jwt", // Usa JWT para sessões
    maxAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async jwt({ token, user }) {
      // Armazena o ID do usuário no token
      if (user) {
        token.id = user.id; // Acessa o ID do ExtendedUser
      }
      return token;
    },
    async session({ session, token }) {
      // Adiciona o ID do usuário à sessão
      if (token) {
        session.id = token.id as string; // Use uma asserção de tipo
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
