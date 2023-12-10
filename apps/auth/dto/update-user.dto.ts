import { PartialType } from '@nestjs/mapped-types';
import { CreatedUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreatedUserDto) {}
