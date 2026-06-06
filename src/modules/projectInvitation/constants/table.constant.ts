import { Prisma, $Enums } from '@prisma/client';
import { IBlock, IEntityResponse } from 'src/common/interfaces/ientity.interface';
import { ITableColumn } from 'src/common/interfaces/itable.interface';

export const InvitationColumns: ITableColumn[] = [
  { code: 'id', name: 'Инд.', type: 'number', filtrable: false },
  { code: 'email', name: 'Почта', type: 'string', filtrable: true },
  {
    code: 'invitedBy',
    name: 'Кем приглашен',
    type: 'string',
    filtrable: true,
    path: 'invite.user.email',
  },
  {
    code: 'status',
    name: 'Статус',
    type: 'constants',
    filtrable: true,
    constantList: Object.values($Enums.InvitationStatus),
  },
  { code: 'expiresAt', name: 'Срок действия', type: 'datetime', filtrable: true, dateTimeFilterType: 'period' },
  { code: 'acceptedAt', name: 'Принято', type: 'datetime', filtrable: false },
  { code: 'createdAt', name: 'Дата создания', type: 'datetime', filtrable: false },
];

export const InvitationBlocks: IBlock[] = [
  { code: 'main', name: 'Приглашение', columnCapacity: 5, maxColumns: 2, blockType: 'table' },
];

export const InvitationBlockDetails: IEntityResponse['blockDetails'] = [
  {
    blockCode: 'main',
    fields: [
      {
        title: 'Инд.',
        editable: false,
        path: 'id',
        type: 'string',
      },
      {
        title: 'Почта',
        editable: false,
        path: 'email',
        type: 'string',
      },
      {
        title: 'Кем приглашен',
        editable: false,
        path: 'invite.user.email',
        type: 'string',
      },
      {
        title: 'Статус',
        editable: false,
        path: 'status',
        type: 'string',
      },
      {
        title: 'Срок действия',
        editable: false,
        path: 'expiresAt',
        type: 'datetime',
      },
      {
        title: 'Принято',
        editable: false,
        path: 'acceptedAt',
        type: 'datetime',
      },
      {
        title: 'Дата создания',
        editable: false,
        path: 'createdAt',
        type: 'datetime',
      },
    ],
  },
];

export const InvitationSelect: Prisma.InvitationSelect = {
  id: true,
  email: true,
  status: true,
  expiresAt: true,
  acceptedAt: true,
  createdAt: true,
  invite: {
    select: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  },
};
