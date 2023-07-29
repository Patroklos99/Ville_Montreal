import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.css']
})
export class QuickSearchComponent {
  @Input() showQuickSearchForm: boolean = false;
  @Output() closeQuickSearchForm = new EventEmitter<void>();
}
