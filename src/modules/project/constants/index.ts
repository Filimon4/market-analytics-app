export enum EPermissionCode {
  'PANEL_MARKETING_STRATEGY' = 'PANEL_MARKETING_STRATEGY',
  'PANEL_MARKETING_CHANNELS' = 'PANEL_MARKETING_CHANNELS',
  'PANEL_MARKETING_CHANNELS_PERFORMANCE' = 'PANEL_MARKETING_CHANNELS_PERFORMANCE',
  'PANEL_PROJECTS_DEVELOPER' = 'PANEL_PROJECTS_DEVELOPER',
  'PANEL_PROJECTS_API_KEYS' = 'PANEL_PROJECTS_API_KEYS',
  'PANEL_PROJECTS_USERS' = 'PANEL_PROJECTS_USERS',
  'PANEL_PROJECTS_ROLES' = 'PANEL_PROJECTS_ROLES',
  'PANEL' = 'PANEL',
  'PANEL_MARKETING' = 'PANEL_MARKETING',
  'PANEL_PROJECTS' = 'PANEL_PROJECTS',
}

export enum EDefaultCodeRole {
  owner = 'owner',
  analytic = 'analytic',
  marketing = 'marketing',
  invited = 'invited',
}

export const DefaultRoles = [
  { code: EDefaultCodeRole.owner, title: 'Ген. дир.' },
  { code: EDefaultCodeRole.analytic, title: 'Аналитик' },
  { code: EDefaultCodeRole.marketing, title: 'Маркетолог' },
  { code: EDefaultCodeRole.invited, title: 'Приглашённый' },
];

export const DefaultPermissions = {
  [EDefaultCodeRole.analytic]: {
    [EPermissionCode.PANEL]: true,
    [EPermissionCode.PANEL_MARKETING]: true,
    [EPermissionCode.PANEL_MARKETING_CHANNELS]: true,
    [EPermissionCode.PANEL_MARKETING_CHANNELS_PERFORMANCE]: true,
    [EPermissionCode.PANEL_MARKETING_STRATEGY]: true,
  },
  [EDefaultCodeRole.marketing]: {
    [EPermissionCode.PANEL]: true,
    [EPermissionCode.PANEL_MARKETING]: true,
    [EPermissionCode.PANEL_MARKETING_CHANNELS]: true,
    [EPermissionCode.PANEL_MARKETING_CHANNELS_PERFORMANCE]: true,
    [EPermissionCode.PANEL_MARKETING_STRATEGY]: true,
  },
};
