const savePixels = require("save-pixels");
const fs = require('fs');
const ndarray = require('ndarray');
const perlin = require('perlin-noise'); // Make sure to require the perlin-noise module

const interpolate = require('color-interpolate');

let colormap = interpolate(['black','black','purple']);
let colormap2 = interpolate(['black','black','green']);

// Generate Perlin noise
let noise = perlin.generatePerlinNoise(1000, 1000, { octaveCount: 8, amplitude: 0.5, persistence: 0.5 });
let noise2 = perlin.generatePerlinNoise(1000, 1000, { octaveCount: 8, amplitude: 0.5, persistence: 0.5 });

// Convert the noise array to a 3-channel ndarray
let data = new Uint8Array(1000 * 1000 * 3);
for (let i = 0; i < noise.length; i++) {
    let value = noise[i];
    let rgb = colormap(value);

    let value2 = noise2[i];
    let rgb2 = colormap2(value2);

    rgb = rgb.replace('rgb(', '');
    rgb = rgb.replace(')', '');
    rgb = rgb.split(',');

    rgb2 = rgb2.replace('rgb(', '');
    rgb2 = rgb2.replace(')', '');
    rgb2 = rgb2.split(',');

    rgb[0] = (parseInt(rgb[0]) + parseInt(rgb2[0])) / 2;
    rgb[1] = (parseInt(rgb[1]) + parseInt(rgb2[1])) / 2;
    rgb[2] = (parseInt(rgb[2]) + parseInt(rgb2[2])) / 2;

    let base = 10;

    data[i * 3] = base +(rgb[0]/6);     // Red channel
    data[i * 3 + 1] = base +(rgb[1]/6); // Green channel
    data[i * 3 + 2] = base +(rgb[2]/6); // Blue channel
}
let noiseNdarray = ndarray(data, [1000, 1000, 3]); // The shape is now [width, height, channels]

// Create a stream to write the PNG to a file
let pngStream = savePixels(noiseNdarray, "png");

// Set up the path and file name for your PNG
let pngFilePath = 'noise.png';

// Pipe the stream to a file
pngStream.pipe(fs.createWriteStream(pngFilePath));
