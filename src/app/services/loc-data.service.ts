import { Injectable } from '@angular/core';
import { GeoLoc } from '../interfaces/geoloc';

@Injectable({
  providedIn: 'root'
})
export class LocDataService {

  data:GeoLoc;
  constructor() {
    console.log("+++++");
    
   }

   
}
