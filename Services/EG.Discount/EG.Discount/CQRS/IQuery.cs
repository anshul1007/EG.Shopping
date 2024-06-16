using MediatR;

namespace EG.Discount.CQRS;

public interface IQuery<out TResponse> : IRequest<TResponse>  
    where TResponse : notnull
{
}