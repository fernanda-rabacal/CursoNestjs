import { CreatePostDto } from "./../dto/create-post.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { PostEntity } from "../entities/post.entity";
import { UpdatePostDto } from "../dto/update-post.dto";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { NotFoundError } from "src/common/errors/types/NotFoundError";

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PostEntity[]> {
    return this.prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: number): Promise<PostEntity> {
    return this.prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getByAuthorId(authorId: number): Promise<PostEntity[]> {
    return this.prisma.user
      .findUnique({
        where: {
          id: authorId,
        },
      })
      .posts();
  }

  async create(createPostDto: CreatePostDto): Promise<PostEntity> {
    const { authorEmail, title, content } = createPostDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email: authorEmail,
      },
    });

    if (!user) {
      throw new NotFoundError("Author not found.");
    }

    const data: Prisma.PostCreateInput = {
      title,
      content,
      author: {
        connect: user,
      },
    };

    return this.prisma.post.create({
      data,
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<PostEntity> {
    const { authorEmail, title, content } = updatePostDto;

    let data: Prisma.PostUpdateInput = {
      title,
      content,
    };

    if (authorEmail) {
      const user = await this.prisma.user.findUnique({
        where: {
          email: authorEmail,
        },
      });

      if (!user) {
        throw new NotFoundError("Author not found.");
      }

      data = {
        ...data,
        author: {
          connect: {
            email: authorEmail,
          },
        },
      };
    }

    return this.prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async remove(id: number): Promise<PostEntity> {
    return this.prisma.post.delete({
      where: {
        id,
      },
    });
  }
}
