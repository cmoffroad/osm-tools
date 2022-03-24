function parseConfig(lines, symmetrical) {
  let rows = lines;
  if (symmetrical)
    rows = [...rows, ...rows.slice(0,-1).reverse()];

  return rows.map(row => {
    const cells = row.split(':');
    return {
      width: parseInt(cells[0]) || 0, 
      stroke: cells[1], 
      dasharray: cells[2] || 'none', 
      fill: cells[3]
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

function appendTableRow(selector, description, opacity, configs) {
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

appendTableRow('table', '(A) Default style');
Object.entries(roads).forEach(([tag, road]) => {
  appendTableRow('table', `highway=${tag}`, 1,  
    Object.values(categories).map(({ dash }) => [
      `${road.casing}:black:${dash}:${road.fill || 'black'}`,
      `${road.stroke}:${lookupPaletteColor(road.color, 400)}:${dash}:${road.fill || 'black'}`
    ])
  );
});

const restricted = lookupPaletteColor('red', 600);

appendTableRow('table', '(A.1) Restricted Access (red)');
Object.entries(roads).forEach(([tag, road]) => {
  appendTableRow('table', `highway=${tag}`, 1,  
    Object.values(categories).map(({ dash }) => [
      `${road.casing}:${restricted}:${dash}:${road.fill || restricted}`,
      `${road.stroke}:${road.fill ? restricted : lookupPaletteColor(road.color, 400)}:${dash}:${road.fill || 'black'}`
    ])
  );
});

appendTableRow('table', '(B) Transparent Dash style');
Object.entries(roads).forEach(([tag, road]) => {
  appendTableRow('table', `highway=${tag}`, 1,  
    Object.values(categories).map(({ dash }) => [
      `${road.casing}:black:${dash}:${road.fill}`,
      `${road.stroke}:${road.color}:${dash}:${road.fill}`
    ])
  );
});

appendTableRow('table', '(C) Dashed casing only');
Object.entries(roads).forEach(([tag, road]) => {
  appendTableRow('table', `highway=${tag}`, 1,  
    Object.values(categories).map(({ dash }) => [
      `${road.casing}:black:${dash}:${road.fill || 'grey'}`,
      `${road.stroke}:${road.color}:${road.fill ? dash : ''}`
    ])
  );
});

// appendTableRow('table', '(D) Stroke Tickness');
// Object.entries(roads).forEach(([tag, road]) => {
//   appendTableRow('table', `highway=${tag}`, 1,  
//     Object.values(categories).map(({ dash }, index) => [
//       `${road.casing}:black`,
//       `${road.stroke-index/2}:${road.color}`,
//       `${index/2}:black`
//     ])
//   );
// });