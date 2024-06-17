import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BackendApiService } from './backend-api.service';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { CouponCode } from '../models/discount';

describe('BackendApiService', () => {
  let service: BackendApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BackendApiService]
    });
    service = TestBed.inject(BackendApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get categories from the backend', () => {
    const mockCategories: Category[] = [
      {
        id: 1, name: 'Category 1',
        image: ''
      },
      {
        id: 2, name: 'Category 2',
        image: ''
      }
    ];

    service.getCategories().subscribe((categories: Category[]) => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${service.baseUrl}/product/categories.json`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should get bestseller products from the backend', () => {
    const mockProducts: Product[] = [
      {
        name: 'Product 1',
        tax: 0,
        discount: 0,
        sku: '',
        price: 0,
        unit: '',
        displayPrice: '',
        image: ''
      },
      {
        name: 'Product 2',
        tax: 0,
        discount: 0,
        sku: '',
        price: 0,
        unit: '',
        displayPrice: '',
        image: ''
      }
    ];

    service.getBestseller().subscribe((products: Product[]) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${service.baseUrl2}/v1/product/bestseller?PageNumber=1&PageSize=9`);
    expect(req.request.method).toBe('GET');
    req.flush({ products: mockProducts });
  });

  it('should verify a coupon code with the backend', () => {
    const mockCoupon: CouponCode = {
      code: 'ABC123',
      id: '',
      isValid: false,
      percentage: 0,
      maxValue: 0
    };
  
    service.verifyCoupon('ABC123').subscribe((coupon: CouponCode) => {
      expect(coupon).toEqual(mockCoupon);
    });
  
    const req = httpMock.expectOne(`${service.baseUrl2}/v1/discount/verify?DiscountCode=ABC123`);
    expect(req.request.method).toBe('GET');
    req.flush({ discount: mockCoupon });
  });

  it('should place an order with the backend', () => {
    const mockCheckout = { /* mock checkout data */ };

    service.placeOrder(mockCheckout).subscribe((response: any) => {
      expect(response).toBeDefined();
      // Add additional assertions if needed
    });

    const req = httpMock.expectOne(`${service.baseUrl2}/v1/aggregator/checkout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCheckout);
    req.flush({ /* mock response data */ });
  });
});