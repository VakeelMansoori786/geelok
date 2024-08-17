import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/prime/services/auth.service';
import { LocalStoreService } from 'src/app/prime/services/local-store.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
  
})
export class LoginComponent implements OnInit {
  model: any = {};
  list:any = {};
    loading = false;
    returnUrl: any;
    mainForm :any;
    constructor(
      private formBuilder:FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private ls:LocalStoreService,
        private authService: AuthService) { }

    ngOnInit() {
      this.mainForm=this.formBuilder.group({
  
        Username:['',Validators.required],
        Password:['',Validators.required],
        Company:['',Validators.required]
       
      
      });
  if(this.authService.isLoggedIn()){
    this.router.navigateByUrl("/");
    
  }

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login(model:any) {
      debugger
      if(!this.mainForm.valid)
      {
        this.mainForm.markAllAsTouched();

        //  this.toastr.warning('Please enter all the Field', 'Warning!');
     
        
      }
      else{
        this.loading = true;
        let req={
          p_username:model.Username,
          p_password:model.Password,
          p_company_id:model.Company.company_id
        }
        this.authService.login(req).subscribe((data:any) => {
          let ud=data.user[0];
          this.authService.setMenu(data.menu)
          this.authService.setUserAndToken(data["token"],ud,true);
          this.authService.makeLogin(this.returnUrl);
                
                });
              }
    }
    GetCompanyUser(userId:any){
      let req={
        p_user_id:userId

      }
      this.authService.GetCompanyUser(req).subscribe((data:any) => {
this.list=data;

      });
    }
}