export type UserEntity = {
  id: string;
  user: {
    name: string;
    email: string;
  };
  userRole: {
    id: number;
    code: string;
  };
  blocked: 0 | 1;
};
