--liquibase formatted sql

-- Migration: 0002_testing_table
-- Creates: testing table (id, name, description, value, created_at)

--changeset system:0002_testing_table
CREATE TABLE IF NOT EXISTS "testing" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL DEFAULT '',
  "value" integer NOT NULL DEFAULT 0,
  "created_at" timestamp NOT NULL DEFAULT now()
);

--changeset system:0002_drop_testing_name
ALTER TABLE "testing" DROP COLUMN IF EXISTS "name";
