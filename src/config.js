export const breakpoints = [
  40,
  52,
  64,
]

export const space = [
  0, 4, 8, 12, 16, 24,
]

export const units = {
  /* Grid module */
  ui: (value) => `${value * 4}px`,
  /* Grid module */
  md: (value) => `${value * 8}px`,
  /* Grid block */
  bl: (value) => `${value * 56}px`,
}

export default {
  breakpoints,
  space,
  units,
}
