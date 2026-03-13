--liquibase formatted sql

-- Migration: 0000_oval_mystique
-- Creates: exercises, lessons tables

--changeset system:0000_oval_mystique
CREATE TABLE "exercises" (
    "id" serial PRIMARY KEY NOT NULL,
    "lesson_id" integer NOT NULL,
    "question" text NOT NULL,
    "options" text[] NOT NULL,
    "correct_answer" text NOT NULL,
    "explanation" text NOT NULL
);

CREATE TABLE "lessons" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "category" text NOT NULL,
    "level" text NOT NULL,
    "order" integer NOT NULL
);
