import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UsersEntity } from './users.entity';
import * as fs from 'fs'
import axios, {AxiosRequestConfig, AxiosResponse, AxiosError,} from 'axios'
import * as qs from 'qs'
import * as dotenv from 'dotenv'

dotenv.config({path: './.env'})

const INTRA_API = process.env.INTRA_API
const Auth_URL = process.env.Auth_URL
const Access_Token_URL = process.env.Access_Token_URL
const Client_ID = process.env.Client_ID
const Client_Secret = process.env.Client_Secret

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

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
    const post = await this.usersRepository.findOne(id);
    return post;
  }

  async updatePost(id: number, user: UsersEntity) {
    if (id !== user.id)
      return;
    await this.usersRepository.update(id, user);
    const updatedPost = await this.usersRepository.findOne(id);
    console.log(updatedPost);
    return updatedPost;
  }

  async delete(id: number) {
	const deleteResponse = await this.usersRepository.delete(id);
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

  // 1- Recuperation d'un code via la page de login de l'intra
  // 2- Traduction de ce code en token
  // 3- Recuperation des donnees de la personne sur la base de ce code
  // 4- Login de l'user et EVENTUELLEMENT creation de son compte user
  async login(code: string) {

    console.log(code)

    const data = qs.stringify({
      'client_id': Client_ID,
      'client_secret': Client_Secret,
      'code': code,
      'grant_type': 'authorization_code',
      'redirect_uri': 'http://localhost:5050/users/callback' 
    });

    const config: AxiosRequestConfig = {
      method: 'post',
      url: Access_Token_URL,
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      data : data,
    };
    var token = ''
    
    await axios(config)
    .then(function (response: AxiosResponse) {
      token = response.data.access_token
    })
    .catch(function (error) {
      //Voir où on renvoie l'user

      // console.log(error);
    });

    if (token) {
      this.getUserDataFrom42(token)
    } else {
      console.log('No token provided')
    }

    return 'Called by the intra 42'
  }


  //Gets the user data from API 42
  async getUserDataFrom42(token : string) {

    var config : AxiosRequestConfig = {
      method: 'get',
      url: 'https://api.intra.42.fr/v2/me',
      headers: { 
        'Authorization': `Bearer ${token}`, 
      }
    };
    var resp = {}

    await axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data.login));
      // https://stackoverflow.com/questions/46745688/typeorm-upsert-create-if-not-exist
      resp = response.data      
    })
    .catch(function (error) {
      console.log(error);
    });

    if (resp) {
      const res = await this.userCreate(resp) 
      if (res > 1) {
        console.log('We have duplicate users')
      }
    } 
  }

  async userCreate(loggedProfile: any) : Promise<number> {

    //Here we check if the user already exists
    const res = await this.usersRepository.find({where: {email : loggedProfile.email}})
    // console.log(res)

    if (res.length === 0) {
      console.log('Creating profile')
      await this.create({
        id: 0,
        username: loggedProfile.login,
        avatar: loggedProfile.image_url,
        email: loggedProfile.email,
        doublefa: false,
        lvl: 0,
        iFollowList: [],
        followingMeList: [],
        iBlockedList: [],
        blockedMeList: [],
        messagesList: [],
        accessToList: [],
        gamePlayer1: [],
        gamePlayer2: [],
        ownedRooms: [],
        administratingRooms: [],
      })
    } else {
      console.log(`Welcome back, ${loggedProfile.login}`)
    }

    return res.length

  }


}
