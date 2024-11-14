import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemTransferListComponent } from './item-transfer-list.component';

describe('ItemTransferListComponent', () => {
  let component: ItemTransferListComponent;
  let fixture: ComponentFixture<ItemTransferListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemTransferListComponent]
    });
    fixture = TestBed.createComponent(ItemTransferListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
