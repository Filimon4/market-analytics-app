-- This is an empty migration.

insert into public."Permission" ("name", description, code, "parentId") values
('Приглашения', 'Раздел приглашений','PROJECT_INVITE', null);


with invitation_cte as (
    select id from public."Permission" p where p.code = 'PROJECT_INVITE'
)
update public."Permission" p 
set "parentId" = (select id from invitation_cte)
where p.code = 'PROJECT_SEND_INVITE';

with invitation_cte as (
    select id from public."Permission" p where p.code = 'PROJECT_INVITE'
)
update public."Permission" p 
set "parentId" = (select id from invitation_cte)
where p.code = 'PROJECT_CANCEL_INVITE';

