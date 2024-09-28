import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('course_tags')
export class CourseTag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column()
  @PrimaryColumn()
  id_course: string;

  @Column()
  @PrimaryColumn()
  id_tag: string;
}
