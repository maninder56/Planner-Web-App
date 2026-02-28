

export type ApiError = 'FetchRequestFailed' | 'DataValidationFailed' | 'ApiUrlNotFound' | 
'BadRequest' | 'Unauthorized' | 'NotFound' | 'InternalServerError' | 'UnknownStatusCode'; 

export type ApiResult<T,ApiErrors> = { ok: true; data?: T; } | { ok: false; error: ApiErrors; }; 