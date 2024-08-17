import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { SliderService } from '../../services/slider.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
   providers: [MessageService]
})
export class NewsDetailComponent implements OnInit {
  loading = false;
  mainForm :any;
  category_type:any[] = []
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
  
      id:['0'],
      HealthTipCategoryId:['',Validators.required],
      Topic:['',Validators.required],
      ShortDesc:['',Validators.required],
      LongDesc:['']
    
    });
this.GetHealthTipCategory();
    
    if(this.route.snapshot.paramMap.get('id')){
      let id = atob(this.route.snapshot.paramMap.get('id')!);
      setTimeout(()=>{                           // <<<---using ()=> syntax
    
this.GetHealthTipDetails(id);
    }, 500);
     }
  }

  GetHealthTipCategory() {

    this.sliderService.GetHealthTipCategory().subscribe((data:any) => {

      this.category_type=data.data
    });
  }
  GetHealthTipDetails(id:any) {
    this.loading=true;

    this.sliderService.GetHealthTipDetails().subscribe((data:any) => {
      let ab=data.data.filter((x:any)=>x.HealthTipId==id);
      if(ab.length>0){
        const formData = {
          id: ab[0].HealthTipId,
          HealthTipCategoryId:  this.category_type.find((x:any)=>x.code==ab[0].HealthTipCategoryId),
          Topic: ab[0].Topic,
          ShortDesc: ab[0].ShortDesc,
          LongDesc: ab[0].LongDesc
          };
        this.mainForm.patchValue(formData);
      }
     
    this.loading=false;


    });
  }

  onUpload(event: any) {
    debugger
    for (const file of event.files) {
        this.uploadedFiles.push(file);
    }

  }



  SaveHealthTipDetails(model:any) {
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
        Topic:model.Topic,
        ShortDesc:model.ShortDesc,
        LongDesc:model.LongDesc,
        HealthTipCategoryId:model.HealthTipCategoryId.code,
         file: this.uploadedFiles.length>0?this.uploadedFiles[0]:null
      }
      let formData = new FormData();
      formData.append('id', model.id);
      formData.append('Topic', model.Topic);
      formData.append('ShortDesc', model.ShortDesc);
      formData.append('LongDesc', model.LongDesc);
      formData.append('HealthTipCategoryId', model.HealthTipCategoryId.code);
      formData.append('files',  this.uploadedFiles.length>0?this.uploadedFiles[0]:null);
      this.sliderService.SaveHealthTipDetails(formData).subscribe((data:any) => {
        
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:"Record saved successfully..!!" });
        this.router.navigate(['/news/list']);
      });
            }
  }
  Clear(){
    this.mainForm.reset();

  }
}
