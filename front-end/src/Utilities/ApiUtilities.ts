import { ApiError, ApiResult } from "@/Types/ApiTypes";

export function ApiRequestSuccessfull<T>(data?: T): ApiResult<T, ApiError> {
    return { ok: true, data: data }; 
}

export function ApiRequestFailed(error: ApiError): ApiResult<undefined, ApiError> {
    return { ok: false, error: error}; 
}

export function ApiErrorFromStatusCode(statusCode: number) {
    switch(statusCode) {
        case 400: 
        return ApiRequestFailed('BadRequest'); 

        case 401: 
        return ApiRequestFailed('Unauthorized');

        case 404: 
        return ApiRequestFailed('NotFound');

        case 500: 
        return ApiRequestFailed('InternalServerError');

        default: 
        return ApiRequestFailed('UnknownStatusCode');
    }
}