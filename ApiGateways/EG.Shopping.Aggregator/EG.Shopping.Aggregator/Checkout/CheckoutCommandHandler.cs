using EG.Shopping.Aggregator.CQRS;
using EG.Shopping.Aggregator.Services;
using FluentValidation;

namespace EG.Shopping.Aggregator.Checkout;

public record CheckoutCommand(Models.Checkout Checkout) : ICommand<CheckoutResult>;

public record CheckoutResult(bool Success);

public class CartCommandValidator : AbstractValidator<CheckoutCommand>
{
    public CartCommandValidator()
    {
        RuleFor(x => x.Checkout.Cart).NotNull().WithMessage("Cart can not be null");
        RuleFor(x => x.Checkout.Cart.Items).NotEmpty().WithMessage("Item(s) are required");
    }
}


internal class CheckoutCommandHandler()
    : ICommandHandler<CheckoutCommand, CheckoutResult>
{
    public async Task<CheckoutResult> Handle(CheckoutCommand command, CancellationToken cancellationToken)
    {
        // writing a flowchart due to time constraints
        // 1. Verify discount
        // 2. Verify product and stock
        // 2.1 Verify billing & shipping address, personal information
        // 3. Save cart
        // 4. payment
        // 5. place order
        // 6. send email
        
        // cartRepository.SaveCart(command.Checkout.Cart);   
        return new CheckoutResult(true);
    }
}