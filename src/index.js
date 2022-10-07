import createPath from './utils/create-path';
import { enableZoom, disableZoom } from './utils/zoom';

const DrawFreelineDrag = {
  onSetup() {
    var counter = 0;
    const path = this.newFeature(createPath());
    this.addFeature(path);

    this.clearSelectedFeatures();

    // UI Tweaks
    this.updateUIClasses({ mouse: 'add' });
    this.setActionableState({ trash: true });
    disableZoom(this);

    return { path, counter };
  },

  onMouseDown(state, event) {
    event.preventDefault();

    const startPoint = [event.lngLat.lng, event.lngLat.lat];
    state.startPoint = startPoint;
    // Starting point - minX,minY
    state.path.addCoordinate(state.counter,event.lngLat.lng, event.lngLat.lat)
    state.counter++;
  },

  onDrag(state, event) {
    if (!state.startPoint) {
      return;
    }


    state.path.addCoordinate(state.counter,event.lngLat.lng, event.lngLat.lat);
    state.counter++;

    if (state.path.isValid()) {
      this.map.fire('draw.update', {
        features: [state.path.toGeoJSON()]
      });
      return;
    }
  },

  onMouseUp(state, event) {
    state.endPoint = [event.lngLat.lng, event.lngLat.lat];

    this.updateUIClasses({ mouse: 'pointer' });
    this.changeMode('simple_select', { featuresId: state.path.id });
  },

  onStop(state) {
    enableZoom(this);
    this.updateUIClasses({ mouse: 'none' });

    if (!this.getFeature(state.path.id)) {
      return;
    }

    // Remove latest coordinate
    state.path.coordinates.pop();

    if (state.path.isValid()) {
      this.map.fire('draw.create', {
        features: [state.path.toGeoJSON()]
      });
      return;
    }

    this.deleteFeature([state.path.id], { silent: true });
    this.changeMode('simple_select', {}, { silent: true });
  },

  onTrash(state) {
    this.deleteFeature([state.path.id], { silent: true });
    this.changeMode('simple_select');
  },

  toDisplayFeatures(state, geojson, display) {
    const isActivePolygon = geojson.properties.id === state.path.id;
    geojson.properties.active = isActivePolygon.toString();

    if (!isActivePolygon) {
      display(geojson);
      return;
    }

    if (!state.startPoint) {
      return;
    }

    display(geojson);
  },
};

export default DrawFreelineDrag;