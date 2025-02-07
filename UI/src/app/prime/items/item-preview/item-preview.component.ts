import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { forkJoin } from 'rxjs';
import { CommonService } from '../../services/common.service';


@Component({
  selector: 'app-item-preview',
  templateUrl: './item-preview.component.html',
  styleUrls: ['./item-preview.component.scss'],
    providers: [MessageService,ConfirmationService]
})
export class ItemPreviewComponent {
  loading = false;
itemsList:any;
Id:any='0'
  constructor(
    private formBuilder:FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private ls:LocalStoreService,
      private apiService:APIService,
      private commonService:CommonService,
      private service: MessageService
      ) { }
      ngOnInit() {
        if(this.route.snapshot.paramMap.get('id')){
          debugger
          this.Id= atob(this.route.snapshot.paramMap.get('id')!);
          this.itemsList=this.commonService.getItems();
         }

      }

}
