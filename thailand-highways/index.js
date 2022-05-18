const buildOverlays = (configs) => {
  return configs.reduce((r, config) => {
    const { label, height, fill, stroke, layer } = config;
    const legend = `<div class="legend" style="height: ${height}px; border-color: ${stroke || 'white'}; background-color: ${fill};"></div>${label}`;
    r[legend] = layer;
    return r;
  }, {});      
}

const createGoogleLayer = (layers) => 
  L.tileLayer(`https://mt{s}.Google.com/vt?z={z}&x={x}&y={y}&lyrs=${layers}`, {
    subdomains: '123'
  });


// based on http://hris.doh.go.th/highway
const createDOHLayer = (layers) => 
  L.tileLayer.wms(
    "https://roadnet2.doh.go.th/geoserver/gwc/service/wms", {
    layers,
    srs: 'EPSG:3857',
    format: 'image/png',
    transparent: true,
    attribution: '<a href="http://hris.doh.go.th/highway">hris.doh.go.th</a>'
  });

// INIT

const fallback = { zoom: '12', center: [ 11.815238700979776, 99.79828689247371] };
const { center, zoom } = parseLocationHash(location.href, fallback);

const map = L.map('map', { 
  zoomControl: true, 
  loadingControl: true,
  contextmenu: false,
  contextmenuWidth: 200,
  contextmenuItems: [
    {
      text: 'Edit in OSM (Maxar)',
      callback: (e) => window.open(`https://www.openstreetmap.org/edit#background=Maxar-Standard&map=${map.getZoom()}/${e.latlng.lat}/${e.latlng.lng}`)
    },
    '-',
    {
      text: 'Open with Google Street View',
      callback: (e) => window.open(`https://www.google.com/maps/@?api=1&map_action=pano&basemap=terrain&viewpoint=${e.latlng.lat},${e.latlng.lng}&zoom=${map.getZoom()}`)
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

const layers = {
  'OpenStreetMap': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png'),
  'Transport Map': L.tileLayer('https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}@2x.png?apikey=6170aad10dfd42a38d4d8c709a536f38'),
  'Google Terrain': createGoogleLayer('p'),
  'Google Maps':  createGoogleLayer('r')
};

const overlays = { 
  "Km Stones": createDOHLayer('roadnet2:section_km').setZIndex(3)
}
layers['Google Maps'].addTo(map);
createDOHLayer('roadnet2:aadt').setZIndex(2).addTo(map);

L.control.layers(layers, overlays, { 
  position: 'bottomright', 
  collapsed: false,
  autoZIndex: false
}).addTo(map);

L.control.locate().addTo(map);

const legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'leaflet-control-layers');
  div.innerHTML = '<img src="./atv.png" />'
  return div;
};
legend.addTo(map);

// TILE LOADING PROGRESS CONTROL

// const tileLayers = L.layerGroup(Object.values(overlays));

// const tileProgressBarControl = new L.Control.TileLoadingProgress({
//   leafletElt: tileLayers,
//   position: 'bottomleft'
// });
// tileLayers.addTo(map);
// tileProgressBarControl.addTo(map);

// SEARCH CONTROL

// const provider = new window.GeoSearch.OpenStreetMapProvider({
//   params: {
//     countrycodes: 'th'
//   }
// });
// const search = new GeoSearch.GeoSearchControl({
//   provider: provider,
//   style: 'bar',
//   updateMap: true,
//   autoClose: true,
//   autoSearch: false,
//   searchLabel: 'Enter address or paste a OSM URL with a hash fragment (#)'
// }).addTo(map);

// search.searchElement.input.onkeyup = evt => { 
//   if (evt.key === 'Enter') {
//     searchURLAndSetMapView(evt.target, map);
//   }
// }
// search.searchElement.input.onpaste = evt => {
//   setTimeout(() => {
//     searchURLAndSetMapView(evt.target, map);
//   }, 250);
// }