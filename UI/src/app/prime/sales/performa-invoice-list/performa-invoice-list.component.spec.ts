import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformaInvoiceListComponent } from './performa-invoice-list.component';

describe('PerformaInvoiceListComponent', () => {
  let component: PerformaInvoiceListComponent;
  let fixture: ComponentFixture<PerformaInvoiceListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerformaInvoiceListComponent]
    });
    fixture = TestBed.createComponent(PerformaInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
