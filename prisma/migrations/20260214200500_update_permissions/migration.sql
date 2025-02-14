-- This is an empty migration.
insert into public."Permission" ("id", "name", description, code, "parentId") values
(10, 'Панель', 'Раздел панели', 'PANEL', null);

UPDATE public."Permission" p
SET "parentId" = 10
WHERE p.code IN ('PANEL_MARKETING', 'PANEL_PROJECTS');