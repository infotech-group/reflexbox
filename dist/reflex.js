'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _css = require('./css');

var _css2 = _interopRequireDefault(_css);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _contextTypes = require('./context-types');

var _contextTypes2 = _interopRequireDefault(_contextTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var reflex = function reflex(Component) {
  var Reflex = function Reflex(_ref, context) {
    var reflexProxyRef = _ref.reflexProxyRef,
        props = _objectWithoutProperties(_ref, ['reflexProxyRef']);

    var config = Object.assign({}, _config2.default, context.reflexbox);
    var next = (0, _css2.default)(config)(props);

    return _react2.default.createElement(Component, _extends({}, next, {
      ref: reflexProxyRef
    }));
  };

  Reflex.contextTypes = _contextTypes2.default;

  var ReflexRefForwarder = _react2.default.forwardRef(function (props, ref) {
    return _react2.default.createElement(Reflex, _extends({}, props, {
      reflexProxyRef: ref
    }));
  });

  return ReflexRefForwarder;
};

exports.default = reflex;