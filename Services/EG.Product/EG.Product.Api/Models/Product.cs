using System.Globalization;

namespace EG.Product.Api.Models;

public class Product
{
    public Guid Sku { get; set; }
    public string Name { get; set; } = default!;
    public decimal Price { get; set; }
    public string Unit { get; set; }
    public string Image { get; set; }

    public string DisplayPrice => $"{Price.ToString("C", CultureInfo.GetCultureInfo("en-IN"))}/{Unit}";
}