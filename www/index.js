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
  ctx.ellipse(point[0], point[1], radius, radius, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
};

const putPixel = (point) => {
  ctx.beginPath();
  ctx.ellipse(point[0], point[1], 0.5, 0.5, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
};

const iterPointArray = (num, ptr, callback) => {
  for (let i = 0; i < num; i++) {
    callback(new Float32Array(memory.buffer, ptr + 8 * i, 2));
  }
};

const plotCurve = () => {
  board.draw_bezier();
  iterPointArray(board.num_curve_points(), board.curve_points(), putPixel);
};

const plotControlPoints = () => {
  iterPointArray(board.num_control_points(), board.control_points(), (point) =>
    drawCircle(point, 4)
  );
};

board.add_control_point(0, 0);
board.add_control_point(200, 0);

plotCurve();
plotControlPoints();
