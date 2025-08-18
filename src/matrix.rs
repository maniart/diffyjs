pub struct Matrix {
    pub data: Vec<f64>,
    pub width: u32,
    pub height: u32,
}

impl Matrix {
    pub fn new(width: u32, height: u32) -> Self {
        Matrix {
            data: vec![0.0; (width * height) as usize],
            width,
            height,
        }
    }

    pub fn get(&self, x: u32, y: u32) -> Option<f64> {
        if x < self.width && y < self.height {
            Some(self.data[(y * self.width + x) as usize])
        } else {
            None
        }
    }

    pub fn set(&mut self, x: u32, y: u32, value: f64) {
        if x < self.width && y < self.height {
            self.data[(y * self.width + x) as usize] = value;
        }
    }

    pub fn to_vec(&self) -> Vec<f64> {
        self.data.clone()
    }
}