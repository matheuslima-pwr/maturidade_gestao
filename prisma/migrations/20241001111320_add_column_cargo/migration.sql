-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "maturidade_gestao";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "posicionamento_estrategico";

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "segmento" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "faturamento" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maturidade_gestao"."usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "segmento" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "faturamento" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maturidade_gestao"."respostas" (
    "id" SERIAL NOT NULL,
    "pergunta_id" INTEGER NOT NULL,
    "resposta" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respostas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posicionamento_estrategico"."usuarios" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "segmento" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "faturamento" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posicionamento_estrategico"."respostas" (
    "id" SERIAL NOT NULL,
    "pergunta_id" INTEGER NOT NULL,
    "pontuacao" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "respostas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "maturidade_gestao"."respostas" ADD CONSTRAINT "respostas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "maturidade_gestao"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posicionamento_estrategico"."respostas" ADD CONSTRAINT "respostas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "posicionamento_estrategico"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
