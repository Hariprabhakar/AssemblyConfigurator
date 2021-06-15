import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-junctionbox-modal',
  templateUrl: './junctionbox-modal.component.html',
  styleUrls: ['./junctionbox-modal.component.scss']
})
export class JunctionboxModalComponent implements OnInit {
  public JunctionBoxFrom: FormGroup = this.formBuilder.group({
    systemName: ['', Validators.required],
    connectionFill: ['', Validators.required]
  });;
  constructor(private formBuilder: FormBuilder,) { }
  
  ngOnInit(): void {


  }

}
