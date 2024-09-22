import { Category } from './category.model';

export interface Product {
    id?: number;
    productName?: string;
    productCode?: string;
    description?: string;
    quantity?: number;
    unitBuyPrice?: number;
    unitSellPrice?: number;
    buyDate?: string;
    category?: Category;
}
