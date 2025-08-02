// auth/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtConfig } from 'src/config/jwt.config';
import { InvitationStatus, UserRoles } from 'src/user/user.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    const organizationId = request.headers['organization-id'];
    request['organizationId'] = organizationId;

    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>('roles', [
      context.getHandler(),
      context.getClass()
    ]);

    const isOrganizationIdNotMandatory = this.reflector.getAllAndOverride<Boolean>('isOrganizationIdNotMandatory', [
      context.getHandler(),
      context.getClass()
    ])

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JwtConfig.secretKeyAccessToken,
      });
      request.user = payload;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
    const userRoles = request.user['roles']
    const isSuperAdmin = request.user['isSuperAdmin'];
    if(isOrganizationIdNotMandatory) {
      return true;
    }
    else {
      if (!organizationId) {
        throw new UnauthorizedException('Organization ID is required');
      }
      if (isSuperAdmin) {
        return true;
      }
      if(requiredRoles?.length) {
        const userRoleForOrganization = userRoles.find(role => role.organizationId === organizationId && role.invitationStatus === InvitationStatus.ACCEPTED);
        if (!userRoleForOrganization || !requiredRoles.includes(userRoleForOrganization.role)) {
          throw new UnauthorizedException('User does not have the required role for this organization');
        }
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers['authorization'];
    if (!authHeader) return undefined;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
