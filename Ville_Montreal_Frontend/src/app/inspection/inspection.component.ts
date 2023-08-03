import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-inspection',
  templateUrl: './inspection.component.html',
  styleUrls: ['./inspection.component.css']
})
export class InspectionComponent {
  @Input() showInspectionForm: boolean = false;
  @Output() closeInspectionForm = new EventEmitter<void>();
}
