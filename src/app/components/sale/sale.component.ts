import { Component, inject, OnInit } from '@angular/core';
import { Sale } from '../../models/sale.model';
import { SalesService } from '../../services/sales.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent implements OnInit {

  sales:Sale [] = [];
  salesService = inject(SalesService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
      this.salesService.getAllSales().subscribe({
        next: (resp) => { this.sales = [...resp] }
      })
  }


  totalPrice(price:number | undefined,quantity:number | undefined,discount:number | undefined):any{
      return ( price ?? 0) * (quantity ?? 0) - (discount ?? 0)
  }

}
