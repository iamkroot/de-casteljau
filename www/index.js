import { Board } from "de-cateljau-wasm";
import { memory } from "de-cateljau-wasm/de_cateljau_wasm_bg";

const board = Board.new();
const canvasWidth = board.width();
const canvasHeight = board.height();

const canvas = document.getElementById("board");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const { left: canvasLeft, top: canvasTop } = canvas.getBoundingClientRect();
const ctx = canvas.getContext("2d");


const drawCircle = (point, radius) => {
  ctx.beginPath();
  ctx.ellipse(point.x, point.y, radius, radius, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
};

const putPixel = (point) => {
  ctx.beginPath();
  ctx.ellipse(point[0], point[1], 0.5, 0.5, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
};

const plotCurve = () => {
  board.draw_bezier();
  const numPts = board.num_curve_points();
  const pointsPtr = board.curve_points();
  const points = new Float32Array(memory.buffer, pointsPtr, 2 * numPts);

  for (let i = 0; i < numPts; i++) {
    putPixel(new Float32Array(memory.buffer, pointsPtr + 8 * i, 2));
  }

};

plotCurve();

