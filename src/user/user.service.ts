import { HttpException, Injectable, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.user.dto';
import { RoleUpdate } from './dto/Role.UpdateUser';


@Injectable()
export class UserService {
 


  constructor(@InjectRepository(User) private userRepo: Repository<User>, private jwtService: JwtService) { }

  async create(payload: CreateUserDto) {
    payload.email = payload.email.toLowerCase();
    const { email, password, ...rest } = payload;
    const user = await this.userRepo.findOne({ where: { email: email } });
    if (user) {
      throw new HttpException('Email already exists', 400);
    }
    const hashedPassword = await argon2.hash(password);

    const userDetails = await this.userRepo.save({
      ...rest, email, password: hashedPassword
    });

    delete userDetails.password;
    const Userpayload = { email: userDetails.email, id: userDetails.id };
    return {
      access_token: await this.jwtService.signAsync(Userpayload),
    };
  }

  async LogIn(payload: LoginDto, @Req() req: Request, @Res() res: Response) {
    const { email, password } = payload;

    const user = await this.userRepo.findOneBy({ email })
    if (!user) {
      throw new HttpException('No email found', 400)
    }

    const checkedPassword = await this.verifyPassword(user.password, password);
    if (!checkedPassword) {
      throw new HttpException('sorry password not exit', 400)
    }
    const token = await this.jwtService.signAsync({
      email: user.email,
      id: user.id
    });

    res.cookie('isAuthenticated', token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000,
    });
    return res.send({
      success: true,
      usertoken: token
    })
  }

  async logout(@Req() req: Request, @Res() res: Response) {
    const clearCookie = res.clearCookie('isAuthenticated');

    const response = res.send(' user successfully logout');

    return {
      clearCookie,
      response
    }
  }


    findEmail(email: any) {
      return this.userRepo.findOne({ where: { email } });
    }

    async findAll() {
      return this.userRepo.find()
    }

    async findOne(id: string) {
      // return `This action returns a #${id} user`;
      const findOne = await this.userRepo.findOne({where:{id:id}});
      if (!findOne) throw new HttpException ('id does not exist', 400)
        return findOne;
    }
  

    async update(id: string, updateUserDto:RoleUpdate) {
     const user = this.userRepo.findOne({where:{id:id}});

     if (!user) {
      throw new HttpException('User Not Found', 404);
     }
     const update = await this.userRepo.update(id, updateUserDto);
     const updatedUser = await this.userRepo.findOne({where:{id:id}});
      return{
        statusCode:200, 
        message: `user role is ${updatedUser.role}`,
       }
    }


    async remove(id: string) {
     const user = await this.userRepo.findOne({where:{id:id}});
     if (!user) {
      throw new HttpException('User Not Found', 404);
     }
     const remove = await this.userRepo.delete(id);
     return {
      statusCode:200,
      message: `${user.name} is deleted successfully`,
     }
    }
   
  

  async verifyPassword(hashedPassword: string, plainPassword: string): Promise < boolean > {
      try{
        return await argon2.verify(hashedPassword, plainPassword);
      } catch(error) {
        console.log(error.message)
        return false;
      }
    }

  async user(headers: any): Promise < any > {
      const authorizationHeader = headers.authorization;
      if(authorizationHeader) {
        const token = authorizationHeader.replace('Bearer ', '');
        const secret = process.env.JWTSECRET;

        try {
          const decoded = this.jwtService.verify(token);
          let id = decoded["id"];
          let user = await this.userRepo.findOneBy({ id });

          return { id: user.id, name: user.name, email: user.email, role: user.role };
        }
        catch (error) {
          throw new UnauthorizedException('Invalid token');
        }

      } else {
        throw new UnauthorizedException('Invalid or missing Bearer token');
      }
    }
  }

