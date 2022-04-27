import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';
import { UsersEntity } from './users.entity';
import * as fs from 'fs'
import axios, {AxiosRequestConfig, AxiosResponse, AxiosError,} from 'axios'
import * as qs from 'qs'
import * as dotenv from 'dotenv'
import { response } from 'express';

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
    const user = await this.usersRepository.findOne(id);
    return user;
  }

  async updateUser(id: number, user: UsersEntity) {
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
  async login(code: string) : Promise<UsersEntity> {


    var userData : UsersEntity = {id: 0,
      username: '',
      avatar: '',
      email: 'dude@test.fr',
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
      administratingRooms: [],}

    var token = ''

    //console.log('code from params: '+  code)

    const data = qs.stringify({
      'client_id': Client_ID,
      'client_secret': Client_Secret,
      'code': code,
      'grant_type': 'authorization_code',
      'redirect_uri': 'http://localhost:3000/login' 
    });

    const config: AxiosRequestConfig = {
      method: 'post',
      url: Access_Token_URL,
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
      },
      data : data,
    };

    console.log('ready to do the axios request')
     
    await axios(config)
    .then(function (response: AxiosResponse) {
      token = response.data.access_token
      console.log('show me the token from 42: ' + token)
      console.log('Status: ' + response.status)
    })
    .catch(function (error) {
      console.log('Axios request failed: ' + response.status)
    });


    if (token) {
      userData = await this.getUserDataFrom42(token)
      console.log('We have a token, here is the name: ' + userData.username)
      return userData
    } else {
      console.log('No token provided')
    }
    return userData
  }


  //Gets the user data from API 42
  async getUserDataFrom42(token : string) : Promise<any> {

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
      resp = response.data      
    })
    .catch(function (error) {
      console.log(error);
    });
    const res = await this.userFromDB(resp) 
    return res
  }

  async userFromDB(loggedProfile: any) : Promise<UsersEntity> {

    //Here we check if the user already exists
    const res = await this.usersRepository.find({where: {email : loggedProfile.email}})

    var dude : UsersEntity = {id: 0,
      username: '',
      avatar: '',
      email: 'dude@test.fr',
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
      administratingRooms: [],}

    if (res.length === 0) {
      console.log('Creating profile')

      dude = {
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
      }
      await this.create(dude)
    } else {
      dude = res[0]
      console.log(`Welcome back, ${dude.username}`)
    }

    return dude
  }
}
