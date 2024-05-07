import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllHttpExceptionFilter implements ExceptionFilter {
  //create logger
  private readonly logger = new Logger(AllHttpExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const msgError =
      exception instanceof HttpException ? exception.getResponse() : exception;
    this.logger.error(`Status: ${status} Error: ${JSON.stringify(msgError)}`); //construccion del error para retornar como msj JSON
    response.status(status).json({
      time: new Date().toISOString(),
      path: request.url,
      error: msgError,
    });
  }
}
