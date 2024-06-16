export interface CouponCode {
    id: string;
    isValid: boolean;
    code: string;
    percentage: number;
    maxValue: number;
}