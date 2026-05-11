using API.Exceptions;
using API.Extensions;
using API.Policies.Requirements;
using API.Queries.Boards;
using DatabaseContext;
using Microsoft.AspNetCore.Authorization;

namespace API.Policies.Handlers;

public class BoardPermissionHandler(BoardQueries boardQueries)
    : AuthorizationHandler<BoardPermissionRequirement, int>
{
    protected override async Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        BoardPermissionRequirement requirement,
        int boardId)
    {
        int userId = context.User.GetUserId();

        BoardMember? boardMember = await boardQueries.GetBoardMemberAsync(userId, boardId);

        if (boardMember is null)
            throw new NotFoundException("Board not found");

        if (requirement.Roles.Contains(boardMember.Role))
        {
            context.Succeed(requirement);
        }
    }
}