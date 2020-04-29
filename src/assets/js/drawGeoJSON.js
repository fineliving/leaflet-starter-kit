import * as Konva from "konva";
import "@/libs/geography/Graphic.js";
import "@/libs/geography/GraphicLayer.js";
import jizhan from "@/assets/images/gis/5g.svg";
import { compare, xxx } from "@/libs/geography/Util";
/* eslint-disable no-undef */

/**
 * @namespace drawGeoJSON
 * @category BaseTypes drawGeoJSON
 */
let drawGeoJSON = {};
export let drawReTiNAStations = function (nodes, cellback) {
  handleNodes(nodes, handleImage, cellback);
};

export let handleNodes = function (nodes, imageCellback, cellback) {
  let graphics = []; // 图形数组
  nodes.forEach((station, index) => {
    station.type === "室内"
      ? handleIndoorNode(
          station,
          index,
          nodes.length,
          graphics,
          imageCellback,
          cellback
        )
      : handleOutdoorNode(
          station,
          index,
          nodes.length,
          graphics,
          imageCellback,
          cellback
        );
  });
};

export let handleIndoorNode = function (
  station,
  index,
  length,
  graphics,
  imageCellback,
  cellback
) {
  let width = 122;
  let height = 122;
  let stage = new Konva.Stage({
    container: document.createElement("container"),
    width: width,
    height: height,
  });
  let layer = new Konva.Layer();
  station.children.sort(compare);
  station.children.forEach((ele) => {
    addRegularPolygonToLayer(stage, layer, ele.radius, ele.ecgi);
  });
  let image = new Image();
  image.src = jizhan;
  image.onload = function () {
    imageCellback(
      stage,
      layer,
      station,
      image,
      graphics,
      index,
      length,
      cellback
    );
  };
};

export let handleOutdoorNode = function (
  station,
  index,
  length,
  graphics,
  imageCellback,
  cellback
) {
  let width = 122;
  let height = 122;
  let stage = new Konva.Stage({
    container: document.createElement("container"),
    width: width,
    height: height,
  });
  let layer = new Konva.Layer();
  station.children.sort(compare);
  station.children.forEach((ele) => {
    addArcToLayer(
      stage,
      layer,
      ele.radius,
      ele.angle,
      ele.rotation,
      getColor(ele.color),
      ele.ecgi
    );
  });

  let image = new Image();
  image.src = jizhan;
  image.onload = function () {
    imageCellback(
      stage,
      layer,
      station,
      image,
      graphics,
      index,
      length,
      cellback
    );
  };
};

export let handleImage = function (
  stage,
  layer,
  station,
  image,
  graphics,
  index,
  length,
  cellback
) {
  addImageToLayer(stage, layer, image);
  stage.add(layer);
  graphics.push(
    L.graphic({
      latLng: L.latLng(station.latitude, station.longitude),
      style: layer.getCanvas(),
      konvaLayer: layer,
    })
  );
  if (index + 1 >= length) {
    let graphicLayer = L.graphicLayer(graphics, {
      render: "canvas",
      onClick: function () {},
    });
    cellback(graphicLayer);
  }
};

export let addImageToLayer = function (stage, layer, imageSrc, ecgi) {
  let image = new Konva.Image({
    ecgi: ecgi,
    image: imageSrc,
    x: stage.width() / 2,
    y: stage.height() / 2,
    width: 30,
    height: 30,
    offsetX: 15,
    offsetY: 15,
  });
  image.on("click", function () {});
  layer.add(image);
};

export let addArcToLayer = function (
  stage,
  layer,
  radius,
  angle,
  rotation,
  color,
  ecgi
) {
  let arc = new Konva.Arc({
    ecgi: ecgi,
    x: stage.width() / 2,
    y: stage.height() / 2,
    innerRadius: 0,
    outerRadius: radius,
    rotation: -(90 + angle / 2) + rotation,
    angle: angle,
    fillRadialGradientStartRadius: 0,
    fillRadialGradientEndRadius: radius,
    fillRadialGradientColorStops: [0, color.start, 1, color.end],
    stroke: "white",
    strokeWidth: 1,
  });
  addInteractionEffect(arc, layer);
  layer.add(arc);
};

export let addRegularPolygonToLayer = function (stage, layer, radius, ecgi) {
  let triangle = new Konva.RegularPolygon({
    ecgi: ecgi,
    x: stage.width() / 2,
    y: stage.height() / 2,
    sides: 6,
    rotation: 90,
    radius: radius,
    fillRadialGradientStartRadius: 0,
    fillRadialGradientEndRadius: radius,
    fillRadialGradientColorStops: [0, "#2D98FF", 1, "#CBE6FF"],
  });
  addInteractionEffect(triangle, layer);
  layer.add(triangle);
};

export let addInteractionEffect = function (shape, layer) {
  shape.on("click", function (evt) {
    // shape.addName("selected");
    // shape.opacity(0.5);
    var shape = evt.target;
    let fill = "red";
    shape.fill(fill);
    layer.children.sort(xxx);
    layer.draw();
  });
  shape.on("mousemove", function (evt) {
    var shape = evt.target;
    let stroke = "white";
    let strokeWidth = 2;
    shape.stroke(stroke);
    shape.strokeWidth(strokeWidth);
    layer.children.sort(xxx);
    layer.draw();
  });
  shape.on("mouseout", function (evt) {
    var shape = evt.target;
    let stroke = "white";
    let strokeWidth = 1;
    shape.stroke(stroke);
    shape.strokeWidth(strokeWidth);
    layer.children.sort(xxx);
    layer.draw();
  });
};

export let getRadius = function (band) {
  let radius = 0;
  let angle = 0;
  switch (band) {
    case 34:
      radius = 60;
      angle = 15;
      break;
    case 38:
      radius = 60;
      angle = 15;
      break;
    case 39:
      radius = 60;
      angle = 15;
      break;
    case 40:
      radius = 54;
      angle = 30;
      break;
    case 3:
      radius = 48;
      angle = 45;
      break;
    case 8:
      radius = 42;
      angle = 60;
      break;
    case 41:
      radius = 36;
      angle = 75;
      break;
    case 78:
      radius = 30;
      angle = 90;
      break;
    case 79:
      radius = 24;
      angle = 105;
      break;
    default:
      break;
  }
  return {
    radius: radius,
    angle: angle,
  };
};

export let getRadiusForDemo = function (band) {
  let radius = 0;
  let angle = 0;
  switch (band) {
    case 34:
      radius = 60;
      angle = 15;
      break;
    case 38:
      radius = 60;
      angle = 15;
      break;
    case 39:
      radius = 60;
      angle = 15;
      break;
    case 40:
      radius = 54;
      angle = 30;
      break;
    case 3:
      radius = 48;
      angle = 45;
      break;
    case 8:
      radius = 42;
      angle = 60;
      break;
    case 41:
      radius = 36;
      angle = 75;
      break;
    case 78:
      radius = 48;
      angle = 45;
      break;
    case 79:
      radius = 24;
      angle = 105;
      break;
    default:
      break;
  }
  return {
    radius: radius,
    angle: angle,
  };
};

export let getColor = function (color) {
  let start = "";
  let end = "";
  switch (color) {
    case "red":
      start = "#FF5F5F";
      end = "#FFB7B7";
      break;
    default:
      start = "#2D98FF";
      end = "#CBE6FF";
      break;
  }
  return {
    start: start,
    end: end,
  };
};

drawGeoJSON.drawReTiNAStations = drawReTiNAStations;
drawGeoJSON.getRadius = getRadius;
drawGeoJSON.getRadiusForDemo = getRadiusForDemo;
