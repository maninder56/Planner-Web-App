using API.Exceptions;
using API.Extensions;
using API.Policies.Requirements;
using API.Queries.Boards;
using DatabaseContext;
using Microsoft.AspNetCore.Authorization;

namespace API.Policies.Handlers;

public class BoardDeleteHandler(BoardQueries boardQueries) 
    : AuthorizationHandler<BoardDeleteRequirement, int>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context, 
        BoardDeleteRequirement requirement, 
        int boardId)
    {
        int userId = context.User.GetUserId();

        BoardMember boardMember = await boardQueries.GetBoardMemberAsync(userId, boardId)
            ?? throw new NotFoundException("Board not found");

        if (requirement.Roles.Any(r => r == boardMember.Role))
        {
            context.Succeed(requirement);
        }
    }
}
