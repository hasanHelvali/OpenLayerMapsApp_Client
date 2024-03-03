import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import Map from 'ol/Map';
import { Draw, Modify, Snap } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, get } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { View } from 'ol';
import { LocDataService } from 'src/app/services/loc-data.service';
import { Point } from 'ol/geom';
import { GeoLocation } from 'src/app/models/geo-location';
import WKT, {  } from 'ol/format/WKT';
import { GeometryListModalComponent } from '../geometry-list-modal/geometry-list-modal.component';
import { LocAndUsers } from 'src/app/models/locAndUsers';
import { BaseComponent } from 'src/app/common/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class MapComponent extends BaseComponent implements OnInit  {
  constructor(private httpCLient:CustomHttpClient,private modalComponent: MyModalComponent,
    public locDataService:LocDataService, private listModalComponent:GeometryListModalComponent,spinner:NgxSpinnerService) {
      super(spinner)
      this.locDataService.veriOlusturulduSubject.subscribe((veri)=>{
        console.log("veri geldi");
        
        this.getGeometryById();
      })
      if(this.locDataService.getGeometryById!=null){
        this.getGeometryById()
      }

  }
  
  // data:GeoLocation=null;
  data:any=null;
  data2:any=null;
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
        this.locDataService.data2=null;
      }
    }

  }
  ngOnInit() {
   this.getMap(Type.Point);
  }

  mapDraw(draw):any{
    //This keyword unu degistirdim.
    let _that=this;
    this.map.on('click', (event) => {
      const coordinateLong = event.coordinate[0];
      const coordinateLat = event.coordinate[1];
      console.log('Tıklanan konum:', [coordinateLong,coordinateLat]);
      });
      draw.on('drawend', function(event) { 
        var feature = event.feature;
        var geometry = feature.getGeometry();

       const daataa={
        type:geometry.getType(),
        coordinates:geometry.getCoordinates()
      };

          const wkt =
      'POLYGON((10.689 -25.092, 34.595 ' +
      '-20.170, 38.814 -35.639, 13.502 ' +
      '-39.155, 10.689 -25.092))'
      var format = new WKT();
      const _wkt = format.writeGeometry(feature.getGeometry(), {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      });
      const _data2={
        wkt:_wkt
      }
      console.log(_wkt);
      // console.log(typeof(_wkt));
        console.log();
        _that.data=daataa;
        _that.data2=_data2;
        console.log(_that.data);

        _that.locDataService.data=_that.data;
        _that.locDataService.data2=_that.data2;
        
        // console.log(_that.locDataService.data);
        console.log(_that.locDataService.data2);

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
        center: fromLonLat([34.9998,39.42152]),
        zoom: 6.8,
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


  openModal() {
    this.modalComponent.openModal();
  }

  getGeometryModal(){
    this.showSpinner();
    this.httpCLient.get<LocAndUsers>({controller:"maps"}).subscribe({
      next:(data)=>{
        this.locDataService.listLocAndUser=data;      
        this.hideSpinner();
        this.listModalComponent.openModal();
      },
      error:(err)=>{
        //Doldurulabilir.
      }
    });
  }

  getGeometryById(){
    const id = this.locDataService.getGeometryById;
    console.log(id);
    console.log("----------------------");
    
  }
  }

export enum Type {
  Circle = 'Circle',
  LineString = 'LineString',
  Point = 'Point',
  Polygon = 'Polygon',
}


