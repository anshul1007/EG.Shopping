using MediatR;

namespace EG.Shopping.Aggregator.CQRS;

public interface IQuery<out TResponse> : IRequest<TResponse>  
    where TResponse : notnull
{
}