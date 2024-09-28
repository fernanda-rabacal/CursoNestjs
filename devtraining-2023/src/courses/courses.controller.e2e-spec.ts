import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Course } from './entities/courses.entity';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Tag } from './entities/tags.entity';
import { CourseTag } from './entities/course-tags.entity';
import { CoursesModule } from './courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { CreateCoursesTables1723144249132 } from '../migrations/1723144249132-CreateCoursesTables';
import { CreateTagsTable1723144907070 } from '../migrations/1723144907070-CreateTagsTable';
import { CreateCourseTagsTable1723145754218 } from '../migrations/1723145754218-CreateCourseTagsTable';
import { AddCourseIdToCourseTagsTable1723146084734 } from '../migrations/1723146084734-AddCourseIdToCourseTagsTable';

describe('CoursesController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let data: any;
  let courses: Course[];

  const dataSourceTest: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5433,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Course, Tag, CourseTag],
    synchronize: false,
    migrations: [
      CreateCoursesTables1723144249132,
      CreateTagsTable1723144907070,
      CreateCourseTagsTable1723145754218,
      AddCourseIdToCourseTagsTable1723146084734,
    ],
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        CoursesModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return dataSourceTest;
          },
        }),
      ],
    }).compile();

    app = module.createNestApplication();

    await app.init();

    data = {
      name: 'Node.js',
      description: 'Test data',
      tags: ['nodejs', 'nestjs'],
    };
  });

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize();
    const repository = dataSource.getRepository(Course);
    courses = await repository.find();

    await dataSource.destroy();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('POST /courses', () => {
    it('should create a course', async () => {
      const res = await request(app.getHttpServer())
        .post('/courses')
        .send(data)
        .expect(201);
      expect(res.body.id).toBeDefined();
      expect(res.body.created_at).toBeDefined();
      expect(res.body.name).toEqual(data.name);
      expect(res.body.description).toEqual(data.description);
      expect(res.body.tags[0].name).toEqual(data.tags[0]);
      expect(res.body.tags[1].name).toEqual(data.tags[1]);
    });
  });

  describe('GET /courses', () => {
    it('should list all courses', async () => {
      const res = await request(app.getHttpServer())
        .get('/courses')
        .expect(200);
      expect(res.body[0].id).toBeDefined();
      expect(res.body[0].name).toEqual(data.name);
      expect(res.body[0].description).toEqual(data.description);
      expect(res.body[0].created_at).toBeDefined();
      res.body.map((item) =>
        expect(item).toEqual({
          id: item.id,
          name: item.name,
          description: item.description,
          created_at: item.created_at,
          tags: [...item.tags],
        }),
      );
    });
  });

  describe('GET /courses/:id', () => {
    it('should get a course by id', async () => {
      const res = await request(app.getHttpServer())
        .get(`/courses/${courses[0].id}`)
        .expect(200);
      expect(res.body.id).toEqual(courses[0].id);
      expect(res.body.name).toEqual(courses[0].name);
      expect(res.body.description).toEqual(courses[0].description);
    });
  });

  describe('PUT /courses/:id', () => {
    const updateData = {
      name: 'New name',
      description: 'New description',
      tags: ['one', 'two'],
    };

    it('should update a course by id', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/courses/${courses[0].id}`)
        .send(updateData)
        .expect(200);
      expect(res.body.id).toEqual(courses[0].id);
      expect(res.body.name).toEqual(updateData.name);
      expect(res.body.description).toEqual(updateData.description);
      expect(res.body.tags).toHaveLength(2);
      expect(res.body.tags[0].name).toEqual('one');
      expect(res.body.tags[1].name).toEqual('two');
    });
  });

  describe('GET /courses/:id', () => {
    it('should remove a course', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/courses/${courses[0].id}`)
        .expect(204)
        .expect({});
    });
  });
});
