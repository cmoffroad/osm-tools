const CATEGORIES = {
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
    dash: [4, 4,],
    tracktypes: [],
    surfaces: []
  }
};

const SIZES = {
  track:  { casing: 0, stroke: 3 },
  small:  { casing: 1, stroke: 2 },
  medium: { casing: 1, stroke: 5 },
  large:  { casing: 2, stroke: 5 }
};

const COLORS = {
  track: 'black',
  service: 'grey',
  residential: 'white',
  tertiary: 'yellow',
  secondary: 'orange',
  primary: 'red',
  trunk: 'purple',
  motorway: 'indigo'
};

const ROADS = {
  track: {
    color: COLORS.track,
    fill: 'none',
    ...SIZES.track,
    ...CATEGORIES.caution
  },
  service: {
    color: COLORS.service,
    ...SIZES.small,
  },
  pedestrian: {
    color: COLORS.residential,
    ...SIZES.small,
    ...CATEGORIES.impassable
  },
  living_street:  {
    color: COLORS.residential,
    ...SIZES.small,
    ...CATEGORIES.impassable
  },
  residential: {
    color: COLORS.residential,
    ...SIZES.small,
  },
  unclassified: {
    color: COLORS.residential,
    ...SIZES.medium,
  },
  tertiary_link: {
    color: COLORS.tertiary,
    ...SIZES.small
  },
  tertiary: {
    color: COLORS.tertiary,
    ...SIZES.large,
  },
  secondary_link: {
    color: COLORS.secondary,
    ...SIZES.small
  },
  secondary: {
    color: COLORS.secondary,
    ...SIZES.large
  },
  primary_link: {
    color: COLORS.primary,
    ...SIZES.small
  },
  primary: {
    color: COLORS.primary,
    ...SIZES.large,
  },
  trunk_link: {
    color: COLORS.trunk,
    ...SIZES.small,
  },
  trunk: {
    color: COLORS.trunk,
    ...SIZES.large,
  },
  motorway_link: {
    color: COLORS.motorway,
    ...SIZES.small,
  },
  motorway: {
    color: COLORS.motorway,
    ...SIZES.large,
  },
}