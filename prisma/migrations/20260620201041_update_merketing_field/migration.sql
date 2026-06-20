with invitation_cte as (
    select id from public."Permission" p where p.code = 'PANEL_MARKETING_MARKETING'
)
update public."Permission"
set "navigationUrl" = '/marketing/analytics'
where id = (select id from invitation_cte);

with invitation_cte as (
    select id from public."Permission" p where p.code = 'PANEL_MARKETING_MARKETING'
)
update public."Permission"
set code = 'PANEL_MARKETING_ANALYTICS'
where id = (select id from invitation_cte);

with invitation_cte as (
    select id from public."Permission" p where p.code = 'PANEL_MARKETING_ANALYTICS'
)
update public."Permission"
set "panelOrder" = 4
where id = (select id from invitation_cte);