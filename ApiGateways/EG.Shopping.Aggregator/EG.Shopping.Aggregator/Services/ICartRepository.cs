using System.Text;
using System.Text.Json;
using EG.Shopping.Aggregator.Models;

namespace EG.Shopping.Aggregator.Services;

public interface ICartRepository
{
    Task<bool> SaveCart(Cart cart);
}

public class CartRepository : ICartRepository
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<CartRepository> _logger;
    private readonly string _cartEndpoint = "/api/v1";

    CartRepository(HttpClient httpClient, ILogger<CartRepository> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<bool> SaveCart(Cart cart)
    {
        try
        {
            var httpRequest = new HttpRequestMessage(HttpMethod.Post,
                new Uri($"{_cartEndpoint}/cart/save"));

            httpRequest.Content = new StringContent(JsonSerializer.Serialize(cart), Encoding.UTF8,
                "application/json");
            var response = await _httpClient.SendAsync(httpRequest, HttpCompletionOption.ResponseHeadersRead);

            // var result = await response.DeserializeResponseContent<JObject>(_logger, httpRequest);

            return true;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception,
                "CartRepository-SaveCart: Unable to save the data for Cart: {Cart}", cart.CartId);

            return false;
        }
    }
}