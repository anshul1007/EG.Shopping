using System.Xml.Linq;

namespace EG.Discount.Data;

public interface IDataRepository
{
    IQueryable<Models.Discount> VerifyDiscount();
}

public class DataRepository : IDataRepository
{
    public IQueryable<Models.Discount> VerifyDiscount()
    {
        XDocument doc = XDocument.Load("Data/Discount.xml");

        var discounts = doc.Descendants("discount")
            .Select(x => new Models.Discount
            {
                Id = Guid.Parse(x.Element("id")?.Value),
                Code = x.Element("code")?.Value,
                Percentage = int.Parse(x.Element("percentage")?.Value),
                MaxValue = int.Parse(x.Element("maxValue")?.Value),
                IsValid = bool.Parse(x.Element("isValid")?.Value)
            })
            .AsQueryable();

        return discounts;
    }
}