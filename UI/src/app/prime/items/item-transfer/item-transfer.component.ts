import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStoreService } from '../../services/local-store.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { APIService } from '../../services/api.service';

@Component({
  selector: 'app-item-transfer',
  templateUrl: './item-transfer.component.html',
  styleUrls: ['./item-transfer.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class ItemTransferComponent implements OnInit {
  loading = false;
  mainForm :any;
  
companyList: any;
itemTypeList: any;


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
    this.mainForm = this.formBuilder.group({
      p_transfer_order_id: ['0'], // Assuming similar structure as item
      p_ref_no: ['', Validators.required],
      p_reason: ['', Validators.required],
      p_from_company_id: ['', Validators.required],
      p_to_company_id: ['', Validators.required],
      p_is_active: [1], // Default active
      p_create_by: [1], // Assuming a default user ID
      p_order_details: [[], Validators.required], // Expecting an array for order details
    });
  
    if(this.route.snapshot.paramMap.get('id')){
      let id = atob(this.route.snapshot.paramMap.get('id')!);
//this.GetCarousel(id);
     }
     else{
      
     }
  }
  SaveTransferOrder() {
    if (!this.mainForm.valid) {
      this.mainForm.markAllAsTouched();
      // Optionally show a warning message
      return;
    } else {
      this.loading = true;

      let model = this.mainForm.value; // Get form values

      // Construct the request object
      let req = {
        p_transfer_order_id: model.p_transfer_order_id,
        p_ref_no: model.p_ref_no,
        p_reason: model.p_reason,
        p_from_company_id: model.p_from_company_id,
        p_to_company_id: model.p_to_company_id,
        p_is_active: model.p_is_active,
        p_create_by: model.p_create_by,
        p_order_details: model.p_order_details, // Assuming this is already structured
      };

      // Prepare form data if needed for file uploads (if applicable)
      let formData = new FormData();
      formData.append('p_transfer_order_id', model.p_transfer_order_id);
      formData.append('p_ref_no', model.p_ref_no);
      formData.append('p_reason', model.p_reason);
      formData.append('p_from_company_id', model.p_from_company_id);
      formData.append('p_to_company_id', model.p_to_company_id);
      formData.append('p_is_active', model.p_is_active);
      formData.append('p_create_by', model.p_create_by);
      formData.append('p_order_details', JSON.stringify(model.p_order_details)); // JSON string if needed

      
      // Make the API call
      this.apiService.SaveTransferOrder(formData).subscribe(
        (data: any) => {
          this.service.add({
            key: 'tst',
            severity: 'success',
            summary: 'Success Message',
            detail: data['msg'], // Adjust based on the API response structure
          });
          this.router.navigate(['/transfer-order/list']); // Adjust route as needed
          this.loading = false; // Reset loading state
        },
        (error) => {
          console.error('Error saving transfer order:', error);
          this.service.add({
            key: 'tst',
            severity: 'error',
            summary: 'Error Message',
            detail: 'Failed to save transfer order.',
          });
          this.loading = false; // Reset loading state
        }
      );
    }
  }
  Clear(){
    this.mainForm.reset();

  }
}

