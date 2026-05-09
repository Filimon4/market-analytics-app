-- AlterTable
CREATE SEQUENCE permission_id_seq;
ALTER TABLE "Permission" ALTER COLUMN "id" SET DEFAULT nextval('permission_id_seq');
ALTER SEQUENCE permission_id_seq OWNED BY "Permission"."id";
