--liquibase formatted sql

-- Migration: 0004_steady_vision
-- Creates: products table (id, name, price, in_stock, created_at)

--changeset system:0004_steady_vision
CREATE TABLE "products" (
    "id" serial PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "price" integer DEFAULT 0 NOT NULL,
    "in_stock" boolean DEFAULT true NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);
