import { IsDateString, IsNumberString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class ProgramGetParams {
  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  dateFrom?: string;

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  dateTill?: string;

  @IsNumberString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: string;
}

export default ProgramGetParams;
