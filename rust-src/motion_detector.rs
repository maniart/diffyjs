use crate::matrix::Matrix;
use crate::utils::{abs, polarize, rgb_average};

pub struct MotionDetector {
    pub width: u32,
    pub height: u32,
    pub resolution_x: u32,
    pub resolution_y: u32,
    pub sensitivity: f64,
    pub threshold: u8,
    previous_frame: Option<Vec<u8>>,
    diff_buffer: Vec<u8>,
}

impl MotionDetector {
    pub fn new(
        width: u32,
        height: u32,
        resolution_x: u32,
        resolution_y: u32,
        sensitivity: f64,
        threshold: u8,
    ) -> Self {
        let pixel_count = (width * height) as usize;
        
        MotionDetector {
            width,
            height,
            resolution_x,
            resolution_y,
            sensitivity,
            threshold,
            previous_frame: None,
            diff_buffer: vec![0; pixel_count * 4], // RGBA buffer
        }
    }

    pub fn process_frame(&mut self, current_frame: &[u8]) -> Vec<f64> {
        // Clone current frame for next iteration
        let current_frame_vec = current_frame.to_vec();
        
        // If this is the first frame, just store it and return empty matrix
        if self.previous_frame.is_none() {
            self.previous_frame = Some(current_frame_vec);
            return self.create_empty_matrix();
        }
        
        // Clone previous frame to avoid borrowing issues
        let previous_frame = self.previous_frame.clone().unwrap();
        
        // Create diff buffer
        self.create_diff_buffer(current_frame, &previous_frame);
        
        // Generate motion matrix
        let matrix = self.create_motion_matrix();
        
        // Store current frame for next iteration
        self.previous_frame = Some(current_frame_vec);
        
        matrix
    }

    fn create_diff_buffer(&mut self, current: &[u8], previous: &[u8]) {
        let actual_sensitivity = 1.0 - self.sensitivity;
        
        for y in 0..self.height {
            for x in 0..self.width {
                let i = (y * self.width + x) as usize;
                let pixel_idx = i * 4;
                
                if pixel_idx + 3 >= current.len() || pixel_idx + 3 >= previous.len() {
                    continue;
                }
                
                // Calculate averages for current and previous frames
                let avg1 = rgb_average(current[pixel_idx], current[pixel_idx + 1], current[pixel_idx + 2]);
                let avg2 = rgb_average(previous[pixel_idx], previous[pixel_idx + 1], previous[pixel_idx + 2]);
                
                // Apply sensitivity
                let adj_avg1 = (avg1 as f64 / actual_sensitivity) as u8;
                let adj_avg2 = (avg2 as f64 / actual_sensitivity) as u8;
                
                // Calculate difference and polarize
                let delta = abs(adj_avg1 as i32 - adj_avg2 as i32) as u8;
                let polarized = polarize(delta, self.threshold);
                
                // Set RGBA values in diff buffer
                self.diff_buffer[pixel_idx] = polarized;     // R
                self.diff_buffer[pixel_idx + 1] = polarized; // G
                self.diff_buffer[pixel_idx + 2] = polarized; // B
                self.diff_buffer[pixel_idx + 3] = 255;       // A
            }
        }
    }

    fn create_motion_matrix(&self) -> Vec<f64> {
        let cell_width = self.width as f64 / self.resolution_x as f64;
        let cell_height = self.height as f64 / self.resolution_y as f64;
        
        let mut matrix = Vec::with_capacity((self.resolution_x * self.resolution_y) as usize);
        
        for j in 0..self.resolution_y {
            for i in 0..self.resolution_x {
                let start_x = (i as f64 * cell_width) as u32;
                let start_y = (j as f64 * cell_height) as u32;
                let end_x = ((i + 1) as f64 * cell_width) as u32;
                let end_y = ((j + 1) as f64 * cell_height) as u32;
                
                let cell_average = self.calculate_cell_average(start_x, start_y, end_x, end_y);
                matrix.push(cell_average);
            }
        }
        
        matrix
    }

    fn calculate_cell_average(&self, start_x: u32, start_y: u32, end_x: u32, end_y: u32) -> f64 {
        let mut total = 0u32;
        let mut count = 0u32;
        
        for y in start_y..end_y.min(self.height) {
            for x in start_x..end_x.min(self.width) {
                let pixel_idx = ((y * self.width + x) * 4) as usize;
                if pixel_idx < self.diff_buffer.len() {
                    // Use red channel value (all RGB channels are the same in diff buffer)
                    total += self.diff_buffer[pixel_idx] as u32;
                    count += 1;
                }
            }
        }
        
        if count > 0 {
            total as f64 / count as f64
        } else {
            0.0
        }
    }

    fn create_empty_matrix(&self) -> Vec<f64> {
        vec![0.0; (self.resolution_x * self.resolution_y) as usize]
    }

    pub fn get_diff_buffer(&self) -> Vec<u8> {
        self.diff_buffer.clone()
    }
}