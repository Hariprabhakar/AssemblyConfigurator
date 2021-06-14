import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyIconModalComponent } from './assembly-icon-modal.component';

describe('AssemblyIconModalComponent', () => {
  let component: AssemblyIconModalComponent;
  let fixture: ComponentFixture<AssemblyIconModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssemblyIconModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssemblyIconModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
