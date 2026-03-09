using DatabaseContext;
using System.Runtime.CompilerServices;

namespace API.Queries.Boards; 

public static class BoardAccessFilters
{
    public static IQueryable<BoardMembers> WhereUserHasAccess(
        this IQueryable<BoardMembers> query, 
        int userId, 
        int boardId)
    {
        return query.Where(bm => bm.UserId == userId && bm.BoardId == boardId);
    }
}
