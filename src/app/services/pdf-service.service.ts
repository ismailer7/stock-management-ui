import { style } from '@angular/animations';
import { Injectable } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfServiceService {

  constructor() { }

  generateInvoice() {
    const document = {
      content: [
        { text: 'Invoice', style: 'header'},
        'StockManagement Invoice',
        {
          table: {
            body: [
              ['Item', 'Description', 'Price'],
              ['Item 1', 'Description 1', '150'],
              ['Item 2', 'Description 2', '133'],
              ['Item 3', 'Description 3', '122'],
              ['Item 4', 'Description 4', '556'],
              ['Item 5', 'Description 5', '1120'],
            ]
          }
        }

      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        }
      }
    }
  
    pdfMake.createPdf(document).download('stock-invoice.pdf');
  }

}
