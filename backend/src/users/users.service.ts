import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';
import { UsersEntity } from './users.entity';
import * as fs from 'fs';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as qs from 'qs';
import * as dotenv from 'dotenv';
import { response } from 'express';
import { RoomsEntity } from 'src/rooms/rooms.entity';
import { RoomsService } from 'src/rooms/rooms.service';
import { CreateRoomDTO } from 'src/rooms/dto/create-room.dto';
import { useJwt } from 'react-jwt';
var jwt = require('jsonwebtoken');

dotenv.config({ path: './.env' });

// const INTRA_API = process.env.INTRA_API
// const Auth_URL = process.env.Auth_URL
const Access_Token_URL = process.env.Access_Token_URL;
const Client_ID = process.env.Client_ID;
const Client_Secret = process.env.Client_Secret;
const Token_Secret = process.env.JWT_Secret;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @Inject(forwardRef(() => RoomsService))
    private roomsService: RoomsService,
  ) {}

  //For testing, we seed the db with dummy users
  async seed() {
    const newUser = new UsersEntity();

    console.log('Seeding new users');

    newUser.email = 'dudule@dudule.fr';
    newUser.username = 'dudule';
    newUser.avatar =
      'https://i.kym-cdn.com/entries/icons/original/000/001/030/DButt.jpg';
    const dudule = this.usersRepository.create(newUser);
    await this.usersRepository.save(dudule);

    newUser.email = 'ddecourt@student.42.fr';
    newUser.username = 'ddecourt';
    newUser.avatar =
      'https://media-exp1.licdn.com/dms/image/C4E22AQFnNQdXvgJMfA/feedshare-shrink_800/0/1646749757724?e=2147483647&v=beta&t=XhcJvjso7gO-wOYtcABGUR0jcLLnWLgpQ9o0WHFRvZM';
    const diane = this.usersRepository.create(newUser);
    await this.usersRepository.save(diane);

    const newRoom = {
      owner: 1,
      isDm: false,
      secondMemberDm: '',
      category: 'public',
      channelName: 'Town Hall',
      password: '',
    };
    this.roomsService.create(newRoom);
  }
  async save(user: UsersEntity) {
    return await this.usersRepository.save(user);
  }

  async create(user: UsersEntity) {
    const newUser = await this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    console.log('We added to the db:', newUser);
    return newUser;
    // return JSON.stringify(newUser);
    // return 'Tout est opérationnel :)';
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);
    return user;
  }

  async findOneWithName(name: string) {
    const user = await this.usersRepository.findOne({ username: name });
    return user;
  }

  async updateUser(id: number, user: UsersEntity) {
    if (id !== user.id) return;
    await this.usersRepository.update(id, user);
    const updatedPost = await this.usersRepository.findOne(id);
    console.log(updatedPost);
    return updatedPost;
  }

  async delete(id: number) {
    const deleteResponse = await this.usersRepository.delete(id);
    return deleteResponse;
  }

  async accessList(id: number) {
    // const user = await this.usersRepository.findOne({
    //   relations: ['accessToList'],
    //   where: { id: id },
    // });
    // console.log(user.accessToList);
    // return user.accessToList;
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.accessToList', 'accessToList')
      .leftJoinAndSelect('accessToList.accessList', 'accessList')
      .where('users.id = :id', { id })
      .getOne();
    return user.accessToList;
  }

  async accessListUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['accessToList'],
    });
    return user;
  }

  async accessAllUsers(): Promise<UsersEntity[]> {
    const temp = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.accessToList', 'accessToList')
      .leftJoinAndSelect('users.messagesList', 'messagesList')
      .leftJoinAndSelect('accessToList.accessList', 'accessList')
      .getMany();
    return temp;
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

  // 1- Recuperation d'un code via la page de login de l'intra
  // 2- Traduction de ce code en token
  // 3- Recuperation des donnees de la personne sur la base de ce code
  // 4- Login de l'user et EVENTUELLEMENT creation de son compte user
  async login(code: string): Promise<any> {
    var token = '';
    var answer = {
      user: new UsersEntity(),
      jwt: 'dudule',
    };

    const data = qs.stringify({
      client_id: Client_ID,
      client_secret: Client_Secret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: 'http://localhost:3000/login',
    });

    const config: AxiosRequestConfig = {
      method: 'post',
      url: Access_Token_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };

    token = (await axios(config)).data.access_token;

    //TODO: Ask if the short version is enough
    // await axios(config)
    //   .then(function (response: AxiosResponse) {
    //     token = response.data.access_token;
    //   })
    //   .catch(function (error) {
    //     console.log('Could not get a token from 42');
    //   });

    if (token) {
      answer.user = await this.getUserDataFrom42(token);
      answer.jwt = this.generateToken(answer.user.id);
    } else {
      console.log('No 42 token provided');
    }
    return answer;
  }

  generateToken(data: any): string {
    const token = jwt.sign(data, Token_Secret);
    // console.log('My jwt: ' + token)

    return token;
  }

  //Gets the user data from API 42
  async getUserDataFrom42(token: string): Promise<any> {
    var config: AxiosRequestConfig = {
      method: 'get',
      url: 'https://api.intra.42.fr/v2/me',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    var resp = {};

    await axios(config)
      .then(function (response) {
        resp = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    const res = await this.userFromDB(resp);
    return res;
  }

  async userFromDB(loggedProfile: any): Promise<UsersEntity> {
    //Here we check if the user already exists
    const res = await this.usersRepository.find({
      where: { email: loggedProfile.email },
    });

    var dude = new UsersEntity();

    if (res.length === 0) {
      console.log('Creating profile');
      dude.username = loggedProfile.login;
      dude.avatar = loggedProfile.image_url;
      dude.email = loggedProfile.email;

      await this.create(dude);
    } else {
      dude = res[0];
      console.log(`Welcome back, ${dude.username}`);
    }

    return dude;
  }
}
