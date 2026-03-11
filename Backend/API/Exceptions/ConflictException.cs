using System.Net;

namespace API.Exceptions; 

public sealed class ConflictException(string message) 
    : AppException(message, HttpStatusCode.Conflict); 
