export class CreatedUserDto {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  id: number;
  token: string | null;
}
export class CreateUserInputDTO {
  name?: string;
  email?: string;
  password?: string;
  user_name?: string;
}
