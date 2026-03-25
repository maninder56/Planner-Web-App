

export type ApiError = 'FetchRequestFailed' | 'DataValidationFailed' | 'ApiUrlNotFound' | 
'BadRequest' | 'Unauthorized' | 'NotFound' | 'InternalServerError' | 'UnknownStatusCode' | 
'Conflict' | 'Forbidden'; 

export type ApiResult<T,ApiErrors> = { ok: true; data?: T; } | { ok: false; error: ApiErrors; }; 