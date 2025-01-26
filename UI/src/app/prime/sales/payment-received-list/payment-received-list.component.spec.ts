import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentReceivedListComponent } from './payment-received-list.component';

describe('PaymentReceivedListComponent', () => {
  let component: PaymentReceivedListComponent;
  let fixture: ComponentFixture<PaymentReceivedListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentReceivedListComponent]
    });
    fixture = TestBed.createComponent(PaymentReceivedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
