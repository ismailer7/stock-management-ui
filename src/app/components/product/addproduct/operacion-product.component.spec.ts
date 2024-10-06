import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperacionProductComponent } from './operacion-product.component';

describe('AddproductComponent', () => {
  let component: OperacionProductComponent;
  let fixture: ComponentFixture<OperacionProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperacionProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperacionProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
