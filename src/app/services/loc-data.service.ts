import { Injectable } from '@angular/core';
import { GeoLocation } from '../models/geo-location';

@Injectable({
  providedIn: 'root'
})
export class LocDataService {
  data:GeoLocation
  constructor() {
   }
}
