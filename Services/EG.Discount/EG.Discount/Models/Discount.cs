namespace EG.Discount.Models;

public class Discount
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public decimal Percentage { get; set; }
    public decimal MaxValue { get; set; }
    public bool IsValid { get; set; }

}