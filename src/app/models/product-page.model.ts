import {Product} from "./product.model";

export interface Page {
    products: Product[];
    totalCount: number;
    pageIndex: number;
}