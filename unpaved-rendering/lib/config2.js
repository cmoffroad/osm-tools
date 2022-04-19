const colors = {
  survey:  { strokeColor: '#fa00ff', casingColor: 'transparent' },
  missing: { strokeColor: '#888', casingColor: 'transparent' },
  paved:   { strokeColor: '#FFF', casingColor: '#000' },
  unpaved: { strokeColor: '#000', casingColor: '#000' },
}

const categories = {
  paved: {
    ...colors.paved, 
    tracktypes: [ 'grade1' ],
    surfaces: [ 'paved', 'chipseal', 'asphalt', 'concrete', 'concrete:plates', 'concrete:lanes' ]
  },
  unpaved:    { 
    ...colors.unpaved, 
    tracktypes: [ 'grade2', 'grade3', 'grade4', 'grade5' ],
    surfaces: [ 'unpaved', 'compacted', 'gravel', 'fine_gravel', 'paving_stones', 'sett', 'unhewn_cobblestone', 'cobblestone', 'metal', 'wood', 'grass_paver', 'woodchips', 'rock', 'pebblestone', 'ground', 'dirt', 'earth', 'grass', 'mud', 'sand' ]
  }
};

const sizes = {
  small:  { casing: 1, stroke: 1, dash: [10,2], ...colors.survey },
  medium:  { casing: 1, stroke: 3, ...colors.survey },
  large: { casing: 2, stroke: 6, ...colors.paved }
};

const roads = {
  cycleway: {
    ...sizes.small,
  },
  path: {
    ...sizes.small
  },
  footway: {
    ...sizes.small
  },
  track: {
    ...sizes.medium
  },
  service: {
    ...sizes.medium,    
  },
  pedestrian: {
    ...sizes.medium,
  },
  living_street:  {
    ...sizes.medium,
  },
  residential: {
    ...sizes.medium,
  },
  unclassified: {
    ...sizes.medium,
  },
  tertiary_link: {
    ...sizes.medium,
  },
  tertiary: {
    ...sizes.medium,
  },
  secondary_link: {
    ...sizes.medium,
  },
  secondary: {
    ...sizes.large,
  },
  primary_link: {
    ...sizes.medium,
  },
  primary: {
    ...sizes.large,
  },
  trunk_link: {
    ...sizes.medium,
  },
  trunk: {
    ...sizes.large,
  },
  motorway_link: {
    ...sizes.medium,
  },
  motorway: {
    ...sizes.large,
  },
}

module.exports = {
  categories,
  roads
}