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

@Component({
  selector: 'app-preview-invoice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-invoice.component.html',
  styleUrls: ['./preview-invoice.component.scss'],
  encapsulation: ViewEncapsulation.None
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
      private commonService:CommonService,
                  private itemService:ItemService
   
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
}
