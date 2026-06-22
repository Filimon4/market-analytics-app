with invitation_cte as (
    select id from public."Permission" p where p.code = 'PANEL_PROJECTS'
)
insert into public."Permission" ("name", description, code, "parentId", "systemType", "navigationUrl", "panelOrder") values
('Виды отчётов', 'Доступ к опции проекта "Виды отчёта"','PANEL_PROJECTS_REPORT_TYPE', (select id from invitation_cte), 'panel', '/projects/report-types', 7);