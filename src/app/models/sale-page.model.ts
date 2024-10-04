import { Sale } from "./sale.model";

export interface SalePage {
    sales: Sale[];
    totalCount: number;
    pageIndex: number;
}