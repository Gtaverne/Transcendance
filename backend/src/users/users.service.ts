import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private postsRepository: Repository<UsersEntity>,
  ) {}

  async create(user: UsersEntity) {
    const newUser = await this.postsRepository.create(user);
    await this.postsRepository.save(newUser);
    console.log('We added to the db:', newUser);
    return newUser;
    // return JSON.stringify(newUser);
    // return 'Tout est opérationnel :)';
  }

  findAll() {
    return this.postsRepository.find();
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne(id);
    return post;
  }

  async updatePost(id: number, user: UsersEntity) {
    if (id !== user.id)
      return;
    await this.postsRepository.update(id, user);
    const updatedPost = await this.postsRepository.findOne(id);
    console.log(updatedPost);
    return updatedPost;
  }

  async delete(id: number) {
	const deleteResponse = await this.postsRepository.delete(id);
	return deleteResponse;
  }

/*
  //BEFORE CONNECTION TO DB

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
*/

  // On met quoi ici pour la partie callback ?
  login(): string {
    return 'Yoloooo';
  }
}
