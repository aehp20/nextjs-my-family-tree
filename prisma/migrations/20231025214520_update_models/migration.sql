-- AlterTable
ALTER TABLE "Person" ADD COLUMN     "family_id" UUID;

-- CreateTable
CREATE TABLE "Family" (
    "family_id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "father_id" UUID NOT NULL,
    "mother_id" UUID NOT NULL,

    CONSTRAINT "Family_pkey" PRIMARY KEY ("family_id")
);

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "Family"("family_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_father_id_fkey" FOREIGN KEY ("father_id") REFERENCES "Person"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Family" ADD CONSTRAINT "Family_mother_id_fkey" FOREIGN KEY ("mother_id") REFERENCES "Person"("person_id") ON DELETE RESTRICT ON UPDATE CASCADE;
