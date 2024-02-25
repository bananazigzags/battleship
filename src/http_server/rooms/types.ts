import { UserWithoutPassword } from "../users/types";

export type Room = {
  roomId: string;
  roomUsers: Array<UserWithoutPassword>;
};
