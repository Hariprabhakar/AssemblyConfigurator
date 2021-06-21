import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JunctionboxModalComponent } from './junctionbox-modal.component';

describe('JunctionboxModalComponent', () => {
  let component: JunctionboxModalComponent;
  let fixture: ComponentFixture<JunctionboxModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JunctionboxModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JunctionboxModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
