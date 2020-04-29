mod utils;
use std::fmt;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
#[derive(Clone, Copy)]
pub struct Point {
    x: f32,
    y: f32,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "x: {}, y: {}", self.x, self.y)
    }
}

#[wasm_bindgen]
pub struct Board {
    width: u32,
    height: u32,
    control_points: Vec<Point>,
    plot_points: Vec<Point>,
    param_steps: u32,
}

#[wasm_bindgen]
impl Board {
    pub fn new() -> Board {
        let control_pts = vec![
            Point {
                x: 90f32,
                y: 110f32,
            },
            Point { x: 25f32, y: 40f32 },
            Point {
                x: 230f32,
                y: 40f32,
            },
            Point {
                x: 150f32,
                y: 240f32,
            },
        ];
        Board {
            width: 400,
            height: 400,
            control_points: control_pts,
            plot_points: Vec::new(),
            param_steps: 1000,
        }
    }

    fn draw_curve(&mut self, t: f32) {
        if self.control_points.is_empty() {
            return;
        }
        let mut points = self.control_points.to_vec();
        for n in (2..=points.len()).rev() {
            for i in 0..n - 1 {
                points[i] = Point {
                    x: (1.0 - t) * points[i].x + t * points[i + 1].x,
                    y: (1.0 - t) * points[i].y + t * points[i + 1].y,
                }
            }
        }
        self.plot_points.push(points[0])
    }

    pub fn draw_bezier(&mut self) {
        for t in 0..=self.param_steps {
            let t = t as f32 / self.param_steps as f32;
            self.draw_curve(t);
        }
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn curve_points(&self) -> *const Point {
        self.plot_points.as_ptr()
    }

    pub fn num_curve_points(&self) -> u32 {
        self.param_steps + 1
    }

    pub fn control_points(&self) -> *const Point {
        self.control_points.as_ptr()
    }

    pub fn num_control_points(&self) -> u32 {
        self.control_points.len() as u32
    }

    pub fn add_control_point(&mut self, x: f32, y: f32) {
        self.control_points.push(Point{x, y});
    }
}
