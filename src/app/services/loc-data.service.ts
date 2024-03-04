import { Injectable } from '@angular/core';
import { GeoLocation } from '../models/geo-location';
import { LocAndUsers } from '../models/locAndUsers';
import { Subject } from 'rxjs';
import { Observable } from 'ol';

@Injectable({
  providedIn: 'root'
})
export class LocDataService {
  public veriOlusturulduSubject = new Subject<any>()
  data:GeoLocation

  data2:LocAndUsers

  listLocAndUser:LocAndUsers[]=[];

  getGeometryByWkt:string;
  constructor() {
   }
}
