import { IsEmail, IsNotEmpty } from 'class-validator';

class TestDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export default TestDto;
