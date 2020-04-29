/* eslint-disable no-undef */
/**
 * @class L.graphic
 * @classdesc 高效率点图层要素类。
 * @category Visualization Graphic
 * @extends {L.Class}
 * @param {Object} options - 图形参数。
 * @param {L.LatLng} options.latLng - 经纬度。
 * @param {number} options.id - 要素id。
 * @param {(L.circleStyle|L.sectorStyle|L.imageStyle)} [options.style] - 点样式。
 * @param {Object} [options.attributes] - 要素属性。
 */
export var Graphic = L.Class.extend({
  initialize: function (options) {
    options = options || {};

    var latLng = options.latLng || options._latLng;
    this._latLng = L.latLng(latLng.lat, latLng.lng);
    this._style = options.style || options._canvas;
    this._konvaLayer = options.konvaLayer;
    this.attributes = options.attributes;
    this.id = options.id ? options.id : null;
  },

  /**
   * @function L.graphic.prototype.getId
   * @description 获取当前 ID。
   * @returns {string} id
   */
  getId() {
    return this.id;
  },

  /**
   * @function L.graphic.prototype.setId
   * @description 设置当前要素 ID。
   * @param {string} id - 要素 ID。
   */

  setId(id) {
    this.id = id;
  },

  /**
   * @function L.graphic.prototype.setLatLng
   * @description 设置经纬度。
   * @param {L.LatLng} latLng - 经纬度参数。
   */
  setLatLng: function (latLng) {
    this._latLng = latLng;
  },

  /**
   * @deprecated
   * @function L.graphic.prototype.setCanvas
   * @description 设置画布，已弃用该设置，请使用 setStyle 接口。
   * @param {HTMLCanvasElement} canvas - 传入需要设置的画布。
   */
  setCanvas: function (canvas) {
    this._style = canvas;
  },

  /**
   * @function L.graphic.prototype.setAttributes
   * @description 设置要素属性。
   * @param {Object} attributes - 属性对象。
   */
  setAttributes: function (attributes) {
    this.attributes = attributes;
  },

  /**
   * @function L.graphic.prototype.getLatLng
   * @description 获取经纬度。
   * @returns {L.LatLng} 经纬度。
   */

  getLatLng: function () {
    return this._latLng;
  },

  /**
   * @deprecated
   * @function L.graphic.prototype.getCanvas
   * @description 获取画布，已弃用该设置，请使用 getStyle 接口
   * @returns {HTMLCanvasElement} 画布。
   */
  getCanvas: function () {
    return this._style;
  },

  /**
   * @function L.graphic.prototype.getAttributes
   * @description 获取要素属性。
   * @returns {Object} 要素属性。
   */
  getAttributes: function () {
    return this.attributes;
  },

  /**
   * @function L.graphic.prototype.setStyle
   * @description 设置样式。
   * @param {(L.circleStyle|L.imageStyle|L.sectorStyle)} style - 样式。
   */
  setStyle: function (style) {
    this._style = style;
  },

  /**
   * @function L.graphic.prototype.getStyle
   * @description 获取样式。
   * @returns {(L.circleStyle|L.imageStyle|L.sectorStyle)} 样式。
   */
  getStyle: function () {
    return this._style;
  },
  /**
   * @function L.graphic.prototype.getStyle
   * @description 获取样式。
   * @returns {(L.circleStyle|L.imageStyle|L.sectorStyle)} 样式。
   */
  getCircle: function () {
    return this._konvaLayer;
  },
});
export var graphic = function (options) {
  return new Graphic(options);
};

L.graphic = graphic;
