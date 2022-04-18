const fs = require('fs');
const path = require('path');

const { categories, roads } = require('../lib/config2');
const { lookupPaletteColor } = require('../lib/palette');

let declarations = [];

const linecap = (dash) =>
  dash && dash.length ? 'butt' : 'none';

const dasharray = (dash) => 
  dash && dash.length ? dash : 'none';

const line = (group, tag) => 
  `.data-layer.osm .layer-osm.lines .linegroup.line-${group} path.tag-highway.${tag}`;

const declaration = (groups, tags, attributes) => {
  let lines = [];
  tags.forEach(tag => {
    groups.forEach(group => {
      lines.push(line(group, tag));
    });
  });
  if (lines.length) {
    const comment = `/* tags: ${tags.join(', ')} + groups: ${groups.join(', ')} */`;
    const values = Object.entries(attributes).map(([key, value]) => `  ${key}: ${value};`);
    return [ comment, lines.join(',\n') + ' {', ...values, '}' ].join('\n');
  }
}

Object.entries(roads).forEach(([highway, cfg]) => {
  const { dash, casing, stroke, casingColor, strokeColor } = cfg;

  declarations.push(declaration(
    [ 'casing', 'casing-highlighted' ],
    [ `tag-highway-${highway}` ],
    { 
      stroke: casingColor || 'black',
      'stroke-width': `${casing*2 + stroke} !important`,
      'stroke-dasharray': dasharray(dash),
      'stroke-linecap': linecap(dash)
    }
  ));

  declarations.push(declaration(
    [ 'stroke', 'stroke-highlighted' ],
    [ `tag-highway-${highway}` ],
    { 
      stroke: lookupPaletteColor(strokeColor, 400),
      'stroke-width': `${stroke} !important`,
      'stroke-dasharray': dasharray(dash),
      'stroke-linecap': linecap(dash)
    }
  ));
});

Object.values(categories).forEach(({ casingColor, strokeColor, dash, tracktypes, surfaces }) => {
  // declarations.push(declaration(
  //   ['stroke', 'stroke-highlighted'], 
  //   tracktypes.map(v => `tag-tracktype-${v}`),
  //   {
  //     'stroke': strokeColor,
  //     'stroke-dasharray': dasharray(dash),
  //     'stroke-linecap': linecap(dash)
  //   }
  // ));
  // declarations.push(declaration(
  //   [ 'casing', 'casing-highlighted' ],
  //   tracktypes.map(v => `tag-tracktype-${v}`),
  //   {
  //     'stroke': casingColor,
  //     'stroke-dasharray': dasharray(dash),
  //     'stroke-linecap': linecap(dash)
  //   }
  // ));

  declarations.push(declaration(
    ['stroke', 'stroke-highlighted'], 
    surfaces.map(v => `tag-surface-${v.replace(/\:/g, '\\:')}`),
    {
      'stroke': strokeColor,
      'stroke-dasharray': dash ? `${dasharray(dash)}` : undefined,
      'stroke-linecap': dash ? `${linecap(dash)}` : undefined
    }
  ));

  declarations.push(declaration(
    [ 'casing', 'casing-highlighted' ],
    surfaces.map(v => `tag-surface-${v.replace(/\:/g, '\:')}`),
    {
      'stroke': casingColor,
      'stroke-dasharray': dash ? `${dasharray(dash)}` : undefined,
      'stroke-linecap': dash ? `${linecap(dash)}` : undefined
    }
  ));
});

const css = declarations.filter(d => !!d).join('\n\n');

fs.writeFileSync(path.join(__dirname, '..', 'id-chrome-extension', 'id.css'), css);