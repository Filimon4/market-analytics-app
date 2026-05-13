export type UserEntity = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  userRole: {
    code: string;
  };
  blocked: 0 | 1;
};
