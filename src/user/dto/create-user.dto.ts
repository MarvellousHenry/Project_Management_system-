import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, matches, MaxLength, MinLength } from "class-validator";
import { userRole } from "../enum/user.role.enum";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8, {message:'sorry you must put in 8 characters'})
    @MaxLength(16, {message: 'password should not be more than 16 characters'})
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/, /*Regular Expression*/ {message: 'password should have at least 1 uppercase, 1 lowercase, 1 number'})
    password: string;

    @IsOptional()
    role: userRole 
}
