export type User = {
  name: string;
  index: number;
  password: string;
};

export type UserWithoutPassword = Omit<User, "password">;
