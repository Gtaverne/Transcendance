import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  users: User[] = [];
  //your db logic here
  create(user: User) {
    this.users.push(user);
    return this.users;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    return this.users.find((u) => u.id === id);
  }

  delete(id: number): User[] {
    const index = this.users.findIndex((u) => u.id === id);
    this.users.splice(index, 1);
    return this.users;
  }

  //On met quoi ici pour la partie callback ?
  login(): string {
    return 'Yoloooo'
  }
}
