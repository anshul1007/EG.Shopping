using EG.Product.Api.CQRS;
using EG.Product.Api.Data;


namespace EG.Product.Api.GetProducts;

public record GetProductsQuery(int? PageNumber = 1, int? PageSize = 10) : IQuery<GetProductsResult>;

public record GetProductsResult(IEnumerable<Models.Product> Products);

internal class GetProductsQueryHandler(IDataRepository dataRepository)
    : IQueryHandler<GetProductsQuery, GetProductsResult>
{
    public async Task<GetProductsResult> Handle(GetProductsQuery query, CancellationToken cancellationToken)
    {
        var products = dataRepository.GetProducts().Skip((int)((query.PageNumber - 1) * query.PageSize))
            .Take((int)query.PageSize);

        return new GetProductsResult(products);
    }
}