import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Timestamp } from 'typeorm';
import { UsersEntity } from './users.entity';
import * as fs from 'fs';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as qs from 'qs';
import * as dotenv from 'dotenv';
import { response } from 'express';
import { RoomsService } from 'src/rooms/rooms.service';
import { useJwt } from 'react-jwt';
import { ChangeRoleDTO } from 'src/rooms/dto/change-status.dto';
import { UserDTO } from './dto/user.dto';
import { EditorDTO } from './dto/editor.dto';
var jwt = require('jsonwebtoken');
import * as speakeasy from 'speakeasy';

dotenv.config({ path: './.env' });

// const INTRA_API = process.env.INTRA_API
// const Auth_URL = process.env.Auth_URL
const Access_Token_URL = process.env.Access_Token_URL;
const Client_ID = process.env.Client_ID;
const Client_Secret = process.env.Client_Secret;
const Token_Secret = process.env.JWT_Secret;
const App_Name = 'Carlos Pongos';

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

  async findFriends(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['iFollowList'],
    });
    let iFollowList: number[] = [];
    for (let i = 0; i < user.iFollowList.length; i++)
      iFollowList.push(user.iFollowList[i].id);
    return iFollowList;
  }

  async findBlocked(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['iBlockedList'],
    });
    let iBlockedList: number[] = [];
    for (let i = 0; i < user.iBlockedList.length; i++)
      iBlockedList.push(user.iBlockedList[i].id);
    return iBlockedList;
  }

  //list of rooms when an user id is currently banned
  async findBanned(id: number) {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.bannedInARoom', 'bannedInARoom')
      .leftJoinAndSelect('bannedInARoom.baned', 'baned')
      .where('users.id = :id', { id })
      .getOne();
    let bannedInARoom: number[] = [];
    let now = new Date();
    for (let i = 0; i < user.bannedInARoom.length; i++)
      if (now < new Date(user.bannedInARoom[i].timestamp))
        bannedInARoom.push(user.bannedInARoom[i].baned.id);
    return bannedInARoom;
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);
    return user;
  }

  async findOneForFront(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      select: ['id', 'username', 'lvl', 'avatar', 'email'],
    });
    console.log(JSON.stringify(user));
    return user;
  }

  async findOneWithName(name: string) {
    const user = await this.usersRepository.findOne({ username: name });
    return user;
  }

  async updateUser(id: number, user: UsersEntity) {
    if (id !== user.id) return;
    await this.usersRepository.update(id, user);
    //Check if sent in front
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
      .leftJoinAndSelect('accessToList.owner', 'owner')
      .leftJoinAndSelect('accessToList.admins', 'admins')
      .leftJoinAndSelect('accessToList.muteList', 'muteList')
      .leftJoinAndSelect('accessToList.banList', 'banList')
      .leftJoinAndSelect('muteList.muted', 'muted')
      .leftJoinAndSelect('banList.baned', 'baned')
      .leftJoinAndSelect('muteList.mutedUser', 'mutedUser')
      .leftJoinAndSelect('banList.banedUser', 'banedUser')
      .where('users.id = :id', { id })
      .getOne();
    // console.log('I am in', user.accessToList.length, 'rooms');
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

  //Gets the ID of a user requiring a 2fa
  //Generate a token, put it in the user db
  async secret(token: string): Promise<string> {
    console.log('The token', token);

    try {
      const idFromToken = jwt.verify(token, Token_Secret);

      const user = await this.usersRepository.findOne({
        where: { id: idFromToken },
      });

      console.log('user ID fetched:', user.id);

      var res = speakeasy.generateSecret({
        name: App_Name,
      });
      //Update user with secret.base32
      try {
        await this.usersRepository.update(idFromToken!, {
          secret: res.base32,
        });
      } catch (error) {}
      return res.otpauth_url;
    } catch (error) {
      console.log('User token revoked');
      return 'logout';
    }
  }

  async verificationMFA(token: string, code: string): Promise<Boolean> {
    try {
      console.log('code: ', code, 'token: ', token);
      const idFromToken = jwt.verify(token, Token_Secret);
      const user = await this.usersRepository.findOne({
        where: { id: idFromToken },
        select: ['secret'],
      });

      const secret = user.secret;
      console.log(secret);

      const res = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: code,
      });
      console.log('MFA result:', res);
      return res;
    } catch {
      console.log('Wrecked token');
      return false;
    }
  }

  // 1- Recuperation d'un code via la page de login de l'intra
  // 2- Traduction de ce code en token
  // 3- Recuperation des donnees de la personne sur la base de ce code
  // 4- Login de l'user et EVENTUELLEMENT creation de son compte user
  async login(code: string): Promise<any> {
    var token = '';
    var answer = {
      user: new UsersEntity(),
      iBlockedList: [],
      iFollowList: [],
      jwt: '',
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
      console.log('answer.user.username: ', answer.user.username);

      if (answer.user.doublefa === 0) {
        const user = await this.usersRepository.findOne({
          where: { id: answer.user.id },
          select: ['id', 'username', 'avatar', 'email', 'lvl'],
          relations: ['iFollowList', 'iBlockedList'],
        });
        let iFollowList: number[] = [];
        for (let i = 0; i < user.iFollowList.length; i++)
          iFollowList.push(user.iFollowList[i].id);
        let iBlockedList: number[] = [];
        for (let i = 0; i < user.iBlockedList.length; i++)
          iBlockedList.push(user.iBlockedList[i].id);

        answer.user = user;
        answer.iBlockedList = iBlockedList;
        answer.iFollowList = iFollowList;
        answer.jwt = this.generateToken(answer.user.id);
      } else {
        console.log('2FA detected in users.service: ', answer.user.username);

        answer.jwt = this.generateToken(
          JSON.stringify({
            id: answer.user.id,
            doublefa: answer.user.doublefa,
          }),
        );

        var doublefaUser = new UsersEntity();
        // doublefaUser.username = 'Validate MFA';
        doublefaUser.id = answer.user.id;
        doublefaUser.doublefa = answer.user.doublefa;
        answer.user = doublefaUser;
        console.log('Ready to return: ', answer.user.username);
      }
    } else {
      console.log('No 42 token provided');
    }
    return answer;
  }

  async login2fa(token: string, code: string): Promise<any> {
    console.log('Token: ', token, ' code: ', code);
    // const str = JSON.parse(token);
    // console.log('str: ', str)
    // console.log('In login2fa, id: ', id, ' jwt: ', jwt);
    var answer = {
      user: new UsersEntity(),
      iBlockedList: [],
      iFollowList: [],
      jwt: token,
    };

    try {
      const translatedToked = jwt.verify(token, Token_Secret);
      const idFromToken = translatedToked.id;
      const user = await this.usersRepository.findOne({
        where: { id: idFromToken },
        select: ['secret'],
      });

      const secret = user.secret;
      console.log(secret);

      const res = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: code,
      });
      console.log('MFA result:', res);

      if (res) {
        try {
          console.log('Ready to fetch profile with id:', idFromToken);
          const user = await this.usersRepository.findOne({
            where: { id: idFromToken },
            select: ['id', 'username', 'avatar', 'email', 'lvl'],
            relations: ['iFollowList', 'iBlockedList'],
          });
          let iFollowList: number[] = [];
          for (let i = 0; i < user.iFollowList.length; i++)
            iFollowList.push(user.iFollowList[i].id);
          let iBlockedList: number[] = [];
          for (let i = 0; i < user.iBlockedList.length; i++)
            iBlockedList.push(user.iBlockedList[i].id);

          console.log('User has been fetched');

          answer.user = user;
          answer.iBlockedList = iBlockedList;
          answer.iFollowList = iFollowList;
          answer.jwt = this.generateToken(idFromToken);
          console.log('Answer has been packaged in users.services loginMFA');
        } catch (error) {
          console.log('Could not retrieve profile');
          return answer;
        }
      } else {
        console.log('2FA verification failed, code probably wrong');
        return answer;
      }
    } catch (error) {
      console.log('Wrecked token');
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
      // select: ['id', 'username', 'avatar', 'email', 'lvl'],
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

  async editprofile(data: EditorDTO): Promise<any> {
    console.log('We are in the user.service');

    if (
      data.field === 'username' &&
      typeof data.value === 'string' &&
      data.value !== ''
    ) {
      //check pas de doublons
      await this.usersRepository.update(data.id!, {
        username: data.value,
      });
    } else if (
      data.field === 'avatar' &&
      typeof data.value === 'string' &&
      data.value !== ''
    ) {
      await this.usersRepository.update(data.id!, { avatar: data.value });
    } else if (
      data.field === 'doublefa' &&
      typeof data.value === 'number' &&
      data.value >= 0
    ) {
      await this.usersRepository.update(data.id!, { doublefa: data.value });
    } else if (
      data.field === 'iBlockedList' &&
      typeof data.value &&
      data.value[0] === 'unblock'
    ) {
      console.log('unblock ', data.value[1]);
    } else {
      console.log('Could not edit field: ' + data.field);
      return null;
    }

    console.log('We updated the field ' + data.field + ' in the db');
    const user = await this.usersRepository.findOne({
      where: { id: data.id },
      relations: ['iFollowList', 'iBlockedList'],
    });
    let iFollowList: number[] = [];
    for (let i = 0; i < user.iFollowList.length; i++)
      iFollowList.push(user.iFollowList[i].id);
    let iBlockedList: number[] = [];
    for (let i = 0; i < user.iBlockedList.length; i++)
      iBlockedList.push(user.iBlockedList[i].id);

    const res = {
      user: user,
      iFollowList: iFollowList,
      iBlockedList: iBlockedList,
    };

    return res;
  }

  async blockUser(data: ChangeRoleDTO) {
    // return false;
    //first check with georges comment update user
    //this function should be finished, need update in the front do display accurately

    if (data.role !== 'block') {
      console.log('Wrong Request Role');
      return false;
    }
    const userBlocking = await this.usersRepository.findOne({
      where: { id: data.user.id },
      relations: ['iBlockedList'],
    });
    const userBlocked = await this.usersRepository.findOne(data.appointedId);
    if (userBlocking.id === userBlocked.id) {
      console.log("You can't block yourself");
      return false;
    }
    for (let i = 0; i < userBlocking.iBlockedList.length; i++) {
      if (userBlocking.iBlockedList[i].id === userBlocked.id) {
        console.log('User is already Blocked, removing from the list');
        userBlocking.iBlockedList.splice(i, 1);
        await this.usersRepository.save(userBlocking);
        return true;
      }
    }
    console.log('Blocking User');
    userBlocking.iBlockedList.push(userBlocked);
    await this.usersRepository.save(userBlocking);
    return true;
  }
}
