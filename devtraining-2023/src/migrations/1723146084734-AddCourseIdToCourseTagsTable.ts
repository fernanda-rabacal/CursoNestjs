import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AddCourseIdToCourseTagsTable1723146084734
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('course_tags', [
      new TableColumn({
        name: 'id_course',
        type: 'uuid',
        isNullable: true,
      }),
      new TableColumn({
        name: 'id_tag',
        type: 'uuid',
        isNullable: true,
      }),
    ]);

    await queryRunner.createForeignKeys('course_tags', [
      new TableForeignKey({
        name: 'course_tags_courses',
        columnNames: ['id_course'],
        referencedTableName: 'courses',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
      new TableForeignKey({
        name: 'course_tags_tags',
        columnNames: ['id_tag'],
        referencedTableName: 'tags',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('course_tags', 'course_tags_tags');
    await queryRunner.dropForeignKey('course_tags', 'course_tags_courses');

    await queryRunner.dropTable('course_tags');
  }
}
