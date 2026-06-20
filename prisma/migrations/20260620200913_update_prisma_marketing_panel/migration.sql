with invitation_cte as (
    select id from public."Permission" p where p.code = 'PANEL_MARKETING_MARKETING'
)
update public."Permission"
set "systemType" = 'panel'
where id = (select id from invitation_cte);