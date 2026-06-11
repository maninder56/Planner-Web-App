using API.DTOs.Card.Models;
using API.Models.Card;

namespace API.DTOs.Card.Responses; 

public class AllCardsLockedResponse
{
    public List<CardLockInfo> lockedCards = new List<CardLockInfo>();
}
