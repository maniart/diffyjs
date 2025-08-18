use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn error(msg: &str);
}

pub fn set_panic_hook() {
    // Simple panic hook setup without external dependencies
}

// Bitwise round function (equivalent to JavaScript version)
#[inline]
pub fn round(number: f64) -> i32 {
    (number + 0.5) as i32
}

// Bitwise absolute value function
#[inline]
pub fn abs(value: i32) -> i32 {
    let mask = value >> 31;
    (value + mask) ^ mask
}

// Polarize pixel values based on value and threshold
#[inline]
pub fn polarize(value: u8, threshold: u8) -> u8 {
    if value > threshold { 0x00 } else { 0xFF }
}

// Calculate average of RGB values
#[inline]
pub fn rgb_average(r: u8, g: u8, b: u8) -> u8 {
    ((r as u32 + g as u32 + b as u32) / 3) as u8
}