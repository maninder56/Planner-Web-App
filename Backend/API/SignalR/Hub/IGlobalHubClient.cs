using API.DTOs.Board.Responses;
using API.DTOs.Card.Responses;
using API.DTOs.Invitation.Responses;
using API.DTOs.List.Responses;
using API.DTOs.User.Responses;
using API.Models.Account;

namespace API.SignalR.Hub; 

public interface IGlobalHubClient
{
    Task ReceiveInvitationNotification(InvitationInfoResponse invitationInfo);


    Task UserHasJoinedTheBoard(UserJoiningInfoResponse userInfo);
    Task UserHasLeftTheBoard(UserLeavingInfoResponse userInfo);

    Task CurrentOnlineUsers(List<UserInfo> users);

    // Board changes
    Task BoardColourChanged(BoardColourChangedResponse newBackgroundColour);
    
    Task BoardHasBeenDeleted(BoardDeletedResponse boardDeleted);
    Task ListHasBeenDeleted(ListDeletedResponse listDeleted); 
    Task CardHasBeenDeleted(CardDeletedResponse cardDeleted);

    Task CardMarkStateChanged(CardMarkStateResponse cardMarkState);

    Task ListPositionChanged(ListOrderResponse newListOrder);
    Task CardPositionChanged(UpdatedCardOrderResponse updatedCardOrder);

    Task NewCardAdded(NewCardAddedResponse newCard);
    Task NewListAdded(NewListAddedResponse newList);

    Task ListNameUpdated(ListNameUpdated listName); 
}
