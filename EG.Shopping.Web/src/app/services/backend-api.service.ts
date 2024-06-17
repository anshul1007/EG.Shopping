import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, take } from 'rxjs';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { CouponCode } from '../models/discount';


@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  
  baseUrl = 'https://localhost:4200/api';
  baseUrl2 = 'https://localhost:7132/api';
  constructor(private httpClient: HttpClient) { }

  // add a method to get the data from the backend
  getCategories() {
    // use the http client to get the data from the backend
    const apiurl = `${this.baseUrl}/product/categories.json`;
    return this.httpClient.get<Array<Category>>(apiurl, { withCredentials: true })
      .pipe(take(1),
        map((response) => response),
        catchError((err) => {
          return of(err)
        }));
  }

  getBestseller(): Observable<Product[]> {
    // use the http client to get the data from the backend
    const apiurl = `${this.baseUrl2}/v1/product/bestseller?PageNumber=1&PageSize=9`;
    // const apiurl =  `${this.baseUrl}/product/bestseller.json`;
    return this.httpClient.get<any>(apiurl, { withCredentials: true })
      .pipe(take(1),
        map((response) => {
          return response.products as Product[];
        }),
        catchError((err) => {
          return of(err)
        }));
  }

  verifyCoupon(coupon: string): Observable<CouponCode> {
    // use the http client to get the data from the backend
    // const apiurl = `${this.baseUrl}/couponcode/verify.json`;
    const apiurl = `${this.baseUrl2}/v1/discount/verify?DiscountCode=${coupon}`;
    return this.httpClient.get<any>(apiurl, { withCredentials: true })
      .pipe(take(1),
        map((response) => response.discount as CouponCode),
        catchError((err) => {
          return of(err)
        }));
  }

  placeOrder(checkout: any) {
    const apiurl = `${this.baseUrl2}/v1/aggregator/checkout`;
    return this.httpClient.post<any>(apiurl, checkout, { withCredentials: true })
      .pipe(take(1),
        map((response) => response),
        catchError((err) => {
          return of(err)
        }));
  }
}
