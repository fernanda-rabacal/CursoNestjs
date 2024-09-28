import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  /*   Res, */
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
//import { Response } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  /* decorator @Res() para usar o objeto resposta padrão do express */
  findAll() {
    return this.coursesService.findAll();
    // return response.status(200).json({ message: 'Listagem de cursos' });
  }

  @Get(':id')
  /* Decorator @Param para captar parametros de rotas */
  findOne(@Param('id') id: string) {
    //@Param() { id }
    return this.coursesService.findOne(id);
  }

  /*  @Get(':id/:name')
  findByName(@Param('id') id: string, @Param('name') name: string) {
    return `Curso com id ${id} e nome ${name}`;
  } */

  //@HttpCode(204)
  @Post()
  create(@Body() createCourseDTO: CreateCourseDTO) {
    return this.coursesService.create(createCourseDTO);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDTO: UpdateCourseDTO) {
    return this.coursesService.update(id, updateCourseDTO);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.coursesService.remove(id);
  }
}
