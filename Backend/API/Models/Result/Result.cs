using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;

namespace API.Models.Result; 

public class Result
{
    public bool Successful { get; }

    public Error Error { get; } = new Error(ErrorType.None, ""); 

    protected Result(bool success)
    {
        Successful = success;
    }

    //protected Result(bool success, Error error)
    //{
    //    Successful = success; Error = error;
    //}

    protected Result(bool success, ErrorType errorType, string title, string? description = null)
    {
        Successful = success;
        Error = new Error(errorType, title, description); 
    }

    public static Result Success() => new Result(true);

    //public static Result Failed(Error error) => new Result(false, error);

    public static Result Failed(ErrorType errorType, string title, string? descriptiton = null) 
        => new Result(false, errorType, title, descriptiton);
}


public class Result<T> : Result 
{
    public T? Data { get; } = default; 

    protected Result(bool success, T data) 
        : base(success)
    {
        Data = data;
    }

    protected Result(bool success, ErrorType errorType, string title, string? description = null)
        : base(success, errorType, title, description) { }


    public static Result<T> Success(T data) => 
        new Result<T>(true, data);

    new public static Result<T> Failed (ErrorType errorType, string title, string? description = null) =>
        new Result<T>(false, errorType, title, description);

}

public class Result<T, T2> : Result<T> 
{
    public T2? Data2 { get; } = default; 

    protected Result(bool success, T data, T2 data2)
        : base(success, data)
    {
        Data2 = data2;
    }

    protected Result(bool success, ErrorType errorType, string title, string? description = null)
        : base(success, errorType, title, description) { }


    public static Result<T, T2> Success(T data, T2 data2) => 
        new Result<T, T2>(true, data, data2);

    new public static Result<T, T2> Failed(ErrorType errorType, string title, string? description = null) => 
        new Result<T, T2>(false, errorType, title, description);
}

