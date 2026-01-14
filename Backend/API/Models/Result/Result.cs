namespace API.Models.Result; 

public class Result<E> where E : Enum
{
    public bool Successful { get; }

    public E? Error { get; }

    protected Result(bool success, E? error)
    {
        Successful = success; Error = error;
    }

    public static Result<E> Success() => new Result<E>(true, default);
    public static Result<E> Failed(E error) => new Result<E>(false, error);
}


public class Result<D, E> : Result<E> where E : Enum
{
    public D? Data { get; }

    protected Result(bool success, D? data, E? error) : base(success, error)
    {
        Data = data;
    }

    public static Result<D, E> Success(D data) => new Result<D, E>(true, data, default);
    new public static Result<D, E> Failed(E error) => new Result<D, E>(false, default, error);
}

public class Result<D, D2, E> : Result<D, E> where E : Enum
{
    public D2? Data2 { get; }

    protected Result(bool success, D? data, D2? data2, E? error) : base(success, data, error)
    {
        Data2 = data2;  
    }

    public static Result<D, D2, E> Success(D data, D2 data2) => new Result<D, D2, E>(true, data, data2, default);
    new public static Result<D, D2, E> Failed(E error) => new Result<D, D2, E>(false, default, default, error);
}
