mod utils;
mod motion_detector;
mod matrix;

use wasm_bindgen::prelude::*;

// Import the `console.log` function from the `web-sys` crate
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Define a macro to provide `println!(..)`-style syntax for `console.log` logging.
macro_rules! console_log {
    ( $( $t:tt )* ) => {
        log(&format!( $( $t )* ))
    }
}

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct DiffyWasm {
    detector: motion_detector::MotionDetector,
}

#[wasm_bindgen]
impl DiffyWasm {
    #[wasm_bindgen(constructor)]
    pub fn new(
        width: u32,
        height: u32,
        resolution_x: u32,
        resolution_y: u32,
        sensitivity: f64,
        threshold: u8,
    ) -> DiffyWasm {
        utils::set_panic_hook();
        
        DiffyWasm {
            detector: motion_detector::MotionDetector::new(
                width,
                height,
                resolution_x,
                resolution_y,
                sensitivity,
                threshold,
            ),
        }
    }

    #[wasm_bindgen]
    pub fn process_frame(&mut self, image_data: &[u8]) -> Vec<f64> {
        self.detector.process_frame(image_data)
    }

    #[wasm_bindgen]
    pub fn get_diff_buffer(&self) -> Vec<u8> {
        self.detector.get_diff_buffer()
    }

    #[wasm_bindgen]
    pub fn get_matrix_size(&self) -> Vec<u32> {
        vec![self.detector.resolution_x, self.detector.resolution_y]
    }

    #[wasm_bindgen]
    pub fn version(&self) -> String {
        "2.0.0".to_string()
    }
}