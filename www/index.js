import { Board } from "de-cateljau-wasm";
import { memory } from "de-cateljau-wasm/de_cateljau_wasm_bg";

const board = Board.new();
const canvasWidth = board.width();
const canvasHeight = board.height();

const tDiv = document.getElementById("t-val");

const canvas = document.getElementById("board");
canvas.width = canvasWidth;
canvas.height = canvasHeight;
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

const draw = () => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  plotCurve();
  plotControlPoints();
  tDiv.textContent = "t value: " + (board.num_curve_points() - 1);
};

const getMousePos = (event) => {
  const { left: canvasLeft, top: canvasTop } = canvas.getBoundingClientRect();

  return {
    x: event.clientX - canvasLeft,
    y: event.clientY - canvasTop,
  };
};

let isSelected = false;

const mouseDown = (event) => {
  const { x, y } = getMousePos(event);
  isSelected = board.select_control_point(x, y) ? true : false;
};

const mouseMove = (event) => {
  if (!isSelected) return;
  const { x, y } = getMousePos(event);
  board.move_to(x, y);
  draw();
};

const mouseUp = (event) => {
  if (isSelected) {
    if (event.ctrlKey) {
      board.remove_selected();
    } else {
      board.deselect();
    }
    isSelected = false;
  } else {
    const { x, y } = getMousePos(event);
    board.add_control_point(x, y);
  }
  draw();
};

canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
draw();
