import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { FormsModule } from '@angular/forms';
import { MyModalComponent } from './components/my-modal/my-modal.component';
import { BaseComponent } from './common/base/base.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GeometryListModalComponent } from './components/geometry-list-modal/geometry-list-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MyModalComponent,
    GeometryListModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
  ],
  providers: [{provide:"baseUrl",useValue:"https://localhost:7053/api"},MyModalComponent,GeometryListModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }