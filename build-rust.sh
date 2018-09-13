#!/bin/sh

#TODO should we check for `carg` and `wasm-bindgen` being in the path prior to initializing this script?

# `set -e`: exit the script as soon as something fails
# `set -x`: print each line of executed script to stdout
set -ex

# create `wasm-target` & `dist` directories if they do not already exist
mkdir -p wasm-target
mkdir -p dist

# Build the wasm file using Cargo/rustc
cargo +nightly build --target wasm32-unknown-unknown --target-dir ./wasm-target

# Run the `wasm-bindgen` CLI tool to postprocess the wasm file emitted by the
# Rust compiler to emit the JS support glue that's necessary
wasm-bindgen ./wasm-target/wasm32-unknown-unknown/debug/differ.wasm --out-dir ./dist

#tmp
cp ./dist/differ* ./src 

# Finally, package everything up using Webpack and start a server so we can
# browse the result
# npm install
# npm run serve
