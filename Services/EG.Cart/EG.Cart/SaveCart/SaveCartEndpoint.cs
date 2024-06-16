using Carter;
using Mapster;
using MediatR;

namespace EG.Cart.SaveCart;

public record SaveCartRequest(Models.Cart Cart);

public record SaveCartResponse(Models.Cart Cart);

public class SaveCartEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("api/v1/cart/save",
                async (SaveCartRequest request, ISender sender) =>
                {
                    var query = request.Adapt<SaveCartQuery>();

                    var result = await sender.Send(query);

                    var response = result.Adapt<SaveCartResponse>();

                    return Results.Ok(response);
                })
            .WithName("Save Cart")
            .Produces<SaveCartResponse>()
            .ProducesProblem(StatusCodes.Status400BadRequest)
            .WithSummary("Save Cart")
            .WithDescription("Save Cart");
    }
}