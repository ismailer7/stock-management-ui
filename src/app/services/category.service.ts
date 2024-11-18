import {inject, Injectable} from '@angular/core';
import {Category} from '../models/category.model';
import {Subject} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {SortDirection} from '@angular/material/sort';
import {CategoryPage} from '../models/category-page.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    $triggerLoading = new Subject();
    http = inject(HttpClient);

    getAllCategories() {
        return this.http.get<Category[]>(`${environment.rooturl}/category/all`, {
            observe: 'response',
            withCredentials: true
        });
    }

    getCategoriesFiltered(
        search_filter: string = '',
        sort_field: string = '',
        sort_order: SortDirection,
        page: number = 1,
        limit_per_page: number = 5
    ) {
        const params = new HttpParams()
            .set('input', search_filter)
            .set("sort", sort_field)
            .set("order", sort_order)
            .set("page", page)
            .set("per_page", limit_per_page);
        return this.http.get<CategoryPage>(`${environment.rooturl}/category/filtred`, {
            params: params,
            observe: 'response',
            withCredentials: true
        });
    }

    addCategory(category: Category) {
        return this.http.post<Category>(`${environment.rooturl}/category/add`, category, {
            observe: 'response',
            withCredentials: true
        })
    }

    editCategory(id: Number, category: Category) {
        return this.http.put<Category>(`${environment.rooturl}/category/edit/${id}`, category, {
            observe: 'response',
            withCredentials: true
        })
    }

    deleteCategory(id: Number) {
        return this.http.delete(`${environment.rooturl}/category/delete/${id}`, {
            responseType: "text",
            withCredentials: true
        })
    }

    deleteCategoriesById(idList: number[]) {
        return this.http.delete(`${environment.rooturl}/category/deletebyids`, {
                body: idList,
                responseType: 'text',
                withCredentials: true
            }
        )
    }

    export(
        search_filter: string = '',
        sort_field: string = '',
        sort_order: SortDirection,
        page: number = 1,
        limit_per_page: number = 5
    ) {
            const params = new HttpParams()
                .set('input', search_filter)
                .set("sort", sort_field)
                .set("order", sort_order)
                .set("page", page)
                .set("per_page", limit_per_page);

            const headers = new HttpHeaders({
                Accept: 'text/csv'
            });
            return this.http.get(`${environment.rooturl}/category/export-csv-file`, {
                    headers: headers,
                    params: params,
                    responseType: 'blob',
                    observe: 'response',
                    withCredentials: true
                }
            )
        }
    }
