function parseLocationHash (url, fallback) {
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
  } else if (fallback) {
    return fallback;
  } else {
    return { };
  }
}

function updateLocationHash (map) {
  const center = map.getCenter(), zoom = map.getZoom();
  history.pushState(null,null,`#map=${zoom}/${center.lat}/${center.lng}`);  
}

function searchURLAndSetMapView (input, map) {
  const { value } = input;
  const { center, zoom } = parseLocationHash(value);
  if (zoom && center) {
    map.setView(center, zoom);
    setTimeout(() => input.value = '', 250);
  }
}