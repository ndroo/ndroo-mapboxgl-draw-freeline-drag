var mapboxGLDrawFreelineDrag=function(){"use strict";return{onSetup(){const t=this.newFeature({type:"Feature",properties:{},geometry:{type:"LineString",coordinates:[[]]}});var e;return this.addFeature(t),this.clearSelectedFeatures(),this.updateUIClasses({mouse:"add"}),this.setActionableState({trash:!0}),e=this,setTimeout(()=>{const{map:t}=e,a=t&&t.doubleClickZoom;t&&a&&a.disable()},0),{path:t,counter:0}},onMouseDown(t,e){e.preventDefault();const a=[e.lngLat.lng,e.lngLat.lat];t.startPoint=a,console.log(t.path),console.log(a),t.path.addCoordinate(t.counter,e.lngLat.lng,e.lngLat.lat),t.counter++},onDrag(t,e){t.startPoint&&(t.path.addCoordinate(t.counter,e.lngLat.lng,e.lngLat.lat),t.counter++,t.path.isValid()&&this.map.fire("draw.create",{features:[t.path.toGeoJSON()]}))},onMouseUp(t,e){t.endPoint=[e.lngLat.lng,e.lngLat.lat],this.updateUIClasses({mouse:"pointer"}),this.changeMode("simple_select",{featuresId:t.path.id})},onStop(t){var e;e=this,setTimeout(()=>{const t=e._ctx&&e._ctx.store,a=e.map&&e.map;(a||t.getInitialValue)&&t.getInitialConfigValue("doubleClickZoom")&&a.doubleClickZoom.enable()},0),this.updateUIClasses({mouse:"none"}),this.getFeature(t.path.id)&&(t.path.removeCoordinate("0.4"),t.path.isValid()?this.map.fire("draw.create",{features:[t.path.toGeoJSON()]}):(this.deleteFeature([t.path.id],{silent:!0}),this.changeMode("simple_select",{},{silent:!0})))},onTrash(t){this.deleteFeature([t.path.id],{silent:!0}),this.changeMode("simple_select")},toDisplayFeatures(t,e,a){const o=e.properties.id===t.path.id;e.properties.active=o.toString(),o?t.startPoint&&a(e):a(e)}}}();
