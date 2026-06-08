update public."Permission"
set "systemType" = 'panel'
where code in (
    'PANEL_MARKETING_STRATEGY',
    'PANEL_MARKETING_CHANNELS',
    'PANEL_MARKETING_CHANNELS_PERFORMANCE',
    'PANEL_PROJECTS_DEVELOPER',
    'PANEL_PROJECTS_API_KEYS',
    'PANEL_PROJECTS_USERS',
    'PANEL_PROJECTS_ROLES',
    'PANEL_MARKETING',
    'PANEL_PROJECTS',
    'PANEL_PROJECTS_INVITE',
    'PANEL_PROJECTS_TYPE_CHANNEL_SOURCE'
);

update public."Permission"
set "iconUrl" = '/icons/marketing.png'
where code = 'PANEL_MARKETING';

update public."Permission"
set "iconUrl" = '/icons/project.png'
where code = 'PANEL_PROJECTS';

update public."Permission"
set "navigationUrl" = '/marketing/strategies'
where code = 'PANEL_MARKETING_STRATEGY';

update public."Permission"
set "navigationUrl" = '/marketing/channels'
where code = 'PANEL_MARKETING_CHANNELS';

update public."Permission"
set "navigationUrl" = '/marketing/channels/performances'
where code = 'PANEL_MARKETING_CHANNELS_PERFORMANCE';

update public."Permission"
set "navigationUrl" = '/projects/developer'
where code = 'PANEL_PROJECTS_DEVELOPER';

update public."Permission"
set "navigationUrl" = '/projects/apikeys'
where code = 'PANEL_PROJECTS_API_KEYS';

update public."Permission"
set "navigationUrl" = '/projects/users'
where code = 'PANEL_PROJECTS_USERS';

update public."Permission"
set "navigationUrl" = '/projects/roles'
where code = 'PANEL_PROJECTS_ROLES';

update public."Permission"
set "navigationUrl" = '/projects/invitations'
where code = 'PANEL_PROJECTS_INVITE';

update public."Permission"
set "navigationUrl" = '/projects/channelsources'
where code = 'PANEL_PROJECTS_TYPE_CHANNEL_SOURCE';

update public."Permission"
set "panelOrder" = 1
where code = 'PANEL_MARKETING';

update public."Permission"
set "panelOrder" = 2
where code = 'PANEL_PROJECTS';

update public."Permission"
set "panelOrder" = 1
where code = 'PANEL_MARKETING_STRATEGY';

update public."Permission"
set "panelOrder" = 2
where code = 'PANEL_MARKETING_CHANNELS';

update public."Permission"
set "panelOrder" = 3
where code = 'PANEL_MARKETING_CHANNELS_PERFORMANCE';

update public."Permission"
set "panelOrder" = 1
where code = 'PANEL_PROJECTS_DEVELOPER';

update public."Permission"
set "panelOrder" = 2
where code = 'PANEL_PROJECTS_API_KEYS';

update public."Permission"
set "panelOrder" = 3
where code = 'PANEL_PROJECTS_USERS';

update public."Permission"
set "panelOrder" = 4
where code = 'PANEL_PROJECTS_ROLES';

update public."Permission"
set "panelOrder" = 5
where code = 'PANEL_PROJECTS_INVITE';

update public."Permission"
set "panelOrder" = 6
where code = 'PANEL_PROJECTS_TYPE_CHANNEL_SOURCE';

update public."Permission"
set "name" = 'Маркетинг'
where code = 'PANEL_MARKETING';

update public."Permission"
set "name" = 'Стратегии'
where code = 'PANEL_MARKETING_STRATEGY';

update public."Permission"
set "name" = 'Каналы трафика'
where code = 'PANEL_MARKETING_CHANNELS';

update public."Permission"
set "name" = 'Результаты трафика'
where code = 'PANEL_MARKETING_CHANNELS_PERFORMANCE';

update public."Permission"
set "name" = 'Проект'
where code = 'PANEL_PROJECTS';

update public."Permission"
set "name" = 'Разработчику'
where code = 'PANEL_PROJECTS_DEVELOPER';

update public."Permission"
set "name" = 'Апи ключи'
where code = 'PANEL_PROJECTS_API_KEYS';

update public."Permission"
set "name" = 'Пользователи'
where code = 'PANEL_PROJECTS_USERS';

update public."Permission"
set "name" = 'Роли'
where code = 'PANEL_PROJECTS_ROLES';

update public."Permission"
set "name" = 'Приглашения'
where code = 'PANEL_PROJECTS_INVITE';

update public."Permission"
set "name" = 'Виды канала трафика'
where code = 'PANEL_PROJECTS_TYPE_CHANNEL_SOURCE';