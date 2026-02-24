import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
    catch(exception: RpcException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const rpcError = exception.getError();
        const errorMessage = exception.message;

        if (errorMessage.toLowerCase().includes('empty response')) {
            return response.status(500).json({
                statusCode: 500,
                status: 'error',
                message: errorMessage.substring(0, errorMessage.indexOf('(') - 1),
            });
        }

        if (typeof rpcError === 'object') {
            const statusCode = ('statusCode' in rpcError) ? rpcError.statusCode : 400;
            return response.status(statusCode).json(rpcError);
        }

        response.status(400).json({
            statusCode: 400,
            status: 'error',
            message: errorMessage,
        });
    }
}
