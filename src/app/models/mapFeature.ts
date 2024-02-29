import VectorLayer from "ol/layer/Vector";
import { Type} from "../components/map/map.component";
import VectorSource from "ol/source/Vector";

export var type:Type;

export const source=new VectorSource();

export const vectorLayer= new VectorLayer({
    source: new VectorSource(),
    style: {
      'fill-color': 'rgba(255, 255, 255, 0.2)',
      'stroke-color': '#ffcc33',
      'stroke-width': 2,
      'circle-radius': 7,
      'circle-fill-color': '#ffcc33',
    },
  });
