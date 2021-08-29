import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss']
})
export class FilterModalComponent implements OnInit {

 public filterValue = {
	"filters": [
		{
			"name": "Select Type",
			"values": ["Type a", "Type b"]
		},
    {
			"name": "Select Size",
			"values": ["Size a", "Size b"]
		},
    {
			"name": "Select Material",
			"values": ["Material a", "Material b"]
		},
		{
			"name": "other filter",
      "values": ["value1", "value2", "value3", "value4",],
		}
	]
}
  constructor() { }

  ngOnInit(): void {
  }

}
