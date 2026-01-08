namespace API.Models.Result; 

public class Result<D, E> where E : Enum
{
    public bool Successful { get; }

    public D? Data { get; }

    public E? Error { get; }

    private Result(bool success, D? data, E? error)
    {
        Successful = success; Data = data; Error = error;
    }

    public static Result<D, E> Success(D? data) => new Result<D, E>(true, data, default);
    public static Result<D, E> Failed(E error) => new Result<D, E>(false, default, error);
}
