import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyZoomImageModalComponent } from './assembly-zoom-image-modal.component';

describe('AssemblyZoomImageModalComponent', () => {
  let component: AssemblyZoomImageModalComponent;
  let fixture: ComponentFixture<AssemblyZoomImageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssemblyZoomImageModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyZoomImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
