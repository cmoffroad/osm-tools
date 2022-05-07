// INIT

const maxZoom = 24;
const fallback = parseLocationHash('#map=14/18.9475433/99.0693038');
const { center, zoom } = parseLocationHash(location.href, fallback);

const map = L.map('map', { 
  zoomControl: true, 
  loadingControl: true,
  maxZoom,
  contextmenu: true,
  contextmenuWidth: 200,
  contextmenuItems: [
    {
      text: 'Edit in OSM',
      callback: (e) => {
        const baseLayer = 'gsat';
        const overlays = 'osm-gps,strava,l7108,tomtom,groads'
        window.open(`https://www.openstreetmap.org/id#map=${map.getZoom()}/${e.latlng.lat}/${e.latlng.lng}&background=${baseLayer}&overlays=${overlays}&disable_features=boundaries,areas,water,settlements,others`);
      }
    }
  ]
})
.setView(center, zoom)
.on('moveend', (e) => updateLocationHash(e.target))
.whenReady(e => e.target.attributionControl.setPrefix(false))

window.onhashchange = () => {
  const { center, zoom } = parseLocationHash(location.href, fallback);
  map.setView(center, zoom);
}

// LAYERS / OVERLAYS CONTROL

let invert = false;

const baseLayersMap = {
  'bing':
    new L.TileLayer.Bing({
      bingMapsKey: "AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L",
      maxNativeZoom: 18,
      maxZoom
    }),
  'gsat': 
    L.tileLayer('https://mt3.Google.com/vt?z={z}&x={x}&y={y}&lyrs=s', {
      maxNativeZoom: 21,
      maxZoom
    })
    .setZIndex(0)
    .on('load', (e) => invert = false),
  'worldtopomap': 
    L.tileLayer('https://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      maxNativeZoom: 19,
      maxZoom,
      className: 'worldtopomap'
    })
    .setZIndex(0)
    .on('load', (e) => invert = true)
};

const overlaysMap = {
  'osm-gps': 
    L.tileLayer('https://{s}.gps-tile.openstreetmap.org/lines/{z}/{x}/{y}.png', {
      maxNativeZoom: 18,
      maxZoom,
      opacity: 1
    }).setZIndex(2),
  'strava': 
    L.tileLayer('https://heatmap-external-{s}.strava.com/tiles-auth/all/red/{z}/{x}/{y}.png?Key-Pair-Id=APKAIDPUN4QMG7VUQPSA&Policy=eyJTdGF0ZW1lbnQiOiBbeyJSZXNvdXJjZSI6Imh0dHBzOi8vaGVhdG1hcC1leHRlcm5hbC0qLnN0cmF2YS5jb20vKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY1MjM0NDE1OH0sIkRhdGVHcmVhdGVyVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNjUxMTIwMTU4fX19XX0_&Signature=GmS6dXD7oUelGAXhU8L0BwO~7oIV3k3S0U58baqkWC5yj8HTxu1O9Tv2BweRkp6MsW1TA1pfwxTeM61vm9bCWOyrsLCHIpnjAhFQfCjQfwkPp60SgXyqjcCDHQK1ARFW6EJsREUa0g6OcJMHgqgEkvrQwQ5~ZTIzsmzoGKQwZYnT3SKYmjeB2uOcE-oXxSxgYvbctXnvpu-MBrUbtk2RZhilNaNrfdvKGs4VJGH-M9PhdDXL-csQ7g16JsDNSyLYSTbVOehFE05m8E7UgCcOL1jIM5azpceamGvoieGI4OOTcuDIyzk3UuHSE5GGFT7YIDSsyz7WqIgV4aJvIK0Dig__', { 
      maxNativeZoom: 12,
      maxZoom,
      opacity: 1
    })
    .setZIndex(2),
  'cld': 
    L.tileLayer.wms('http://cld.drr.go.th/geoserver/gwc/service/wms?service=WMS&request=GetMap&layers=ProtoPj%3Agis_cld_route_spc&styles=&format=image%2Fpng&transparent=true&version=1.1.1&srs=EPSG%3A3857', {
      maxNativeZoom: 18,
      maxZoom,
      opacity: 0.5,
      className: invert && 'invert'
    }).setZIndex(1),
  'l7018': 
    L.tileLayer.wms('http://cld.drr.go.th/geoserver/gwc/service/wms?service=WMS&request=GetMap&layers=ProtoPj%3Agis_road_l7018&styles=&format=image%2Fpng&transparent=true&version=1.1.1&srs=EPSG%3A3857', {
      maxNativeZoom: 18,
      maxZoom,
      opacity: 0.5,
      className: invert && 'invert'
    }).setZIndex(1),
  'tomtom': 
    L.tileLayer('https://{s}.api.tomtom.com/map/1/tile/hybrid/main/{z}/{x}/{y}.png?key=8h504Wc4AXL6OPndqhrtKf70AovVBL3V', {
      maxNativeZoom: 18,
      maxZoom,
      opacity: 0.4,
      className: invert && 'invert'
    })
    .setZIndex(1),
  'groads': 
    L.tileLayer('https://mt3.Google.com/vt?z={z}&x={x}&y={y}&lyrs=h', {
      maxNativeZoom: 22,
      maxZoom,
      opacity: 1,
      className: invert && 'invert'
    })
    .setZIndex(1),
  'mapbox_locator_overlay': 
    L.tileLayer('https://api.mapbox.com/styles/v1/openstreetmap/ckasmteyi1tda1ipfis6wqhuq/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJja2w5YWtqbDAwcGFkMnZtdngzbWtlbDE3In0.U3DODCbBGFfFXkilttz1YA', { 
      minNativeZoom: 15,
      maxNativeZoom: 22,
      maxZoom,
      className: !invert && 'invert'
    })
    .setZIndex(3),
};

baseLayersMap.gsat.addTo(map);

L.control.layers(baseLayersMap, overlaysMap, { 
  position: 'bottomright', 
  collapsed: false,
  autoZIndex: false
}).addTo(map);

L.control.locate().addTo(map);

Object.values(overlaysMap).forEach(overlay => map.addLayer(overlay));

// TILE LOADING PROGRESS CONTROL

const tileLayers = L.layerGroup(Object.values(overlaysMap));

const tileProgressBarControl = new L.Control.TileLoadingProgress({
  leafletElt: tileLayers,
  position: 'bottomleft'
});
tileLayers.addTo(map);
tileProgressBarControl.addTo(map);

// SEARCH CONTROL

const provider = new window.GeoSearch.OpenStreetMapProvider({
  params: {
    countrycodes: 'th'
  }
});
const search = new GeoSearch.GeoSearchControl({
  provider: provider,
  style: 'bar',
  updateMap: true,
  autoClose: true,
  autoSearch: false,
  searchLabel: 'Enter address or paste a OSM URL with a hash fragment (#)'
}).addTo(map);

search.searchElement.input.onkeyup = evt => { 
  if (evt.key === 'Enter') {
    searchURLAndSetMapView(evt.target, map);
  }
}
search.searchElement.input.onpaste = evt => {
  setTimeout(() => {
    searchURLAndSetMapView(evt.target, map);
  }, 250);
}

