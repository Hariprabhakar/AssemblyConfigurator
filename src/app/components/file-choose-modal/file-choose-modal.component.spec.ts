import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileChooseModalComponent } from './file-choose-modal.component';

describe('FileChooseModalComponent', () => {
  let component: FileChooseModalComponent;
  let fixture: ComponentFixture<FileChooseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileChooseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileChooseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
