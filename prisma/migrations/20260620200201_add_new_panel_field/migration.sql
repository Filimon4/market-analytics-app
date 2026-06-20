with invitation_cte as (
    select id from public."Permission" p where p.code = 'PANEL_MARKETING'
)
insert into public."Permission" ("name", description, code, "parentId") values
('Аналитика', 'Доступ к опции проекта "Аналитика"','PANEL_MARKETING_MARKETING', (select id from invitation_cte));