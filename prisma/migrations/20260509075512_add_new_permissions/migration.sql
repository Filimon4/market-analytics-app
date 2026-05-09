with per_cte as (
	select count(id) as curr_value from "Permission" p 
)
select setval('permission_id_seq', (per_cte.curr_value + 1)) from per_cte;

insert into public."Permission" ("name", description, code, "parentId") values
('Приглашение пользователей', 'Доступ к приглашению пользователей','PROJECT_INVITE_USERS', null)