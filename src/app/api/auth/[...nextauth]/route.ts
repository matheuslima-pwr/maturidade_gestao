import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = { id: "1", name: "John Doe", username: credentials?.username };
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        console.log('Username:', process.env.ADMIN_USERNAME);
        console.log('Password Hash:', process.env.ADMIN_PASSWORD_HASH);
        if (
          credentials?.username === adminUsername &&
          await bcrypt.compare(credentials?.password ?? '', adminPasswordHash ?? '')
      ) {
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
    updateAge: 24 * 60 * 60, // Atualiza o token a cada 24 horas
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
