import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-geometry-list-modal',
  templateUrl: './geometry-list-modal.component.html',
  styleUrls: ['./geometry-list-modal.component.css']
})
export class GeometryListModalComponent implements OnInit{
  @ViewChild('liste') listModal: ElementRef;
  isRequest:boolean=false;;
  ngOnInit(): void {
  }
  openModal(){
    const modalDiv=document.getElementById("liste")
      console.log(modalDiv);
    if(modalDiv!=null){
      modalDiv.style.display="block"
    }

  }

  closeModal() {
    const modalDiv=document.getElementById("liste")
    if(modalDiv!=null)
      modalDiv.style.display="none"
    }
}
