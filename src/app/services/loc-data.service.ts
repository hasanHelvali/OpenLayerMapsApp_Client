import { Injectable } from '@angular/core';
import { GeoLocation } from '../models/geo-location';
import { LocAndUsers } from '../models/locAndUsers';

@Injectable({
  providedIn: 'root'
})
export class LocDataService {
  data:GeoLocation

  data2:LocAndUsers
  constructor() {
   }
}
