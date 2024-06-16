using EG.Discount.CQRS;
using EG.Discount.Data;
using EG.Discount.Exceptions;

namespace EG.Discount.VerifyDiscount;

public record VerifyDiscountQuery(string discountCode) : IQuery<VerifyDiscountResult>;

public record VerifyDiscountResult(Models.Discount Discount);

internal class VerifyDiscountHandler(IDataRepository dataRepository)
    : IQueryHandler<VerifyDiscountQuery, VerifyDiscountResult>
{
    public async Task<VerifyDiscountResult> Handle(VerifyDiscountQuery query, CancellationToken cancellationToken)
    {
        var discount = dataRepository.VerifyDiscount().FirstOrDefault(x => x.Code.Equals(query.discountCode, StringComparison.OrdinalIgnoreCase));
        if(discount is null)
            throw new NotFoundException("Discount not found");
        return new VerifyDiscountResult(discount);
    }
}