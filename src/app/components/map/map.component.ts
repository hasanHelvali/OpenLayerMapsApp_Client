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
import { Geometry, Point } from 'ol/geom';
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
        this.getGeometryBywkt(veri);
        this._options="";
        
      })


  }
  
  data:any=null;
  data2:any=null;
  _options: string = 'Point';
  _type: Type;
  mapİsActive:boolean=false;
  map:Map;
  _featureMap:Map;
  isCheck:boolean=false;
  isFeatureMapActive:boolean=false;
  onChanges() {
    if(this.isFeatureMapActive==true){
      this.disposeMap(this._featureMap)
    }
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
  disposeFeatureMap(){
    if(this.isFeatureMapActive==true){
      this.disposeMap(this._featureMap)
      this.ngOnInit()
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
    this.isFeatureMapActive=false;
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
        this._options="";
      },
      error:(err)=>{
        alert("Bir Hata Oluştu.")
      }
    });
  }

  getGeometryBywkt(_wkt){
    console.log("++++++++");
    this._options="";
    this.isFeatureMapActive=true
    this.disposeMap(this.map);
    var map;
    
    const wkt = _wkt
    console.log(wkt);
    
    const format=new WKT();

    // var raster = this.createRaster();
    // var source=this.createSource();
    const feature = format.readFeature(wkt, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
  });
    // const vectorSource = new VectorSource({
    //   features: [feature],
    // });
    // // var vector=this.createVector(source);
    // const vectorLayer = new VectorLayer({
    //   source: vectorSource,
    // });
    // var extent=this.createExtent();
    // this.map=this.createMap(raster,vectorLayer,extent);

    // this.map.addLayer(vectorLayer);


    const raster = new TileLayer({
      source: new OSM(),
    });
    
    // const feature = format.readFeature(wkt, {
    //   dataProjection: 'EPSG:4326',
    //   featureProjection: 'EPSG:3857',
    // });
    
    const vector = new VectorLayer({
      source: new VectorSource({
        features: [feature],
      }),
    });
    
    var geometry = feature.getGeometry() as Geometry;
    // console.log(geometry)
    // console.log(geometry.getCoordinates())
    //  const map = new Map({
    //   layers: [raster, vector],
    //   target: 'map', // Harita bileşeninin ID'si
    //   view: new View({
    //     center: fromLonLat([34.9998,39.42152]),
    //     zoom: 6.8,
    //   }),
    // });
      this._featureMap=this.featureMap(raster,vector);
  }

  featureMap(raster,vector){
    if(this._featureMap){
      this._featureMap.dispose()
    }
    return new Map({
      layers: [raster, vector],
      target: 'map', // Harita bileşeninin ID'si
      view: new View({
        center: fromLonLat([34.9998,39.42152]),
        zoom: 6.8,
      }),
    });
  }
  }

export enum Type {
  Circle = 'Circle',
  LineString = 'LineString',
  Point = 'Point',
  Polygon = 'Polygon',
}


