import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPreviewComponent } from './item-preview.component';

describe('ItemPreviewComponent', () => {
  let component: ItemPreviewComponent;
  let fixture: ComponentFixture<ItemPreviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemPreviewComponent]
    });
    fixture = TestBed.createComponent(ItemPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
