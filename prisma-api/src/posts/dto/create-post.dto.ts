import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostDto {
  @ApiProperty({
    description: "Título do post",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Conteúdo do post",
    nullable: true,
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: "E-mail do usuário autor do post",
  })
  @IsEmail()
  authorEmail: string;
}
