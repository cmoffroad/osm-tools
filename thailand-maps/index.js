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

// based on http://cld.drr.go.th/gisCldIntegration/index.php
const createDRRCLDLayer = (layers) => 
  L.tileLayer.wms(
    "http://cld.drr.go.th/geoserver/gwc/service/wms", {
    layers,
    srs: 'EPSG:3857',
    format: 'image/png',
    transparent: true,
    attribution: '<a href="http://cld.drr.go.th/gisCldIntegration/index.php">cld.drr.go.th</a>',
    nocache: +new Date()
  });


// based on https://gisportal.drr.go.th/portal/apps/webappviewer/index.html
const createDRRDynamicLayer = (layers) =>
  L.tileLayer.wms('https://gisportal.drr.go.th/portal/sharing/servers/aa5fdea8d96542d49d3d8731d77458b7/rest/services/GISBaseMaps/DRR_Dynamic/MapServer/export', {
    transparent: true,
    format: 'png',
    layers,
    bboxSR: 102100,
    f: 'image',
    attribution: '<a href="https://gisportal.drr.go.th/portal/apps/webappviewer/index.html">gisportal.drr.go.th</a>'
  });

// INIT

const fallback = { zoom: '12', center: [ 11.815238700979776, 99.79828689247371] };
const { center, zoom } = parseLocationHash(location.href, fallback);

const map = L.map('map', { zoomControl: true, loadingControl: true })
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
  'Google Maps':  createGoogleLayer('m'),
  'none': L.tileLayer('')
};

const overlays = buildOverlays([
  { label: 'Highways (ทางหลวง) [gisportal]', height: 2, fill: '#FC0D1B', layer: createDRRDynamicLayer('show:-1,-1,-1,3').setZIndex(3) },
  { label: "Highways 4+ Lanes (ทางหลวง 4+ ช่องจราจร) [gisportal]", height: 2, stroke: 'red', fill: '#FFFD38', layer:  createDRRDynamicLayer('show:-1,-1,-1,2').setZIndex(4) },
  { label: "Highways (ทางหลวง) [cld]", height: 4, fill: '#5B5B5B', layer: createDRRCLDLayer('ProtoPj:gis_highway').setZIndex(2) },
  { label: "Rural Roads / ทางหลวงชนบท [gisportal]", height: 2, fill: '#0A50A6', layer: createDRRDynamicLayer('show:-1,-1,-1,7').setZIndex(5) },
  { label: "Rural Roads / ทางหลวงชนบท [cld]", height: 4, fill: '#F2474B', layer: createDRRCLDLayer('ProtoPj:gis_route').setZIndex(6) },
  { label: "Local Roads (ถนนท้องถิ่น) [cld]", height: 2, fill: '#4DE052', stroke: '#64CE66', layer: createDRRCLDLayer('ProtoPj:gis_cld_route_spc').setZIndex(7) },
  { label: "Minor Roads (ถนน l7018)", height: 4, fill: '#C1C1C1', layer: createDRRCLDLayer('ProtoPj:gis_road_l7018').setZIndex(1) }
]);

layers['Transport Map'].addTo(map);

L.control.layers(layers, overlays, { 
  position: 'bottomright', 
  collapsed: false,
  autoZIndex: false
}).addTo(map);

L.control.locate().addTo(map);

Object.values(overlays).forEach(overlay => map.addLayer(overlay));

// TILE LOADING PROGRESS CONTROL

const tileLayers = L.layerGroup(Object.values(overlays));

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