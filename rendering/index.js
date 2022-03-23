function parseConfig(string, symmetrical) {
  let rows = string.split('|');
  if (symmetrical)
    rows = [...rows, ...rows.slice(0,-1).reverse()];

  return rows.map(row => {
    const cells = row.split(':');
    return {
      width: parseInt(cells[0]) || 0, 
      stroke: lookupPaletteColor(cells[1]), 
      dasharray: cells[2] || 'none', 
      fill: lookupPaletteColor(cells[3])
    }
  })
}

function generateSvgImage(configs, opacity) {
  let elements = [], height = 0;

  configs.forEach(({width, stroke, dasharray, fill}) => {
    if (width) {
      let y = height + (width / 2);
      if (fill) {
        elements.push(`<line x1="0" y1="${y}" x2="100%" y2="${y}" style="stroke:${fill};stroke-width:${width};stroke-opacity:${opacity}" />`);
      }
      elements.push(`<line x1="0" y1="${y}" x2="100%" y2="${y}" style="stroke:${stroke};stroke-width:${width};stroke-dasharray:${dasharray};stroke-opacity:${opacity}" />`);
    }

    height += width;
  });

  var svg = `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${elements.join('')}</svg>`;

  var url = svg
    .replace(/\"/g, '&quot;')
    .replace(/\%/g, '%25')
    .replace(/\#/g, '%23')
    .replace(/\</g, '%3c')
    .replace(/\>/g, '%3E');

  // console.log(url);

  return `<img width="100%" height="${height}" src="data:image/svg+xml,${url}" />`
}

function createTableCell(content) {
  const cell = document.createElement('td');
  cell.innerHTML = content;
  return cell;
}

function appendTableRow(selector, description, configs, opacity) {
  var tr = document.createElement('tr');
  const tag = configs && configs.length > 0 ? 'code' : 'h4';
  tr.appendChild(createTableCell(configs ? createWikiLink(description) : `<h4>${description}</h4>`))
  
  if (configs) {
    configs.forEach(config => {
      const lines = parseConfig(config, true);
      tr.appendChild(createTableCell(generateSvgImage(lines, opacity)));
    })
  }
  document.querySelector(selector).appendChild(tr);
}

function createWikiLink(tag) {
  let href = 'https://wiki.openstreetmap.org/wiki/';
  if (tag.indexOf('=') !== -1)
    href += `Tag:${tag}`;
  else
    href += `Key:${tag}`;

  return `<a href="${href}" target="_blank"><code>${tag}</code></a>`;
}

const styles = [
  { title: '(A) default style', fill: 'black', stroke: 'black', opacity: 1 },
  { title: '(B) dash only style', fill: 'transparent', stroke: 'black', opacity: 1 },
  // { title: 'access private/no', fill: '', stroke: 'black', opacity: 0.5 },
  // { title: 'unconfirmed', fill: '', stroke: '#fa00ff', opacity: 1 },
];

styles.forEach(({title, fill, stroke, opacity}) => {
  appendTableRow('table', title);

  Object.entries(ROADS).forEach(([tag, road]) => {
    appendTableRow('table', `highway=${tag}`, Object.values(CATEGORIES).map(({ dash }) => `${road.casing}:${stroke}:${dash}:${road.fill || fill}|${road.stroke}:${road.color}:${dash}:${road.fill || fill}`), opacity);
  })
});