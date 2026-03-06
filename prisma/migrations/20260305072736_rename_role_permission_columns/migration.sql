-- This is an empty migration.
alter table public."RolePermission" rename column "userRoleId" to "roleId";
alter table public."RolePermission" rename column "userPermissionId" to "permissionId";