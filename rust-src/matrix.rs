use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Matrix {
    pub width: u32,
    pub height: u32,
    data: Vec<f64>,
}

#[wasm_bindgen]
impl Matrix {
    #[wasm_bindgen(constructor)]
    pub fn new(width: u32, height: u32) -> Matrix {
        let size = (width * height) as usize;
        Matrix {
            width,
            height,
            data: vec![0.0; size],
        }
    }

    #[wasm_bindgen]
    pub fn set(&mut self, x: u32, y: u32, value: f64) {
        if x < self.width && y < self.height {
            let index = (y * self.width + x) as usize;
            if index < self.data.len() {
                self.data[index] = value;
            }
        }
    }

    #[wasm_bindgen]
    pub fn get(&self, x: u32, y: u32) -> f64 {
        if x < self.width && y < self.height {
            let index = (y * self.width + x) as usize;
            if index < self.data.len() {
                return self.data[index];
            }
        }
        0.0
    }

    #[wasm_bindgen]
    pub fn get_data(&self) -> Vec<f64> {
        self.data.clone()
    }

    #[wasm_bindgen]
    pub fn set_data(&mut self, data: Vec<f64>) {
        if data.len() == (self.width * self.height) as usize {
            self.data = data;
        }
    }

    #[wasm_bindgen]
    pub fn clear(&mut self) {
        for value in &mut self.data {
            *value = 0.0;
        }
    }

    #[wasm_bindgen]
    pub fn size(&self) -> usize {
        self.data.len()
    }
}

// Internal helper functions for Rust-only usage
impl Matrix {
    pub fn from_data(width: u32, height: u32, data: Vec<f64>) -> Matrix {
        Matrix { width, height, data }
    }

    pub fn get_raw_data(&self) -> &Vec<f64> {
        &self.data
    }

    pub fn average(&self) -> f64 {
        if self.data.is_empty() {
            return 0.0;
        }
        let sum: f64 = self.data.iter().sum();
        sum / self.data.len() as f64
    }

    pub fn max_value(&self) -> f64 {
        self.data.iter().fold(0.0, |a, &b| a.max(b))
    }

    pub fn min_value(&self) -> f64 {
        self.data.iter().fold(255.0, |a, &b| a.min(b))
    }
}