with invitation_cte as (
    select id from public."Permission" p where p.code = 'PANEL_PROJECTS'
)
insert into public."Permission" ("name", description, code, "parentId") values
('Приглашения', 'Доступ к опции проекта "Приглашения"','PANEL_PROJECTS_INVITE', (select id from invitation_cte)),
('Виды канала трафика', 'Доступ к опции проекта "Виды канала трафика"','PANEL_PROJECTS_TYPE_CHANNEL_SOURCE', (select id from invitation_cte));