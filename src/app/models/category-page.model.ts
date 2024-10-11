import { Category } from "./category.model";


export interface CategoryPage {
    categories: Category[];
    totalCount: number;
    pageIndex: number;
}