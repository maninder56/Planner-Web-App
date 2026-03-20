namespace API.Repositories.Profile; 

public interface IProfileRepository
{
    public Task UpdateUserNameAsync(int userId, string newName);

    public Task DeleteProfileAsync(int userId); 
}
