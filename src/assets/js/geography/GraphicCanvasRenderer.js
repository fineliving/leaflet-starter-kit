/* eslint-disable no-undef */
const emptyFunc = L.Util.falseFn;
export var GraphicCanvasRenderer = L.Class.extend({
  initialize: function (layer, options) {
    this.layer = layer;
    options = options || {};
    L.Util.setOptions(this, options);
  },

  /**
   * @private
   * @function  GraphicCanvasRenderer.prototype.getRenderer
   * @description 返回渲染器给图层，提供图层后续的数据增删改。
   * @returns {L.Canvas}
   */
  getRenderer: function () {
    return this.options.renderer;
  },

  /**
   * @private
   * @function  GraphicCanvasRenderer.prototype.update
   * @description  更新图层，数据或者样式改变后调用。
   */
  update: function () {
    this.getRenderer()._clear();
    this.getRenderer()._draw();
  },

  _handleMousemove: function (evt) {
    let me = this,
      layer = me.layer,
      map = layer._map;
    if (!layer.options.onClick) {
      return;
    }
    this.layer._renderer._ctx.canvas.style.cursor = "";
    let graphics = layer._getGraphicsInBounds();
    for (let i = 0; i < graphics.length; i++) {
      let p1, p2, bounds;
      let center = map.latLngToLayerPoint(graphics[i].getLatLng());
      let style = graphics[i].getStyle();
      if (!style && this.defaultStyle) {
        style = this.defaultStyle;
      }
      var ratio = style.pixelRatio;
      var zoomUnit = Math.pow(2, 18 - map.getZoom()); // 计算缩放的单元
      if (style.img) {
        let anchor = style.anchor || [
          style.img.width / 2,
          style.img.height / 2,
        ];
        p1 = L.point(center.x - anchor[0], center.y - anchor[1]);
        p2 = L.point(p1.x + style.img.width, p1.y + style.img.height);
      } else {
        p1 = L.point(
          center.x - style.width / 2 / zoomUnit / ratio,
          center.y - style.height / 2 / zoomUnit / ratio
        );
        p2 = L.point(
          center.x + style.width / 2 / zoomUnit / ratio,
          center.y + style.height / 2 / zoomUnit / ratio
        );
      }
      bounds = L.bounds(p1, p2);
      if (bounds.contains(map.latLngToLayerPoint(evt.latlng))) {
        graphics[i]._konvaLayer.children.sort(this._compare);
        let mouseoutYN = true;
        for (let j = 0; j < graphics[i]._konvaLayer.children.length; j++) {
          let ele = graphics[i]._konvaLayer.children[j];
          if (
            ele.intersects(
              L.point(
                map.latLngToLayerPoint(evt.latlng).x - p1.x,
                map.latLngToLayerPoint(evt.latlng).y - p1.y
              )
            )
          ) {
            this.layer._renderer._ctx.canvas.style.cursor = "pointer";
            layer.update();
            mouseoutYN = false;
            if (layer.options.lastMousemoveShape != null) {
              layer.options.lastMousemoveShape.fire("mouseout", {}, true);
            }
            layer.options.lastMousemoveShape = ele;
            ele.fire("mousemove", {}, true);
            break;
          }
        }
        if (mouseoutYN && layer.options.lastMousemoveShape != null) {
          layer.options.lastMousemoveShape.fire("mouseout", {}, true);
        }
        // return layer.options.onClick.call(layer, graphics[i], evt)
      }
    }
  },

  _handleClick: function (evt) {
    let me = this,
      layer = me.layer,
      map = layer._map;
    if (!layer.options.onClick) {
      return;
    }
    this.layer._renderer._ctx.canvas.style.cursor = "";
    let graphics = layer._getGraphicsInBounds();
    for (let i = 0; i < graphics.length; i++) {
      let p1, p2, bounds;
      let center = map.latLngToLayerPoint(graphics[i].getLatLng());
      let style = graphics[i].getStyle();
      if (!style && this.defaultStyle) {
        style = this.defaultStyle;
      }
      var ratio = style.pixelRatio;
      var zoomUnit = Math.pow(2, 18 - map.getZoom()); // 计算缩放的单元
      if (style.img) {
        let anchor = style.anchor || [
          style.img.width / 2,
          style.img.height / 2,
        ];
        p1 = L.point(center.x - anchor[0], center.y - anchor[1]);
        p2 = L.point(p1.x + style.img.width, p1.y + style.img.height);
      } else {
        p1 = L.point(
          center.x - style.width / 2 / zoomUnit / ratio,
          center.y - style.height / 2 / zoomUnit / ratio
        );
        p2 = L.point(
          center.x + style.width / 2 / zoomUnit / ratio,
          center.y + style.height / 2 / zoomUnit / ratio
        );
      }
      bounds = L.bounds(p1, p2);
      if (bounds.contains(map.latLngToLayerPoint(evt.latlng))) {
        graphics[i]._konvaLayer.children.sort(this._compare);
        for (let j = 0; j < graphics[i]._konvaLayer.children.length; j++) {
          let ele = graphics[i]._konvaLayer.children[j];

          if (
            ele.intersects(
              L.point(
                map.latLngToLayerPoint(evt.latlng).x - p1.x,
                map.latLngToLayerPoint(evt.latlng).y - p1.y
              )
            )
          ) {
            if (layer.options.lastClickShape != null) {
              let fill = null;
              layer.options.lastClickShape.fill(fill);
              layer.options.lastClickShape.parent.draw();
            }
            layer.options.lastClickShape = ele;
            ele.fire("click");
            // break
            return layer.options.onClick.call(layer, ele, evt, true);
          }
        }
        this.layer._renderer._ctx.canvas.style.cursor = "pointer";
        layer.update();
      }
    }
  },
  _compare(value1, value2) {
    if (value1.attrs.outerRadius < value2.attrs.outerRadius) {
      return -1;
    } else if (value1.attrs.outerRadius > value2.attrs.outerRadius) {
      return 1;
    } else {
      return 0;
    }
  },
  // 跟GraphicWebGLRenderer保持一致
  _clearBuffer: emptyFunc,
});

