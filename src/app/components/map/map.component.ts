import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import Map from 'ol/Map';
import { Draw, Modify, Snap } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { get } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { View } from 'ol';
import { LocDataService } from 'src/app/services/loc-data.service';
import { GeoLoc } from 'src/app/interfaces/geoloc';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class MapComponent implements OnInit  {
  constructor(private httpCLient:CustomHttpClient,private modalComponent: MyModalComponent,private locDataService:LocDataService) {
  }
  
  data:any=null;
  _options: string = 'Point';
  _type: Type;
  mapİsActive:boolean=false;
  map:Map;
  isCheck:boolean=false;
  onChanges() {
    for (const opt in Type) {
      if(opt!=this._options){
        //bir değisiklik yapıldıysa
        this.mapİsActive=true;
        this.disposeMap(this.map); 
        this.getMap(this._options as Type);
        this.data=null;
        this.locDataService.data=null;
      }
    }

  }
  ngOnInit() {
   this.getMap(Type.Point);
  }

  mapDraw(draw){
    let _that = this;//This keyword unu degistirdim.
    this.map.on('click', (event) => {
      const coordinateLong = event.coordinate[0];
      const coordinateLat = event.coordinate[1];
      console.log('Tıklanan konum:', [coordinateLong,coordinateLat]);
      });
      draw.on('drawend', function(event) {
        var feature = event.feature;
        var geometry = feature.getGeometry();

        // console.log(geometry); 
        // console.log(geometry.getType());

        console.log(geometry.getCoordinates())
        let geoJsonObj:GeoLoc ={
          type:geometry.getType(),
          coordinates:geometry.getCoordinates()
        }
        _that.data= geoJsonObj;
        _that.locDataService.data=_that.data;
      });
  }
  getMap(type:Type){
    var raster = this.createRaster();
    var source=this.createSource();
    var vector=this.createVector(source);
    var extent=this.createExtent();
    this.map=this.createMap(raster,vector,extent);
    var modify=this.createModify(source);
    this.map.addInteraction(modify);
    var draw = this.createDraw(source,type)
    this.addInteractions(draw,source)
    this.mapDraw(draw)
  }

  
  addInteractions(draw,source) {
    let snap;
    // draw = new Draw({
    //   source: source,
    //   type: type,
    // });
    this.map.addInteraction(draw);
    snap = new Snap({source: source});
    this.map.addInteraction(snap);
  }

  createDraw(source,type):Draw{
    var draw = new Draw({
      source: source,
      type: type,
    });
    return draw
  }

  createRaster():TileLayer<OSM>{
    var raster = new TileLayer({
      source: new OSM(),
    });
    return raster;
  }
  createMap(raster,vector,extent):Map{
    var map = new Map({
      layers: [raster, vector],
      target: 'map',
      view: new View({
        center: [4628994.359892911,4834457.091923466],
        zoom: 6,
        extent,
      }),
    });
    return map;
  }

  createExtent():number[]{
    var extent = get('EPSG:3857').getExtent().slice();
    extent[0] += extent[0];
    extent[2] += extent[2];
    return extent;
  }
  
  createModify(source):Modify{
    var modify = new Modify({source: source});
    return modify;
  }

  createSource():VectorSource{
    var source = new VectorSource();
    return source;
  }
  createVector(source):VectorLayer<any>{
    var vector = new VectorLayer({
      source: source,
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
      },
    });
    return vector;
  }


  disposeMap(map:Map){
    map.dispose();
    this.mapİsActive=false;
  }

  createSnap(source){

  }



  openModal() {
    this.modalComponent.openModal();
  }
  }



export enum Type {
  Circle = 'Circle',
  LineString = 'LineString',
  Point = 'Point',
  Polygon = 'Polygon',
}


