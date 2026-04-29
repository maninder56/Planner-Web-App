using DatabaseContext;
using Microsoft.EntityFrameworkCore;

namespace API.Queries.Lists; 

public class ListQueries(PlannerContext database)
{
    public async Task<List<int>> GetListOrderAsync(int boardId)
    {
        var query = await database.BoardLists.AsNoTracking()
            .Where(bl => bl.BoardId == boardId)
            .OrderBy(bl => bl.ListPosition)
            .Select(bl => bl.BoardListId)
            .ToListAsync();

        return query;
    }
}
