//import { IsEmail, IsNotEmpty } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { PartialType } from "@nestjs/mapped-types";

// export class LoginDto{
//     @IsNotEmpty()
//     @IsEmail()
//     email: string;

//     @IsNotEmpty()
//     password: string
// }
//OR


export class LoginDto extends PartialType(CreateUserDto){}