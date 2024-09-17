import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class ItemDetailComponent implements OnInit {
  loading = false;
  mainForm :any;
  itemTypeList: any[] = [
    
    { name: 'Goods', key: 'Goods' },
    { name: 'Service', key: 'Service' }
];
uploadedFiles: any[] = [];
brandList: any;
unitList: any;
countryList: any;
itemGroupList: any;
taxList: any;
files = [];

totalSize : number = 0;

totalSizePercent : number = 0;

  constructor(
    private formBuilder:FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private ls:LocalStoreService,
      private apiService:APIService,
      private service: MessageService
      ) { }
  ngOnInit() {
    this.mainForm=this.formBuilder.group({
  
      p_item_id:['0'],
      p_item_group_id:[''],
      p_brand_id:['',Validators.required],
      p_unit_id:['',Validators.required],
      p_country_id:['',Validators.required],
      p_item_type:[this.itemTypeList[0],Validators.required],
      p_name:['',Validators.required],
      p_image:[''],
      p_model_no:[''],
      p_hs_code:[''],
      p_cost_price:[''],
      p_dimensions:[''],
      p_weight:[''],
      p_is_taxable:['']
    
    });
  
    if(this.route.snapshot.paramMap.get('id')){
      let id = atob(this.route.snapshot.paramMap.get('id')!);
//this.GetCarousel(id);
     }
     else{
      this.GetBrand();
this.GetUnit();
this.GetCountry();
this.GetItemGroup();  
     }
  }
 

  onUpload(event: any) {
    debugger
    for (const file of event.files) {
        this.uploadedFiles.push(file);
    }

  }

GetBrand(){
  this.apiService.GetBrand().subscribe((data:any) => {
    debugger
this.brandList=data;
  })
}

GetUnit(){
  this.apiService.GetUnit().subscribe((data:any) => {
    
this.unitList=data;
  })
}
GetCountry(){
  this.apiService.GetCountry().subscribe((data:any) => {
    
this.countryList=data;
  })
}
GetItemGroup(){
  this.apiService.GetItemGroup().subscribe((data:any) => {
    
this.itemGroupList=data;
  })
}
  SaveItem(model:any) {
    debugger
    if(!this.mainForm.valid)
    {
      this.mainForm.markAllAsTouched();

      //  this.toastr.warning('Please enter all the Field', 'Warning!');
   
      
    }
    else{
      this.loading = true;
      let req={
        p_item_id:model.p_item_id,
        p_item_group_id:model.p_item_group_id,
        p_brand_id:model.p_brand_id,
        p_unit_id:model.p_unit_id,
        p_country_id:model.p_country_id,
        p_item_type:model.p_item_type,
        p_name:model.p_name,
        p_model_no:model.p_model_no,
        p_hs_code:model.p_hs_code,
        p_cost_price:model.p_cost_price,
        p_dimensions:model.p_dimensions,
        p_weight:model.p_weight,
        p_is_taxable:model.p_is_taxable,
         file: this.uploadedFiles.length>0?this.uploadedFiles[0]:null
      }
      let formData = new FormData();
      formData.append('p_item_id', model.p_item_id);
      formData.append('p_item_group_id', model.p_item_group_id);
      formData.append('p_brand_id', model.p_brand_id);
      formData.append('p_unit_id', model.p_unit_id);
      formData.append('p_country_id', model.p_country_id);
      formData.append('p_item_type', model.p_item_type);
      formData.append('p_name', model.p_name);
      formData.append('p_model_no', model.p_model_no);
      formData.append('p_hs_code', model.p_hs_code);
      formData.append('p_cost_price', model.p_cost_price);
      formData.append('p_dimensions', model.p_dimensions);
      formData.append('p_weight', model.p_weight);
      formData.append('p_is_taxable', model.p_is_taxable);
      formData.append('p_image',  this.uploadedFiles.length>0?this.uploadedFiles[0]:null);
      this.apiService.SaveItem(formData).subscribe((data:any) => {
        
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data['carousel'][0].Msg });
        this.router.navigate(['/slider/list']);
      });
            }
  }
  Clear(){
    this.mainForm.reset();

  }

  choose(event, callback) {
    callback();
}

onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
}

onClearTemplatingUpload(clear) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
}

onTemplatedUpload() {
    this.service.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
}

onSelectedFiles(event) {
    this.files = event.currentFiles;
    this.files.forEach((file) => {
        this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
}

uploadEvent(callback) {
    callback();
}

formatSize(bytes) {
    const k = 1024;
    const dm = 3;
    const sizes = 20000;
    if (bytes === 0) {
        return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
}
}

