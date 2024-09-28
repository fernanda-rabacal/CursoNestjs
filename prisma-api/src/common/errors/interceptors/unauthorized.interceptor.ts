import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from "@nestjs/common";
import { catchError, Observable } from "rxjs";
import { UnauthorizedError } from "../types/UnauthorizedError";

@Injectable()
export class UnauthorizedInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    //intercepta todos os erros lançados pela aplicação
    return next.handle().pipe(
      //utiliza o catch para pegar o erro
      catchError(error => {
        //se o erro foi da instancia do erro que criamos no types, lança ele já tipado, senão passa ele para frente do jeito que está
        if (error instanceof UnauthorizedError) {
          throw new UnauthorizedException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
