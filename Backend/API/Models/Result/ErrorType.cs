namespace API.Models.Result; 

public enum ErrorType
{
    Unknown,
    None,
    BadRequest,
    Unauthorized,
    NotFound,
    InternalServerError
}
