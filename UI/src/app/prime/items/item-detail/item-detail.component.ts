import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';
import { forkJoin } from 'rxjs';

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
companyList:any;
unitList: any;
countryList: any;
itemGroupList: any;
taxList: any;
files = [];
Id:any='0'
totalSize : number = 0;

totalSizePercent : number = 0;
rows = [
  {id:0, branch_id: '',stock: '', stock_value: '' }
];
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
      p_description:[''  ],
      p_image:[''],
      p_model_no:[''],
      p_hs_code:[''],
      p_cost_price:[''],
      p_dimensions:[''],
      p_weight:[''],
      p_is_taxable:['']
    
    });
  
    if (this.route.snapshot.paramMap.get('id')) {
     this.Id= atob(this.route.snapshot.paramMap.get('id')!);
  
    }
  this.loadDropdowns();
  }
  fetchItemDetails(id: string) {
    let req={

      p_item_id:id
    }
    this.loading=true;

    this.apiService.GetItem(req).subscribe((data:any) => {
      const item = data[0];  // Assuming the response structure is correct
      debugger
      // Populate the form with the fetched data
      this.mainForm.patchValue({
        p_item_id: item.item_id,
        p_item_group_id: this.itemGroupList.find(x=>x.item_group_id==item.item_group_id),
        p_brand_id:this.brandList.find(x=>x.brand_id==item.brand_id) ,
        p_unit_id: this.unitList.find(x=>x.unit_id==item.unit_id) ,
        p_country_id:this.countryList.find(x=>x.country_id==item.country_id) ,
        p_item_type: this.itemTypeList.find(x=>x.key==item.item_type) ,
        p_name: item.name,
        p_description: item.description,
        p_model_no: item.model_no,
        p_hs_code: item.hs_code,
        p_cost_price: item.cost_price,
        p_dimensions: item.dimensions,
        p_weight: item.weight,
        p_is_taxable:  this.taxList.find(x=>x.tax_treatment_id==item.is_taxable) ,
      });

      // If there is an image, set it (optional)
      if (item.p_image) {
        this.uploadedFiles.push(item.p_image);
      }

      // If the item has stock rows, populate the rows array
      if (item.p_item_stock) {
        this.rows = item.p_item_stock;  // Assuming p_item_stock is an array of rows
      }
    });
  }

  onUpload(event: any) {
    
    for (const file of event.files) {
        this.uploadedFiles.push(file);
    }

  }

// GetBrand(){
//   this.apiService.GetBrand().subscribe((data:any) => {
    
// this.brandList=data;
//   })
// }

// GetCompany(){
//   this.apiService.GetCompany().subscribe((data:any) => {
    
// this.companyList=data;
//   })
// }

// GetTax(){
//   this.apiService.GetTax().subscribe((data:any) => {
    
// this.taxList=data;
//   })
// }
// GetUnit(){
//   this.apiService.GetUnit().subscribe((data:any) => {
    
// this.unitList=data;
//   })
// }
// GetCountry(){
//   this.apiService.GetCountry().subscribe((data:any) => {
    
// this.countryList=data;
//   })
// }
// GetItemGroup(){
//   this.apiService.GetItemGroup().subscribe((data:any) => {
    
// this.itemGroupList=data;
//   })
// }
loadDropdowns() {
  forkJoin({
    brands: this.apiService.GetBrand(),
    units: this.apiService.GetUnit(),
    countries: this.apiService.GetCountry(),
    itemGroups: this.apiService.GetItemGroup(),
    taxes: this.apiService.GetTax(),
    companies: this.apiService.GetCompany()
  }).subscribe(({ brands, units, countries, itemGroups, taxes, companies }) => {
    this.brandList = brands;
    this.unitList = units;
    this.countryList = countries;
    this.itemGroupList = itemGroups;
    this.taxList = taxes;
    this.companyList = companies;

    // If editing, update the form after loading data
    if (this.Id!=0) {
      this.fetchItemDetails(this.Id);
    }
  });
}



  SaveItem(model:any) {
    
    if(!this.mainForm.valid)
    {
      this.mainForm.markAllAsTouched();

      //  this.toastr.warning('Please enter all the Field', 'Warning!');
   
      
    }
    else{
      this.loading = true;
      let req={
        p_item_id:model.p_item_id,
        p_item_group_id:model.p_item_group_id.item_group_id,
        p_brand_id:model.p_brand_id.brand_id,
        p_unit_id:model.p_unit_id.unit_id,
        p_country_id:model.p_country_id.country_id,
        p_item_type:model.p_item_type.key,
        p_name:model.p_name,
        p_model_no:model.p_model_no,
        p_hs_code:model.p_hs_code,
        p_cost_price:model.p_cost_price,
        p_dimensions:model.p_dimensions,
        p_weight:model.p_weight,
        p_is_taxable:model.p_is_taxable.tax_treatment_id,
        p_description:model.p_description,
         file: this.uploadedFiles.length>0?this.uploadedFiles[0]:null
      }
      let formData = new FormData();
      formData.append('p_item_id', req.p_item_id);
      formData.append('p_item_group_id', req.p_item_group_id);
      formData.append('p_brand_id', req.p_brand_id);
      formData.append('p_unit_id', req.p_unit_id);
      formData.append('p_country_id', req.p_country_id);
      formData.append('p_item_type', req.p_item_type);
      formData.append('p_name', req.p_name);
      formData.append('p_image',  '');
      formData.append('p_model_no', req.p_model_no);
      formData.append('p_hs_code', req.p_hs_code);
      formData.append('p_cost_price', req.p_cost_price);
      formData.append('p_dimensions', req.p_dimensions);
      formData.append('p_weight', req.p_weight);
      formData.append('p_is_taxable', req.p_is_taxable);
      formData.append('p_description', req.p_description);
      formData.append('p_item_stock',JSON.stringify(this.rows));
      this.apiService.SaveItem(formData).subscribe((data:any) => {
        
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data[0].msg });
        this.router.navigate(['/items/list']);
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

addRow() {
  debugger
  const newId = this.rows.length ? this.rows[this.rows.length - 1].id + 1 : 1;
  this.rows.push({ id: newId,branch_id:'' ,stock:'',stock_value:'' });
 
}

removeRow(id: any) {
  
  this.rows = this.rows.filter(row => row.id !== id);
}

}