L.Canvas.include({
  drawGraphics: function (graphics, defaultStyle) {
    var me = this;
    if (!me._drawing) {
      return;
    }
    // this._ctx.clearRect(0, 0, this._ctx.canvas.width, me._ctx.canvas.height);
    graphics.forEach(function (graphic) {
      var style = graphic.getStyle();
      if (!style && defaultStyle) {
        style = defaultStyle;
      }
      /* eslint-disable no-useless-call */
      if (style.img) {
        // 绘制图片
        me._drawImage.call(me, me._ctx, style, graphic.getLatLng());
      } else {
        // 绘制canvas
        me._drawCanvas.call(me, me._ctx, style, graphic.getLatLng());
      }
    });
  },

  _drawCanvas: function (ctx, style, latLng) {
    var canvas = style._canvas;
    var pt = this._map.latLngToLayerPoint(latLng);
    var ratio = this.getPixelRatio(ctx);
    // var ratio = this.getPixelRatio(ctx) / 2 // 放大两倍
    var zoomUnit = Math.pow(2, 18 - this._map.getZoom()); // 计算缩放的单元
    var p0 = pt.x - canvas.width / 2 / zoomUnit / ratio;
    var p1 = pt.y - canvas.height / 2 / zoomUnit / ratio;

    var width = canvas.width / zoomUnit / ratio;
    var height = canvas.height / zoomUnit / ratio;

    ctx.drawImage(canvas, p0, p1, width, height);
  },
  // 获取canvas应该放大的倍数的方法；
  getPixelRatio: function (context) {
    var backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;
    return (window.devicePixelRatio || 1) / backingStore;
  },
});
