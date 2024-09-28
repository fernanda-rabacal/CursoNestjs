import { CreateCourseDTO } from './dto/create-course.dto';
import { randomUUID } from 'crypto';
import { CoursesService } from './courses.service';
import { UpdateCourseDTO } from './dto/update-course.dto';

describe('CoursesService', () => {
  let service: CoursesService;
  let id: string;
  let created_at: Date;
  let expectedOutputTags: any;
  let expectedOutputCourses: any;
  let mockTagsRepository: any;
  let mockCoursesRepository: any;

  //define algum processo antes de cada teste. o beforeAll define uma vez só antes de qualquer teste rodar
  //Existe tbm o afeterEach e afterAll
  beforeEach(async () => {
    /* const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesService],
    }).compile(); */

    service = new CoursesService(); //module.get<CoursesService>(CoursesService);
    id = randomUUID();
    created_at = new Date();
    expectedOutputTags = [
      {
        id,
        name: 'nestjs',
        created_at,
      },
    ];
    expectedOutputCourses = {
      id,
      name: 'test',
      description: 'test description',
      tags: expectedOutputTags,
      created_at,
    };

    mockCoursesRepository = {
      //mock do repositorio, o jest possui o fn para mockar função
      create: jest.fn().mockReturnValue(Promise.resolve(expectedOutputCourses)),
      save: jest.fn().mockReturnValue(Promise.resolve(expectedOutputCourses)),
      update: jest.fn().mockReturnValue(Promise.resolve(expectedOutputCourses)),
      find: jest.fn().mockReturnValue(Promise.resolve(expectedOutputCourses)),
      remove: jest.fn().mockReturnValue(Promise.resolve(expectedOutputCourses)),
      preload: jest
        .fn()
        .mockReturnValue(Promise.resolve(expectedOutputCourses)),
      preloadTagByName: jest
        .fn()
        .mockReturnValue(Promise.resolve(expectedOutputTags)),
      findAll: jest
        .fn()
        .mockReturnValue(Promise.resolve(expectedOutputCourses)),
      findOne: jest
        .fn()
        .mockReturnValue(Promise.resolve(expectedOutputCourses)),
    };

    mockTagsRepository = {
      create: jest.fn().mockReturnValue(Promise.resolve(expectedOutputTags)),
      findOne: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a course', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCoursesRepository;
    //@ts-expect-error defined part of methods
    service['tagRepository'] = mockTagsRepository;

    const createCourseDTO: CreateCourseDTO = {
      name: 'test',
      description: 'test description',
      tags: ['nestjs'],
    }

    const newCourse = await service.create(createCourseDTO);

    expect(mockCoursesRepository.save).toHaveBeenCalled();
    expect(expectedOutputCourses).toStrictEqual(newCourse);
  });

  //não vai funcionar por conta do createQueryBuilder
/*   it('should list all courses', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCoursesRepository;

    const courses = await service.findAll();

    expect(mockCoursesRepository.find).toHaveBeenCalled();
    expect(expectedOutputCourses).toStrictEqual(courses);
  }); */

  it('should find one course by id', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCoursesRepository;

    const course = await service.findOne(id);

    expect(mockCoursesRepository.findOne).toHaveBeenCalled();
    expect(expectedOutputCourses).toStrictEqual(course);
  });

  
  it('should update a course', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCoursesRepository;
    //@ts-expect-error defined part of methods
    service['tagRepository'] = mockTagsRepository;

    const updateCourseDTO: UpdateCourseDTO = {
      name: 'test',
      description: 'test description',
      tags: ['nestjs'],
    }

    const updatedCourse = await service.update(id, updateCourseDTO);

    expect(mockCoursesRepository.preload).toHaveBeenCalled();
    expect(mockCoursesRepository.save).toHaveBeenCalled();
    expect(expectedOutputCourses).toStrictEqual(updatedCourse);
  });

  it('should remove a course by id', async () => {
    //@ts-expect-error defined part of methods
    service['courseRepository'] = mockCoursesRepository;

    const course = await service.remove(id);

    expect(mockCoursesRepository.findOne).toHaveBeenCalled();
    expect(mockCoursesRepository.remove).toHaveBeenCalled();
    expect(expectedOutputCourses).toStrictEqual(course);
  });
});
