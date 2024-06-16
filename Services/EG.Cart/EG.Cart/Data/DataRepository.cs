using System.Xml.Linq;

namespace EG.Cart.Data;

public interface IDataRepository
{
    bool SaveCart(Models.Cart cart);
}

public class DataRepository : IDataRepository
{
    public bool SaveCart(Models.Cart cart)
    {
        DeleteCartFromXml(cart.Id);
        SaveCartToXml(cart);
        return true;
    }

    private void SaveCartToXml(Models.Cart cart)
    {
        XDocument doc = XDocument.Load("Data/Cart.xml");

        XElement newCart = new XElement("cart",
            new XElement("id", cart.Id.ToString())
            // Add other cart properties here...
        );

        doc.Root.Add(newCart);
        doc.Save("Data/Cart.xml");
    }

    private void DeleteCartFromXml(Guid cartId)
    {
        XDocument doc = XDocument.Load("Data/Cart.xml");

        var cartToDelete = doc.Descendants("cart")
            .FirstOrDefault(x => Guid.Parse(x.Element("id")?.Value) == cartId);

        if (cartToDelete != null)
        {
            cartToDelete.Remove();
            doc.Save("Data/Cart.xml");
        }
    }
}