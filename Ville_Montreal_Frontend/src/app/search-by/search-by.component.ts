import {Component} from '@angular/core';

@Component({
  selector: 'app-search-by',
  templateUrl: './search-by.component.html',
  styleUrls: ['./search-by.component.css']
})
export class SearchByComponent {
  showQuickSearchForm = false;

  onDisplayFormButtonClick() {
    // Show the quick search form
    this.showQuickSearchForm = !this.showQuickSearchForm;
  }

  onCloseQuickSearchForm() {
    // Close the quick search form
    this.showQuickSearchForm = false;
  }
}
