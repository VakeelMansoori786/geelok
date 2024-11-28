import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayableListComponent } from './payable-list.component';

describe('PayableListComponent', () => {
  let component: PayableListComponent;
  let fixture: ComponentFixture<PayableListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayableListComponent]
    });
    fixture = TestBed.createComponent(PayableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
