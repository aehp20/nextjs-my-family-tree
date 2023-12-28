CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE
    "Person" (
        "person_id" UUID NOT NULL DEFAULT uuid_generate_v4 (),
        "first_name" VARCHAR NOT NULL,
        "father_last_name" VARCHAR,
        "mother_last_name" VARCHAR,
        "gender" CHAR,
        "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" DATE,
        "deleted_at" DATE,
        "birthday" VARCHAR,
        CONSTRAINT "Person_pkey" PRIMARY KEY ("person_id")
    );