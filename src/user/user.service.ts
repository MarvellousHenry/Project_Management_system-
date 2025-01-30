import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
 

  constructor(@InjectRepository(User) private userRepo: Repository<User>, private JWTService) { }
  // async create(payload: CreateUserDto) {
  //   const { email, password, ...rest } = payload;
  //   const user = await
  // }

  findEmail(email: any) {
   return this.userRepo.findOne({ where: { email } });
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async user(headers: any): Promise<any> {
    const authorizationHeader = headers.authorization;
    if(authorizationHeader) {
      const token = authorizationHeader.replace('Bearer', '');
      const secret = process.env.JWTSECRET;

      try {
        const decoded = this.JWTService.verify(token);
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
