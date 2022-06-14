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
// import { useJwt } from 'react-jwt';
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
const FRONT_DOMAIN = process.env.FRONT_DOMAIN || 'http://localhost:3000';

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
    console.log('Seeding new users');
    const Dudule = {
      email: 'dudule@dudule.fr',
      login: 'dudule',
      image_url:
        'https://i.kym-cdn.com/entries/icons/original/000/001/030/DButt.jpg',
    };

    this.userFromDB(Dudule);

    const Diane = {
      email: 'ddecourt@student.42.fr',
      login: 'ddecourt',
      image_url:
        'https://media-exp1.licdn.com/dms/image/C4E22AQFnNQdXvgJMfA/feedshare-shrink_800/0/1646749757724?e=2147483647&v=beta&t=XhcJvjso7gO-wOYtcABGUR0jcLLnWLgpQ9o0WHFRvZM',
    };
    this.userFromDB(Diane);

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

  async findFollowers(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
      relations: ['followingMeList'],
    });
    let followingMeList: number[] = [];
    for (let i = 0; i < user.followingMeList.length; i++)
      followingMeList.push(user.followingMeList[i].id);
    return followingMeList;
  }

  async findFollowing(id: number) {
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

  //Important: do not add relations as it will export secrets to the front
  async findOneForFront(id: number, whoIsAsking: number) {
    console.log('Fetch user: ', id, ' request by: ', whoIsAsking);
    if (!whoIsAsking || whoIsAsking === 0) {
      const user = await this.usersRepository.findOne({
        where: { id: id },
        select: ['id', 'username', 'avatar'],
      });
      return user;
    } else if (whoIsAsking === id) {
      const user = await this.usersRepository.findOne({
        where: { id: id },
        select: ['id', 'username', 'lvl', 'avatar', 'email', 'doublefa'],
      });
      return user;
    } else {
      const user = await this.usersRepository.findOne({
        where: { id: id },
        select: ['id', 'username', 'lvl', 'avatar', 'email'],
      });
      return user;
    }
  }

  async findOneWithName(name: string) {
    const user = await this.usersRepository.findOne({
      where: { username: name },
      select: ['id', 'username', 'lvl', 'avatar', 'email'],
    });
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

  //TO REMOVE as it will export secrets of the accesslist !!!!!!
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
      redirect_uri: FRONT_DOMAIN + '/login',
    });

    const config: AxiosRequestConfig = {
      method: 'post',
      url: Access_Token_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: data,
    };

    console.log('Ready to make a request to intra42, code= ', code, data);

    token = (await axios(config)).data.access_token;

    // console.log('We received a token from intra')

    if (token) {
      answer.user = await this.getUserDataFrom42(token);
      console.log('answer.user.username: ', answer.user.username);

      if (!answer.user.doublefa || answer.user.doublefa === 0) {
        const user = await this.usersRepository.findOne({
          where: { id: answer.user.id },
          select: ['id', 'username', 'avatar', 'doublefa', 'email', 'lvl'],
          relations: ['iFollowList', 'iBlockedList'],
        });
        let iFollowList: number[] = [];
        for (let i = 0; i < user.iFollowList.length; i++)
          iFollowList.push(user.iFollowList[i].id);
        let iBlockedList: number[] = [];
        for (let i = 0; i < user.iBlockedList.length; i++)
          iBlockedList.push(user.iBlockedList[i].id);

        answer.user = await this.findOneForFront(
          answer.user.id,
          answer.user.id,
        );
        console.log('Normal auth, user: ', answer.user);
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
        doublefaUser.id = answer.user.id;
        doublefaUser.doublefa = answer.user.doublefa;
        answer.user = doublefaUser;
      }
    } else {
      console.log('No 42 token provided');
    }
    return answer;
  }

  async login2fa(token: string, code: string): Promise<any> {
    console.log('Token: ', token, ' code: ', code);
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
            select: ['id', 'username', 'avatar', 'email', 'doublefa', 'lvl'],
            relations: ['iFollowList', 'iBlockedList'],
          });
          let iFollowList: number[] = [];
          for (let i = 0; i < user.iFollowList.length; i++)
            iFollowList.push(user.iFollowList[i].id);
          let iBlockedList: number[] = [];
          for (let i = 0; i < user.iBlockedList.length; i++)
            iBlockedList.push(user.iBlockedList[i].id);

          console.log('2fa, id: ', answer.user.id);

          answer.user = await this.findOneForFront(idFromToken, idFromToken);
          console.log(answer.user.username);
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
    });

    var dude = new UsersEntity();

    if (res.length === 0) {
      console.log('Creating profile');
      var i = 0;
      try {
        var lgn = loggedProfile.login;
        let unik = await this.usersRepository.find({
          where: { username: lgn },
        });
        while (unik.length !== 0) {
          lgn = loggedProfile.login + i;
          i += 1;
          console.log('Trying to create user: ', lgn);
          unik = await this.usersRepository.find({
            where: { username: lgn },
          });
        }
      } catch (error) {}
      dude.username = loggedProfile.login + (i > 0 ? i - 1 : '');
      dude.avatar = loggedProfile.image_url;
      dude.email = loggedProfile.email;
      dude.doublefa = 0;

      await this.create(dude);
    } else {
      dude = res[0];
      console.log(`Welcome back, ${dude.username}`);
    }

    return dude;
  }

  async editprofile(data: EditorDTO): Promise<any> {
    try {
      const idFromToken = jwt.verify(data.jwt, Token_Secret);
      // console.log('ID from token: ', idFromToken, ' data.id: ', data.id)
      if (+idFromToken !== +data.id) {
        console.log('Token not corresponding to id');
        return null;
      }
    } catch (error) {
      console.log('Could not verify token');
      return null;
    }

    if (
      data.field === 'username' &&
      typeof data.value === 'string' &&
      data.value !== ''
    ) {
      //check pas de doublons d'id
      let i = 0;
      let login = data.value;
      let res = await this.usersRepository.find({
        username: data.value,
      });
      while (res.length > 0 && res[0].id != data.id) {
        login = data.value + i;
        i = i + 1;
        res = await this.usersRepository.find({
          username: login,
        });
      }
      0;
      await this.usersRepository.update(data.id!, {
        username: login,
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
      // UNBLOCKING A DUDE
      data.field === 'iBlockedList' &&
      typeof data.value[0] === 'string' &&
      typeof data.value[1] === 'number' &&
      (data.value[0] === 'block' || data.value[0] === 'unblock')
    ) {
      console.log('Trying to ', data.value[0]);
      try {
        const test = await this.blockerManager(
          data.id!,
          data.value[1],
          data.value[0],
        );
        if (test === false) {
          return null;
        }
      } catch (error) {
        console.log('The blocker manager crashed');
        return null;
      }
    } else if (
      // UNBLOCKING A DUDE
      data.field === 'iFollowList' &&
      typeof data.value[0] === 'string' &&
      typeof data.value[1] === 'number' &&
      (data.value[0] === 'follow' || data.value[0] === 'unfollow')
    ) {
      console.log('Trying to ', data.value[0]);
      try {
        const test = await this.followerManager(
          data.id!,
          data.value[1],
          data.value[0],
        );
        if (test === false) {
          return null;
        }
      } catch (error) {
        console.log('The follower manager crashed');
        return null;
      }
    } else {
      console.log('Could not edit field: ' + data.field);
      return null;
    }

    console.log('We updated the field ' + data.field + ' in the db');
    const user = await this.usersRepository.findOne({
      where: { id: data.id },
      select: ['id', 'username', 'lvl', 'avatar', 'doublefa', 'email'],
      relations: ['iFollowList', 'iBlockedList'],
    });
    let iFollowList: number[] = [];
    for (let i = 0; i < user.iFollowList.length; i++)
      iFollowList.push(user.iFollowList[i].id);
    let iBlockedList: number[] = [];
    for (let i = 0; i < user.iBlockedList.length; i++)
      iBlockedList.push(user.iBlockedList[i].id);

    const userForFront = await this.findOneForFront(data.id, data.id);
    const res = {
      user: userForFront,
      iFollowList: iFollowList,
      iBlockedList: iBlockedList,
    };

    return res;
  }

  async blockerManager(userid: number, target: number, goal: string) {
    if (userid === target) {
      console.log("You can't block or unblock yourself");
      return false;
    }
    if (goal === 'block' || goal === 'unblock') {
      const userBlocking = await this.usersRepository.findOne({
        where: { id: userid },
        relations: ['iBlockedList'],
      });
      const userTarget = await this.usersRepository.findOne(target);
      for (let i = 0; i < userBlocking.iBlockedList.length; i++) {
        if (userBlocking.iBlockedList[i].id === userTarget.id) {
          console.log('User Target is already Blocked');
          if (goal === 'unblock') {
            console.log('Unblocking him');
            userBlocking.iBlockedList.splice(i, 1);
            await this.usersRepository.save(userBlocking);
            return true;
          } else {
            return false;
          }
        }
      }
      if (goal === 'block') {
        console.log('Blocking User');
        userBlocking.iBlockedList.push(userTarget);
        await this.usersRepository.save(userBlocking);
        return true;
      } else {
        console.log('Trying to unblock a non-blocked user');
        return false;
      }
    } else {
      console.log('Wrong Request Role');
      return false;
    }
  }

  async followerManager(userid: number, target: number, goal: string) {
    if (userid === target) {
      console.log("You can't follow or unfollow yourself");
      return false;
    }
    if (goal === 'follow' || goal === 'unfollow') {
      const userFollowing = await this.usersRepository.findOne({
        where: { id: userid },
        relations: ['iFollowList'],
      });
      const userTarget = await this.usersRepository.findOne(target);
      for (let i = 0; i < userFollowing.iFollowList.length; i++) {
        if (userFollowing.iFollowList[i].id === userTarget.id) {
          console.log('User Target is already Blocked');
          if (goal === 'unfollow') {
            console.log('Unfollow him');
            userFollowing.iFollowList.splice(i, 1);
            await this.usersRepository.save(userFollowing);
            return true;
          } else {
            return false;
          }
        }
      }
      if (goal === 'follow') {
        console.log('Follow User');
        userFollowing.iFollowList.push(userTarget);
        await this.usersRepository.save(userFollowing);
        return true;
      } else {
        console.log('Trying to unblock a non-blocked user');
        return false;
      }
    } else {
      console.log('Wrong Request Role');
      return false;
    }
  }

  //Function to remove, use edit with a user and ['block', idtoblock]
  async blockUser(data: ChangeRoleDTO) {
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
