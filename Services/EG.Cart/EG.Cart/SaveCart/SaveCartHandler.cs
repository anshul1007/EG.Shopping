using EG.Cart.CQRS;
using EG.Cart.Data;

namespace EG.Cart.SaveCart;

public record SaveCartQuery(Models.Cart cart) : IQuery<SaveCartResult>;

public record SaveCartResult(bool Success);

internal class SaveCartHandler(IDataRepository dataRepository)
    : IQueryHandler<SaveCartQuery, SaveCartResult>
{
    public async Task<SaveCartResult> Handle(SaveCartQuery query, CancellationToken cancellationToken)
    {
        dataRepository.SaveCart(query.cart);
        return new SaveCartResult(true);
    }
}