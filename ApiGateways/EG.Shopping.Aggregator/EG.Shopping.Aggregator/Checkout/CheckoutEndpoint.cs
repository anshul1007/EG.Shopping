using Carter;
using Mapster;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EG.Shopping.Aggregator.Checkout;

public record CheckoutRequest(Models.Checkout Checkout);

public record CheckoutResponse(bool Success);

public class CheckoutEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/aggregator/checkout", async (CheckoutRequest request, ISender sender) =>
            {
                var query = request.Adapt<CheckoutCommand>();

                var result = await sender.Send(query);

                var response = result.Adapt<CheckoutResponse>();

                return Results.Ok(response);
            })
            .WithName("Checkout")
            .Produces<CheckoutResponse>()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Checkout")
            .WithDescription("Checkout");
    }
}