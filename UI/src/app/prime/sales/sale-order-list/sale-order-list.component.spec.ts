import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOrderListComponent } from './sale-order-list.component';

describe('SaleOrderListComponent', () => {
  let component: SaleOrderListComponent;
  let fixture: ComponentFixture<SaleOrderListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleOrderListComponent]
    });
    fixture = TestBed.createComponent(SaleOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
