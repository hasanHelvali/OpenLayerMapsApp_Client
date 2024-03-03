import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/common/base/base.component';
import { LocAndUsers } from 'src/app/models/locAndUsers';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { LocDataService } from 'src/app/services/loc-data.service';

import * as $ from 'jquery';

@Component({
  selector: 'app-geometry-list-modal',
  templateUrl: './geometry-list-modal.component.html',
  styleUrls: ['./geometry-list-modal.component.css']
})
export class GeometryListModalComponent extends BaseComponent implements OnInit{
// listLocAndUsers:LocAndUsers[]=[]
isModalActive:boolean=false;
  constructor(private httpClient:CustomHttpClient,public locDataService:LocDataService,spinner:NgxSpinnerService) {
    super(spinner)
  }
  @ViewChild('liste') listModal: ElementRef;
  isRequest:boolean=false;;
  ngOnInit(): void {

  }
  openModal()
  {
    const modalDiv=document.getElementById("liste")
    if(modalDiv!=null){
      modalDiv.style.display="block"
    }
  }

  closeModal() {
    const modalDiv=document.getElementById("liste")
    if(modalDiv!=null)
      modalDiv.style.display="none"
    }

    deleteLocAndUser(id){
      this.showSpinner();
      // const row =$() document.getElementById("dataRow"+id);
      const element = $("#dataRow"+id);
      console.log(element);
      this.httpClient.delete<any>({controller:"maps"},id).subscribe({
        next:()=>{   
          this.hideSpinner();
          alert("Kaydınız Silinmiştir.");
          element.fadeOut(500, () => {
            // Animasyon tamamlandıktan sonra satırı DOM'dan kaldır
            element.remove();
          });
        },
        error:()=>{
          this.hideSpinner();
          alert("Kayıt Silinirken Bir Hata Oluştu.");
        }
      })
    }

    getLocation(wkt){
      this.closeModal();
      this.locDataService.veriOlusturulduSubject.next(wkt)
    }
}
