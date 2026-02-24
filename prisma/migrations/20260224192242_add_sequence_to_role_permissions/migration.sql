-- AlterTable
CREATE SEQUENCE rolepermission_id_seq;
ALTER TABLE "RolePermission" ALTER COLUMN "id" SET DEFAULT nextval('rolepermission_id_seq');
ALTER SEQUENCE rolepermission_id_seq OWNED BY "RolePermission"."id";
