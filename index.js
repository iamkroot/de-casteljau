const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const { left: canvasLeft, top: canvasTop } = canvas.getBoundingClientRect();
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const drawCircle = (point, radius) => {
  ctx.beginPath();
  ctx.ellipse(point.x, point.y, radius, radius, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.closePath();
};

const putPixel = (point) => {
  ctx.beginPath();
  ctx.ellipse(point.x, point.y, 0.4, 0.4, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();
};

// use de Casteljau's algorithm to draw the Bezier curve
const drawCurve = (pts, t) => {
  if (pts.length === 1) putPixel(pts[0]);
  else {
    let newPts = [];
    for (let i = 0; i < pts.length - 1; i++) {
      newPts[i] = {
        x: (1 - t) * pts[i].x + t * pts[i + 1].x,
        y: (1 - t) * pts[i].y + t * pts[i + 1].y,
      };
    }
    drawCurve(newPts, t);
  }
};

const drawBezier = (pts) => {
  for (let t = 0; t <= 1; t += 0.001) {
    drawCurve(pts, t);
  }
};

let pts = [
  { x: 90, y: 110 },
  { x: 25, y: 40 },
  { x: 230, y: 40 },
  { x: 150, y: 240 },
];

const norm = (pt1, pt2) => {
  return (pt1.x - pt2.x) ** 2 + (pt1.y - pt2.y) ** 2;
};

const draw = () => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawBezier(pts);

  for (const pt of pts) {
    drawCircle(pt, 4);
  }
};

const getMousePos = (event) => {
  return {
    x: event.clientX - canvasLeft,
    y: event.clientY - canvasTop,
  };
};

let selected = null;

const dragStart = (event) => {
  const pt = getMousePos(event);
  for (const point of pts) {
    if (norm(point, pt) < 16) {
      selected = point;
      break;
    }
  }
};

const mouseMove = (event) => {
  if (selected == null) return;
  const { x, y } = getMousePos(event);
  selected.x = x;
  selected.y = y;
  draw();
};

const mouseUp = (event) => {
  if (selected != null) {
    if (event.ctrlKey) {
      // delete point
      pts.splice(pts.indexOf(selected), 1);
    }
    selected = null;
  } else {
    pts.push(getMousePos(event));
  }
  draw();
};

canvas.addEventListener("mousemove", mouseMove);
canvas.addEventListener("mousedown", dragStart);
canvas.addEventListener("mouseup", mouseUp);
draw();
