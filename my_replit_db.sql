--
-- PostgreSQL database dump
--

\restrict 0QZ68ydVvcQH62Xo21byWKxreizixCkXbYGLG9Q7YTvyiPBpTQ9XIi5XGhCFfeM

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: exercises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exercises (
    id integer NOT NULL,
    lesson_id integer NOT NULL,
    question text NOT NULL,
    options text[] NOT NULL,
    correct_answer text NOT NULL,
    explanation text NOT NULL
);


ALTER TABLE public.exercises OWNER TO postgres;

--
-- Name: exercises_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.exercises_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.exercises_id_seq OWNER TO postgres;

--
-- Name: exercises_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.exercises_id_seq OWNED BY public.exercises.id;


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lessons (
    id integer NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    category text NOT NULL,
    level text NOT NULL,
    "order" integer NOT NULL
);


ALTER TABLE public.lessons OWNER TO postgres;

--
-- Name: lessons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lessons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lessons_id_seq OWNER TO postgres;

--
-- Name: lessons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lessons_id_seq OWNED BY public.lessons.id;


--
-- Name: exercises id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises ALTER COLUMN id SET DEFAULT nextval('public.exercises_id_seq'::regclass);


--
-- Name: lessons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons ALTER COLUMN id SET DEFAULT nextval('public.lessons_id_seq'::regclass);


--
-- Data for Name: exercises; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exercises (id, lesson_id, question, options, correct_answer, explanation) FROM stdin;
5	3	Base form of past tense?	{"He did","I did","You did"}	He did	3rd person masculine singular is the root.
6	3	Standard root letter count?	{2,3,4}	3	Most Arabic verbs are triliteral (3 letters).
7	4	Prefix for 'He' (3rd person)?	{Ya,Ta,Na}	Ya	Ya- indicates 3rd person masculine singular.
8	5	Sentence starting with a noun?	{Ismiyya,Fi'liyya}	Ismiyya	Jumla Ismiyya starts with an Ism (noun).
9	6	Grammatical state of the Fa'il (Doer)?	{Marfu,Mansub,Majrur}	Marfu	The subject/doer of a verb is always nominative.
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lessons (id, title, content, category, level, "order") FROM stdin;
3	Past Tense (Madi)	Arabic verbs usually have 3 root letters. The base is 3rd person masculine singular: **Fa'ala** (He did).	sarf	beginner	1
4	Present Tense (Mudari)	Starts with prefixes: **Ya-** (He), **Ta-** (You/She), **A-** (I), **Na-** (We). Example: **Yaf'alu** (He does).	sarf	beginner	2
5	Nominal Sentence (Ismiyya)	Starts with a noun. Two parts: **Mubtada** (Subject) and **Khabar** (Predicate). Both are **Marfu** (Nominative).	nahw	beginner	1
6	Verbal Sentence (Fi'liyya)	Starts with a verb. Main parts: **Fi'l** (Verb) and **Fa'il** (Doer). Fa'il is always **Marfu**.	nahw	beginner	2
\.


--
-- Name: exercises_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.exercises_id_seq', 9, true);


--
-- Name: lessons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lessons_id_seq', 6, true);


--
-- Name: exercises exercises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exercises
    ADD CONSTRAINT exercises_pkey PRIMARY KEY (id);


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lessons
    ADD CONSTRAINT lessons_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict 0QZ68ydVvcQH62Xo21byWKxreizixCkXbYGLG9Q7YTvyiPBpTQ9XIi5XGhCFfeM

