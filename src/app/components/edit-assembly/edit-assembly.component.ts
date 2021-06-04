import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-edit-assembly',
  templateUrl: './edit-assembly.component.html',
  styleUrls: ['./edit-assembly.component.scss']
})
export class EditAssemblyComponent implements OnInit {

  @Input() public families: any;
  @Output() assemblyDataAdded = new EventEmitter();

  public createAssemblyFrom: FormGroup;
  public submitted = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createAssemblyFrom = this.formBuilder.group({
      familyId: ['', Validators.required],
      assemblyName: ['', Validators.required],
      abbrevation: ['', Validators.required],
    });
  }

  public onSubmit(): void {
    if (this.createAssemblyFrom.invalid) {
      return;
    }
    this.submitted = true;
    this.assemblyDataAdded.emit();
  }

  public enableForm() {
    this.submitted = false;
    this.assemblyDataAdded.emit();
  }


}
