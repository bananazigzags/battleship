import { User } from "./types";

export class UserService {
  private users: Record<string, User>;

  constructor() {
    this.users = {};
  }

  getUserCurrentKey() {
    return Object.keys(this.users).length;
  }

  getUsers() {
    return Object.values(this.users);
  }

  getUserByName(name: string) {
    return this.users[name];
  }

  authenticate(name: string, password: string) {
    return this.users[name].password === password;
  }

  createUser(userData: Omit<User, "index">) {
    const userId = this.getUserCurrentKey();
    const userName = userData.name;
    this.users[userName] = { ...userData, index: userId };
    const createdUser = { ...this.users[userName] };
    delete createdUser.password;
    return createdUser;
  }

  login(userData: Omit<User, "index">) {
    const { name, password } = userData;
    let res: string;

    const user = this.getUserByName(name);
    console.log(user);

    if (user) {
      if (this.authenticate(name, password)) {
        console.log("existing user");
        res = JSON.stringify({
          type: "reg",
          data: JSON.stringify({
            data: {
              name: user.name,
              index: user.index,
              error: null,
              errorText: "",
            },
            id: 0,
          }),
        });
      } else {
        res = JSON.stringify({
          type: "error",
          data: JSON.stringify({
            data: {
              name: user.name,
              index: user.index,
              error: "auth",
              errorText: "Wrong credentials",
            },
            id: 0,
          }),
        });
      }
    } else {
      const { index } = this.createUser(userData);
      res = JSON.stringify({
        type: "reg",
        data: JSON.stringify({
          data: {
            name,
            index: index,
            error: null,
            errorText: "",
          },
          id: 0,
        }),
      });
    }

    console.log(this.getUsers());

    return res;
  }
}
