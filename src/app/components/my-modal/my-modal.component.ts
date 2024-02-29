import { Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/common/base/base.component';
import { GeoLoc } from 'src/app/interfaces/geoloc';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { LocDataService } from 'src/app/services/loc-data.service';

// declare var $:any;
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-my-modal',
  templateUrl: './my-modal.component.html',
  styleUrls: ['./my-modal.component.css']
})

export class MyModalComponent extends BaseComponent implements OnInit {
  @ViewChild('myModal') myModal: ElementRef;

  data:GeoLoc
  constructor(private locDataService:LocDataService,private httpClient:CustomHttpClient,spinner:NgxSpinnerService) {
    super(spinner)
   }
  ngOnInit(): void {
    this.data=this.locDataService.data
    if(this.data!=null)
      this.openModal();
  }
  openModal() {
    // this.myModal.nativeElement.style.display = 'block';
    
    const modelDiv=document.getElementById("myModal")
    if(modelDiv!=null)
    console.log("---");
      modelDiv.style.display="block"
  }

  closeModal() {
    const modelDiv=document.getElementById("myModal")
    if(modelDiv!=null)
      modelDiv.style.display="none"
      this.locDataService.data=null;
    }

    save(){
      this.showSpinner();
      this.httpClient.post<GeoLoc>({controller:"maps"},this.data).subscribe({
      next:(data)=>{
        this.hideSpinner()
        alert("Veri Kaydedilmiştir.");
      },
      error:(err)=>{
        this.hideSpinner();
        alert("Veri Eklenirken bir hata oluştu");
      }
    })
    }
}
