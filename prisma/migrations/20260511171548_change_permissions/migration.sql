-- This is an empty migration.
delete from "Permission" where code = 'PROJECT_INVITE_USERS';

insert into public."Permission" ("name", description, code, "parentId") values
('Приглашение пользователей', 'Доступ к приглашению пользователей','PROJECT_SEND_INVITE', null),
('Отзывать приглашение пользователей', 'Доступ к отзыванию приглашений','PROJECT_CANCEL_INVITE', null);
