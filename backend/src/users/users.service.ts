import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';
import { UsersEntity } from './users.entity';


import axios, {AxiosRequestConfig, AxiosResponse,
  AxiosError,} from 'axios'
import * as qs from 'qs'

const INTRA_API = 'https://api.intra.42.fr/oauth/token'
const Auth_URL = 'https://api.intra.42.fr/oauth/authorize'
const Access_Token_URL = 'https://api.intra.42.fr/oauth/token'
const Client_ID ='f950eb9f6505f95fd8146faeb36d1706ceda488419c445ab4fa7485903463bd6'
const Client_Secret = '1b5f67e46005d92cc5bac66cbaa79a6c133e37fea09ce10df2950ff85625e2cf'

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
    }

    return 'Called by the intra 42'
  }

  async getUserDataFrom42(token : string) {

    var config : AxiosRequestConfig = {
      method: 'get',
      url: 'https://api.intra.42.fr/v2/me',
      headers: { 
        'Authorization': `Bearer ${token}`, 

      }
    };

    
    
    await axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data.login));
      // https://stackoverflow.com/questions/46745688/typeorm-upsert-create-if-not-exist
      


    })
    .catch(function (error) {
      console.log(error);
    });

  }


}
