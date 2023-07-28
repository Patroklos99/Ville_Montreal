import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchByComponent } from './search-by.component';

describe('SearchByComponent', () => {
  let component: SearchByComponent;
  let fixture: ComponentFixture<SearchByComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchByComponent]
    });
    fixture = TestBed.createComponent(SearchByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
