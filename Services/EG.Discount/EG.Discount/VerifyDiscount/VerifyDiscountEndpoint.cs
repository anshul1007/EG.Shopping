using Carter;
using Mapster;
using MediatR;

namespace EG.Discount.VerifyDiscount;

public record VerifyDiscountRequest(string DiscountCode);

public record VerifyDiscountResponse(Models.Discount Discount);

public class VerifyDiscountEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapGet("api/v1/discount/verify", async ([AsParameters] VerifyDiscountRequest request, ISender sender) =>
            {
                var query = request.Adapt<VerifyDiscountQuery>();

                var result = await sender.Send(query);

                var response = result.Adapt<VerifyDiscountResponse>();

                return Results.Ok(response);
            })
            .WithName("VerifyDiscount")
            .Produces<VerifyDiscountResponse>()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Verify Discount")
            .WithDescription("Verify Discount");
    }
}