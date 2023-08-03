import {Component} from '@angular/core';

@Component({
  selector: 'app-search-by',
  templateUrl: './search-by.component.html',
  styleUrls: ['./search-by.component.css']
})
export class SearchByComponent {
  showQuickSearchForm: boolean = false;
  showInspectionForm: boolean = false;

  onDisplayQuickSearchForm() {
    // If QuickSearchForm is already shown, hide it.
    if (this.showQuickSearchForm) {
      this.showQuickSearchForm = false;
    } else {
      // Else, show QuickSearchForm and hide InspectionForm.
      this.showQuickSearchForm = true;
      this.showInspectionForm = false;
    }
  }

  onDisplayInspectionForm(): void {
    // If InspectionForm is already shown, hide it.
    if (this.showInspectionForm) {
      this.showInspectionForm = false;
    } else {
      // Else, show InspectionForm and hide QuickSearchForm.
      this.showInspectionForm = true;
      this.showQuickSearchForm = false;
    }
  }

}
