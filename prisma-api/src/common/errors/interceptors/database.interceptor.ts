import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from "@nestjs/common";
import { catchError, Observable } from "rxjs";
import { isPrismaError } from "../utils/is-prisma-error.util";
import { handleDatabaseErrors } from "../utils/handle-database-errors.util";
import { DatabaseError } from "../types/DatabaseError";

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        //Verifico se é um erro prisma
        if (isPrismaError(error)) {
          //capto a instancia do tipo do erro, se ele é especifico ou não
          error = handleDatabaseErrors(error);
        }

        //se for um erro generico não especificado pelo codigo do prisma, lança esse
        if (error instanceof DatabaseError) {
          throw new BadRequestException(error.message);
        }

        //lança o erro especifico
        throw error;
      }),
    );
  }
}
