import { Type } from "class-transformer";
import { IsNumber, IsUrl } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";

export class CreateProjectDto {
  @IsUrl()
  url: string;

  @IsNumber()
  @Type(() => Number)
  cvId: number;
}

export class UpdateProjectDto extends PartialType(CreateProjectDto) { }
