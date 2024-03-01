import { Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/common/base/base.component';
import { GeoLocation } from 'src/app/models/geo-location';
import { LocationAndUsers } from 'src/app/models/location-and-users';
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

  data:GeoLocation
  locationAndUser:LocationAndUsers=new LocationAndUsers();

  constructor(private locDataService:LocDataService,private httpClient:CustomHttpClient,spinner:NgxSpinnerService) {
    super(spinner)
   }
  ngOnInit(): void {
    this.data=this.locDataService.data;
    if(this.data!=null)
      this.openModal();
  }
  openModal() {
    // this.myModal.nativeElement.style.display = 'block';
    
    const modelDiv=document.getElementById("myModal")
    if(modelDiv!=null){
      modelDiv.style.display="block"
    }
  }
  closeModal() {
    const modelDiv=document.getElementById("myModal")
    if(modelDiv!=null)
      modelDiv.style.display="none"
      this.locDataService.data=null;
    }

    save(name:string){
      this.showSpinner();
      this.locationAndUser.coordinates=this.data.coordinates
      // console.log(this.data.coordinates);
      this.locationAndUser.type=this.data.type
      this.locationAndUser.name=name
      // console.log({name:this.locAndUser.name,coordinates:this.locAndUser.coordinates,type:this.locAndUser.type});
      console.log(this.locationAndUser);
      
      this.httpClient.post<LocationAndUsers>({controller:"maps"},this.locationAndUser).subscribe({
      // this.httpClient.post<LocationAndUsers>({controller:"maps"},{Name:this.locationAndUser.Name,Type:this.locationAndUser.Type,Coordinates:this.locationAndUser.Coordinates}).subscribe({
      next:(data)=>{
        this.hideSpinner()
        alert("Veri Kaydedilmiştir.");
      },
      error:(err)=>{
        this.hideSpinner();
        alert("Veri Eklenirken bir hata oluştu");
      }
    })
    // this.httpClient.get<any>({controller:"maps"}).subscribe({
    //   next:(data)=>{
    //     this.hideSpinner()
    //   },
    //   error:(err)=>{
    //     this.hideSpinner();
    //   }
    // })
    }
}
