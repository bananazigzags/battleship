import { UserWithoutPassword } from "../users/types";
import { Room } from "./types";

export class RoomService {
  private rooms: Record<string, Room>;

  constructor() {
    this.rooms = {};
  }

  getRoomCurrentKey() {
    return Object.keys(this.rooms).length.toString();
  }

  getRoomById(id: string) {
    return this.rooms[id];
  }

  createRoom(user: UserWithoutPassword) {
    const roomId = this.getRoomCurrentKey();
    this.rooms[roomId] = {
      roomId,
      roomUsers: [user],
    };
  }

  addUserToRoom(roomId: string, user: UserWithoutPassword) {
    this.rooms[roomId].roomUsers.push(user);
    return this.rooms[roomId].roomUsers;
  }

  getAvailableRooms() {
    const roomsWithOnePlayer = Object.values(this.rooms).filter((room) => {
      return room.roomUsers.length === 1;
    });

    return roomsWithOnePlayer;
  }

  getRoomUpdate() {
    const availableRooms = this.getAvailableRooms();

    const res = JSON.stringify({
      type: "update_room",
      data: JSON.stringify(availableRooms),
      id: 0,
    });

    return res;
  }
}
