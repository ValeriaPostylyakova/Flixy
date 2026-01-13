-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'REGULAR');

-- CreateEnum
CREATE TYPE "AuthMethod" AS ENUM ('CREDENTIALS', 'GOOGLE', 'YANDEX');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('VERIFICATION', 'TWO_FACTOR', 'PASSWORD_RESET');

-- CreateTable
CREATE TABLE "user_data" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "displayName" TEXT NOT NULL,
    "picture" TEXT,
    "password" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'REGULAR',
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_two_factor_enable" BOOLEAN NOT NULL DEFAULT false,
    "method" "AuthMethod" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_data" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "account_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token_data" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_in" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_data_email_key" ON "user_data"("email");

-- CreateIndex
CREATE UNIQUE INDEX "token_data_token_key" ON "token_data"("token");

-- AddForeignKey
ALTER TABLE "account_data" ADD CONSTRAINT "account_data_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;
