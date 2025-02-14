import { IsEnum } from "class-validator";
import { userRole } from "../enum/user.role.enum";

    export class RoleUpdate{
        @IsEnum(userRole)
        role: userRole;     
    }