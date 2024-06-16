using System.Xml.Linq;

namespace EG.Product.Api.Data;

public interface IDataRepository
{
    IQueryable<Models.Product> GetProducts();
}

public class DataRepository : IDataRepository
{
    public IQueryable<Models.Product> GetProducts()
    {
        XDocument doc = XDocument.Load("Data/Product.xml");

        var products = doc.Descendants("product")
            .Select(x => new Models.Product
            {
                Sku = Guid.Parse(x.Element("sku")!.Value),
                Name = x.Element("name")!.Value,
                Price = decimal.Parse(x.Element("price")!.Value),
                Unit = x.Element("unit")!.Value,
                Image = x.Element("image")!.Value
            })
            .AsQueryable();

        return products;
    }
}