const categories = {
  normal:     { 
    dash: [],
    tracktypes: [ 'grade1' ],
    surfaces: [ 'paved', 'chipseal', 'asphalt', 'concrete' ]
  },
  caution:    { 
    dash: [20, 4],
    tracktypes: [ 'grade2', 'grade3' ],
    surfaces: [ 'unpaved', 'concrete:plates', 'concrete:lanes', 'compacted', 'fine_gravel', 'paving_stones', 'sett', 'unhewn_cobblestone', 'cobblestone', 'metal', 'wood', 'grass_paver', 'woodchips' ]
  },
  awd: { 
    dash: [10, 8],
    tracktypes: [ 'grade4', 'grade5' ],
    surfaces: [ 'rock', 'pebblestone', 'ground', 'dirt', 'earth', 'grass', 'mud', 'sand' ]
  },
  impassable: { 
    dash: [4, 4],
    tracktypes: [],
    surfaces: []
  }
};

const sizes = {
  track:  { casing: 0, stroke: 3 },
  small:  { casing: 1, stroke: 2 },
  medium: { casing: 1, stroke: 5 },
  large:  { casing: 2, stroke: 5 }
};

const colors = {
  track: 'black',
  service: 'grey',
  residential: 'white',
  tertiary: 'yellow',
  secondary: 'orange',
  primary: 'red',
  trunk: 'purple',
  motorway: 'indigo'
};

const roads = {
  track: {
    color: colors.track,
    fill: 'none',
    ...sizes.track,
    ...categories.caution
  },
  service: {
    color: colors.service,
    ...sizes.small,
  },
  pedestrian: {
    color: colors.residential,
    ...sizes.small,
    ...categories.impassable
  },
  living_street:  {
    color: colors.residential,
    ...sizes.small,
    ...categories.impassable
  },
  residential: {
    color: colors.residential,
    ...sizes.small,
  },
  unclassified: {
    color: colors.residential,
    ...sizes.medium,
  },
  tertiary_link: {
    color: colors.tertiary,
    ...sizes.small
  },
  tertiary: {
    color: colors.tertiary,
    ...sizes.large,
  },
  secondary_link: {
    color: colors.secondary,
    ...sizes.small
  },
  secondary: {
    color: colors.secondary,
    ...sizes.large
  },
  primary_link: {
    color: colors.primary,
    ...sizes.small
  },
  primary: {
    color: colors.primary,
    ...sizes.large,
  },
  trunk_link: {
    color: colors.trunk,
    ...sizes.small,
  },
  trunk: {
    color: colors.trunk,
    ...sizes.large,
  },
  motorway_link: {
    color: colors.motorway,
    ...sizes.small,
  },
  motorway: {
    color: colors.motorway,
    ...sizes.large,
  },
}

module.exports = {
  categories,
  roads
}