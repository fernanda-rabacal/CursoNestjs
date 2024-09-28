import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CreateCoursesTables1723144249132 } from '../migrations/1723144249132-CreateCoursesTables';
import { CreateTagsTable1723144907070 } from '../migrations/1723144907070-CreateTagsTable';
import { CreateCourseTagsTable1723145754218 } from '../migrations/1723145754218-CreateCourseTagsTable';
import { AddCourseIdToCourseTagsTable1723146084734 } from '../migrations/1723146084734-AddCourseIdToCourseTagsTable';
import { Course } from '../courses/entities/courses.entity';
import { Tag } from '../courses/entities/tags.entity';
import { CourseTag } from '../courses/entities/course-tags.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Course, Tag, CourseTag],
  synchronize: false,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
  synchronize: false,
  migrations: [
    CreateCoursesTables1723144249132,
    CreateTagsTable1723144907070,
    CreateCourseTagsTable1723145754218,
    AddCourseIdToCourseTagsTable1723146084734,
  ],
});
