using System.Net;

namespace API.Exceptions; 

public sealed class NotFoundException(string message) 
    : AppException(message, HttpStatusCode.NotFound); 
