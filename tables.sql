CREATE TABLE "user" (
  "id" SERIAL PRIMARY KEY,
  "firstName" VARCHAR(255) NOT NULL,
  "lastName" VARCHAR(255) NOT NULL,
  "age" INTEGER NOT NULL,
  "gender" VARCHAR(10) NOT NULL,
  "problems" BOOLEAN DEFAULT false
);

CREATE TABLE "custom_migration_table" (
  "id" SERIAL PRIMARY KEY,
  "timestamp" BIGINT NOT NULL,
  "name" VARCHAR(255) NOT NULL
);