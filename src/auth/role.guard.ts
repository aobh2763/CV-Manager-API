import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.getAllAndOverride<string[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles allow access
    if (!requiredRole) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // user must exist (JWT guard before this)
    if (!user) return false;

    return user.role === requiredRole;
  }
}
