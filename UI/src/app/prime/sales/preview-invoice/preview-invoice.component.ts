import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';
import { forkJoin } from 'rxjs';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ItemService } from '../../services/item.service';
import { CommonService } from '../../services/common.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-preview-invoice',
  templateUrl: './preview-invoice.component.html',
  styleUrls: ['./preview-invoice.component.scss']
})
export class PreviewInvoiceComponent {
    loading = false;
id:any='0'
type='invoice'
mainList:any={};
constructor(
    private formBuilder:FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private ls:LocalStoreService,
      private apiService:APIService,
      private commonService:CommonService
   
      ) { }
 ngOnInit() {

   if (this.route.snapshot.paramMap.get('id')) {
      this.id= atob(this.route.snapshot.paramMap.get('id')!);
      this.type= atob(this.route.snapshot.paramMap.get('type')!);
      this.fetchData(this.id);
     }
 }
    fetchData(id: string) {
    let req={

      p_id:id,
      p_type:this.type
    }
    this.loading=true;

    this.apiService.GetPreview(req).subscribe((data:any) => {
      
     
    if(data.length>0){
      debugger
 this.mainList.main=data[0][0];
 this.mainList.detail=data[1];
    }
    });
  }
  numberToWordsCurrency(num:any,currency:any){
    return this.commonService.numberToWordsCurrency(num,currency);
  }

printInvoice() {
    window.print();
  }

  downloadPDF() {
    const DATA: any = document.querySelector('.print-area');
    if (!DATA) return;

    html2canvas(DATA).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = (pdf as any).getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${this.mainList?.main?.ref_no || 'preview'}.pdf`);
    });
  }
}