import { SetMetadata } from '@nestjs/common';
import { UserRoles } from 'src/user/user.enum';

export const Roles = (...roles: UserRoles[]) => SetMetadata('roles', roles);

export const OrganizationIdExempted = () => SetMetadata('isOrganizationIdNotMandatory', true);