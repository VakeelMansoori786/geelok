import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { SliderService } from '../../services/slider.service';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  providers: [MessageService]
})
export class UserDetailComponent implements OnInit {
  loading = false;
  mainForm :any;
  username='';
  mainList:any;
  userList:any;
  constructor(
    private formBuilder:FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private ls:LocalStoreService,
      private sliderService:SliderService,
      private service: MessageService,
      private userService: UserService,
      ) { }
  ngOnInit() {
   this.GetUserList();
  }
  GetLdapUser(search:any) {
    
    this.loading=true;
let model={
  name:search.query
}
    this.userService.GetLdapUser(model).subscribe((data:any) => {
      
     this.userList=data.userList;
    this.loading=false;


    });
  }
  Save(){
    let model={
      name:this.username
    }
    this.userService.AddSliderUser(model).subscribe((data:any) => {
      this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail:data['carousel'][0].Msg });
      this.GetUserList();
    });
  }

  Clear(){
    this.username='';
  }
  GetUserList() {
    
    this.loading=true;

    this.userService.GetSliderUser().subscribe((data:any) => {
      
     this.mainList=data.userList;
    this.loading=false;


    });
  }
}
