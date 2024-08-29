import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { SliderService } from '../../services/slider.service';
import { ConfirmationService, MessageService } from 'primeng/api';

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
    { name: 'Service', key: 'Service' },
    { name: 'Goods', key: 'Goods' }
];
uploadedFiles: any[] = [];
  constructor(
    private formBuilder:FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private ls:LocalStoreService,
      private sliderService:SliderService,
      private service: MessageService
      ) { }
  ngOnInit() {
    this.mainForm=this.formBuilder.group({
  
      p_item_id:['0'],
      p_item_group_id:[''],
      p_brand_id:['',Validators.required],
      p_unit_id:['',Validators.required],
      p_country_id:['',Validators.required],
      p_item_type:['',Validators.required],
      p_name:['',Validators.required],
      p_image:[''],
      p_model_no:[''],
      p_hs_code:['']
    
    });

    
    if(this.route.snapshot.paramMap.get('id')){
      let id = atob(this.route.snapshot.paramMap.get('id')!);
//this.GetCarousel(id);
     }
  }
 

  onUpload(event: any) {
    debugger
    for (const file of event.files) {
        this.uploadedFiles.push(file);
    }

  }



  SaveCarousel(model:any) {
    debugger
    if(!this.mainForm.valid)
    {
      this.mainForm.markAllAsTouched();

      //  this.toastr.warning('Please enter all the Field', 'Warning!');
   
      
    }
    else{
      this.loading = true;
      let req={
        id:model.id,
        image_url:model.image_url,
        redirect_url:model.redirect_url,
        flg_click:model.flg_click,
        flg_type:model.flg_type.code,
         file: this.uploadedFiles.length>0?this.uploadedFiles[0]:null
      }
      let formData = new FormData();
      formData.append('id', model.id);
      formData.append('image_url', model.image_url);
      formData.append('redirect_url', model.redirect_url);
      formData.append('flg_click', model.flg_click);
      formData.append('flg_type', model.flg_type.code);
      formData.append('files',  this.uploadedFiles.length>0?this.uploadedFiles[0]:null);
      this.sliderService.SaveCarousel(formData).subscribe((data:any) => {
        
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data['carousel'][0].Msg });
        this.router.navigate(['/slider/list']);
      });
            }
  }
  Clear(){
    this.mainForm.reset();

  }
}

