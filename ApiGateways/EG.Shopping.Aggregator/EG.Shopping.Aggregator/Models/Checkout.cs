namespace EG.Shopping.Aggregator.Models;

public class Checkout
{
    public Address Address { get; set; }
    public Cart Cart { get; set; }
    public string Payment { get; set; }
}

public class Address
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullAddress { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public string Postcode { get; set; }
    public string Mobile { get; set; }
    public string Email { get; set; }
    public string OrderNotes { get; set; }
}

public class Cart
{
    public Guid CartId { get; set; }
    public List<Item> Items { get; set; }
    public int Discount { get; set; }
    public string DiscountCoupon { get; set; }
}

public class Item
{
    public Guid Sku { get; set; }
    public int Quantity { get; set; }
    public int Price { get; set; }
    public string Name { get; set; }
    public string Unit { get; set; }
    public string DisplayPrice { get; set; }
    public string Image { get; set; }
}