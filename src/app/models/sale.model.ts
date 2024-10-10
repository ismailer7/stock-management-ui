import { Product } from './product.model';

export interface Sale {
    id?: number;
    description?: string;
    saleDate?: string;
    saleQuantity?: number;
    discount?: number;
    product?: Product;  // Reference to Product
}

