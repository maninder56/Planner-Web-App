using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;

namespace API.Models.Result; 

public class Result<E> where E : Enum
{
    public bool Successful { get; }

    public E? Error { get; }

    public ProblemDetails ProblemDetails { get; } 

    protected Result(bool success, E? error, ProblemDetails problemDetails)
    {
        Successful = success; Error = error; ProblemDetails = problemDetails;
    }

    public static Result<E> Success() 
        => new Result<E>(true, default, new ProblemDetails());

    public static Result<E> Failed(E error, ProblemDetails problemDetails) 
        => new Result<E>(false, error, problemDetails);
}


public class Result<D, E> : Result<E> where E : Enum
{
    public D? Data { get; }

    protected Result(bool success, D? data, E? error, ProblemDetails problemDetails) 
        : base(success, error, problemDetails)
    {
        Data = data;
    }

    public static Result<D, E> Success(D data) => 
        new Result<D, E>(true, data, default, new ProblemDetails());

    new public static Result<D, E> Failed(E error, ProblemDetails problemDetails) =>
        new Result<D, E>(false, default, error, problemDetails);
}

public class Result<D, D2, E> : Result<D, E> where E : Enum
{
    public D2? Data2 { get; }

    protected Result(bool success, D? data, D2? data2, E? error, ProblemDetails problemDetails) 
        : base(success, data, error, problemDetails)
    {
        Data2 = data2;  
    }

    public static Result<D, D2, E> Success(D data, D2 data2) => 
        new Result<D, D2, E>(true, data, data2, default, new ProblemDetails());

    new public static Result<D, D2, E> Failed(E error, ProblemDetails problemDetails) => 
        new Result<D, D2, E>(false, default, default, error, problemDetails);
}

