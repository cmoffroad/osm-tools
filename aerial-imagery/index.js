function parseLocationHash (url, deflt) {
  let match;
  if (url && (match = url.match(/map=(\d+(.\d+)?)\/(\d+(.\d+)?)\/(\d+(.\d+)?)$/))) {
    return { 
      center: [ parseFloat(match[3]), parseFloat(match[5]) ], 
      zoom: parseFloat(match[1]) 
    };
  } else if (url && (match = url.match(/@(\d+(.\d+)?),(\d+(.\d+)?),(\d+(.\d+)?)z$/))) {
    // https://www.google.com/maps/@11.8014959,99.8001419,16.21z
    return { 
      center: [ parseFloat(match[1]), parseFloat(match[3]) ], 
      zoom: parseFloat(match[5]) 
    };
  } else if (deflt) {
    return { zoom: '17', center: [ 11.815238700979776, 99.79828689247371] };
  } else {
    return { };
  }
}

function updateLocationHash (map) {
  const center = map.getCenter(), zoom = map.getZoom();
  history.pushState(null,null,`#map=${zoom}/${center.lat}/${center.lng}`);  
}

// INIT

const { center, zoom } = parseLocationHash(location.href, true);
const maxZoom = 24;

// BING MAP

let bingMetaData = false;

const maps = [];

maps.push(
  new L.Map(`maps${maps.length + 1}`, { zoomControl: true })
  .setView(center, zoom)
  .addLayer(
    new L.TileLayer.Bing("AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L")
  )
  .on('moveend', (e) => updateLocationHash(e.target))
  .on('moveend', (e) => {
    if (!bingMetaData) {
      bingMetaData = true;
      e.target.eachLayer(layer => {
        if (layer.getMetaData) {
          layer.getMetaData(e.target.getCenter(), e.target.getZoom())
          .then(data => {
            const { vintageEnd } = data.resourceSets[0].resources[0];
            e.target.attributionControl.setPrefix(`Bing (${vintageEnd})`);
            bingMetaData = false;
          })
          .catch(err => {
            bingMetaData = false;
          })
        }
      });
    }
  })
  .whenReady(e => e.target.attributionControl.setPrefix('Bing'))
);

// ESRI  MAP

maps.push(
  new L.Map(`maps${maps.length + 1}`, { zoomControl: false })
  .setView(center, zoom)
  .addLayer(
    L.esri.tiledMapLayer({
      url: 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer',
      maxNativeZoom: 17,
      maxZoom
      // FIXME
      // url: 'https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer',
      // attribution: 'Esri World Imagery (Clarity) Beta'
    })
  )
  // .on('moveend', (e) => updateLocationHash(e.target))
  .whenReady(e => e.target.attributionControl.setPrefix(false))
);

// MAXAR MAP
maps.push(
  new L.Map(`maps${maps.length + 1}`, { zoomControl: false })
  .setView(center, zoom)
  .addLayer(
    L.tileLayer('https://services.digitalglobe.com/earthservice/tmsaccess/tms/1.0.0/DigitalGlobe:ImageryTileService@EPSG:3857@jpg/{z}/{x}/{y}.jpg?connectId=c2cbd3f2-003a-46ec-9e46-26a3996d6484', {
      attribution: 'Maxar Premium Imagery',
      tms: true,
      maxNativeZoom: 20,
      maxZoom
    })
  )
  // .on('moveend', (e) => updateLocationHash(e.target))
  .whenReady(e => e.target.attributionControl.setPrefix(false))
);

// MAPBOX MAP
maps.push(
  new L.Map(`maps${maps.length + 1}`, { zoomControl: false })
  .setView(center, zoom)
  .addLayer(
    L.tileLayer('https://d.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}@2x.jpg?access_token={accessToken}', {
      attribution: 'Mapbox Satellite',
      accessToken: 'pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJja2w5YWt5bnYwNjZmMnFwZjhtbHk1MnA1In0.eq2aumBK6JuRoIuBMm6Gew',
      maxZoom
    })
  )
  // .on('moveend', (e) => updateLocationHash(e.target))
  .whenReady(e => e.target.attributionControl.setPrefix(false))
);

// SYNC

maps.forEach(source => {
  maps.forEach(target => {
    if (source !== target) {
      source.sync(target, {
        syncCursor: true
      })
    }
  })
})

// LOCATE CONTROL
L.control.locate({
  showCircle: false,
  showMarker: false,
  showCompass: false
}).addTo(maps[0]);

// SEARCH CONTROL

const searchURLAndSetMapView = (input, map) => {
  const { value } = input;
  const { center, zoom } = parseLocationHash(value);
  if (zoom && center) {
    map.setView(center, zoom);
    setTimeout(() => input.value = '', 250);
  }
}

const provider = new GeoSearch.OpenStreetMapProvider({});
const search = new GeoSearch.GeoSearchControl({
  provider: provider,
  style: 'bar',
  updateMap: true,
  autoClose: true,
  autoSearch: false,
  searchLabel: 'Enter address or paste a OSM URL with a hash fragment (#)'
}).addTo(maps[0]);

search.searchElement.input.onkeyup = evt => { 
  if (evt.key === 'Enter') {
    searchURLAndSetMapView(evt.target, maps[0]);
  }
}
search.searchElement.input.onpaste = evt => {
  setTimeout(() => {
    searchURLAndSetMapView(evt.target, maps[0]);
  }, 250);
}

// OVERLAYS CONTROL
const overlays = {
  "Locator Overlay": 
    L.tileLayer('https://api.mapbox.com/styles/v1/openstreetmap/ckasmteyi1tda1ipfis6wqhuq/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJja2w5YWtqbDAwcGFkMnZtdngzbWtlbDE3In0.U3DODCbBGFfFXkilttz1YA', {
      maxNativeZoom: 22,
      maxZoom,
      opacity: .5,
      className: 'mapbox-locator'
    }),
  "GPS Traces Overlay": 
    L.tileLayer('https://{s}.gps-tile.openstreetmap.org/lines/{z}/{x}/{y}.png', {
      maxNativeZoom: 22,
      maxZoom,
      opacity: 1,
      className: 'gps-traces' 
    })
};

L.control.layers({}, overlays, { collapsed: false })
.addTo(maps[1]);

maps[1].on('overlayadd', evt => {
  const { _url: url, options } = evt.layer;
  maps.forEach(map => {
    if (map !== maps[1])
      map.addLayer(L.tileLayer(url, options));  
  })
})

const removeMapLayer = (map, layer) => {
  map.eachLayer(mapLayer => { 
    if (mapLayer.options.className === layer.options.className) 
      mapLayer.remove(); 
  });
}

maps[1].on('overlayremove', evt => {
  maps.forEach(map => {
    if (map !== maps[1])
      removeMapLayer(map, evt.layer);
  })
})

Object.values(overlays).forEach(overlay => overlay.addTo(maps[1]));