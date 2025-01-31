import { Injectable } from "@nestjs/common";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ForbiddenRoleException } from "src/exception/role.exception";
import { UserService } from "src/user/user.service";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector, private userService: UserService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        const request = context.switchToHttp().getRequest();

        if (request?.user) {
            const hearders: Headers = request.headers;
            let user = this.userService.user(hearders);

            if (!roles.includes((await user).role)) {
                throw new ForbiddenRoleException(roles.join(' or '));
            }
            return true;
        }
        return false
    }
}