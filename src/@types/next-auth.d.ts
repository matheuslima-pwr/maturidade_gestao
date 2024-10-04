import NextAuth from "next-auth";

// Declare a module for NextAuth
declare module "next-auth" {
  interface Session {
    id: string; // Adicione o campo id aqui
  }

  interface JWT {
    id: string; // Adicione o campo id aqui também, se estiver usando JWT
  }

  interface User {
    id: string; // Adicione o campo id aqui também, se necessário
    username?: string; // Adicione a propriedade username
  }
}
