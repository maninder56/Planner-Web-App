namespace API.Repositories.Profile; 

public interface IProfileRepository
{
    public Task UpdateUserNameAsync(int userId, string newName); 
}
