"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var breakpoints = exports.breakpoints = [40, 52, 64];

var space = exports.space = [0, 4, 8, 12, 16, 24];

var units = exports.units = {
  /* Grid module */
  ui: function ui(value) {
    return value * 4 + "px";
  },
  /* Grid module */
  md: function md(value) {
    return value * 8 + "px";
  },
  /* Grid block */
  bl: function bl(value) {
    return value * 56 + "px";
  }
};

exports.default = {
  breakpoints: breakpoints,
  space: space,
  units: units
};