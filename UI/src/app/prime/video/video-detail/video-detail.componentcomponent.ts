import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { SliderService } from '../../services/slider.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.component.html',
  styleUrls: ['./video-detail.component.scss'],
   providers: [MessageService]
})
export class VideoDetailComponent implements OnInit {
  loading = false;
  mainForm :any;
  slider_type = [
    { name: 'Doctor App', code: 'D' },
    { name: 'Patient App', code: 'P' }
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
  
      id:['0'],
      image_url:[''],
      redirect_url:[''],
    
    
    });

    
    if(this.route.snapshot.paramMap.get('id')){
      let id = atob(this.route.snapshot.paramMap.get('id')!);
this.GetVideo(id);
     }
  }
  GetVideo(id:any) {
    this.loading=true;

    this.sliderService.GetVideo().subscribe((data:any) => {
      let ab=data.carousel.filter((x:any)=>x.id==id);
      if(ab.length>0){
        const formData = {
          id: ab[0].id,
          image_url: ab[0].image_url,
          redirect_url: ab[0].video_url
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



  SaveVideo(model:any) {
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
         file: this.uploadedFiles.length>0?this.uploadedFiles[0]:null
      }
      let formData = new FormData();
      formData.append('id', model.id);
      formData.append('image_url', model.image_url);
      formData.append('redirect_url', model.redirect_url);
      formData.append('files',  this.uploadedFiles.length>0?this.uploadedFiles[0]:null);
      this.sliderService.SaveVideo(formData).subscribe((data:any) => {
        
        this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data['carousel'][0].Msg });
        this.router.navigate(['/video/list']);
      });
            }
  }
  Clear(){
    this.mainForm.reset();

  }
}
