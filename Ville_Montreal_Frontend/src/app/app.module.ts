import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SearchByComponent } from './search-by/search-by.component';
import { QuickSearchComponent } from './quick-search/quick-search.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SearchByComponent,
    QuickSearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
