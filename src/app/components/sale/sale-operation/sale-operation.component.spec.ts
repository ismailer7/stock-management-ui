import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleOperationComponent } from './sale-operation.component';

describe('SaleOperationComponent', () => {
  let component: SaleOperationComponent;
  let fixture: ComponentFixture<SaleOperationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaleOperationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
