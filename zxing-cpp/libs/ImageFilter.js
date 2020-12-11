const zeros = require('zeros');
const savePixels = require("save-pixels");
const ndarrayFromCanvas = require('ndarray-from-canvas');

/**
 * Calculate local mean
 * pixels is the bitmap from canvas
 * pixels = context.getImageData(0, 0, img.width, img.height)
 */
function localMean(pixels, size) {
    // pixels is expected to be grayscaled
    let [width, height] = pixels.shape
    // I like Shakutori method!
    let rowSumsCol = new Array(height)
    for (let y = 0; y < height; y++) {
        let rowSums = new Array(width).fill(0)
        for (let x = 0; x < size; x++) {
            rowSums[0] += pixels.get(x, y)
        }
        for (let xEnd = size; xEnd < width; xEnd++) {
            let xStart = xEnd - size + 1
            rowSums[xStart] = rowSums[xStart - 1] + pixels.get(xEnd, y) - pixels.get(xStart - 1, y)
        }
        rowSumsCol[y] = rowSums
    }

    let mWidth = width - size + 1
    let mHeight = height - size + 1
    let mean = zeros([mWidth, mHeight])
    for (let x = 0; x < mWidth; x++) {
        // Set x, 0
        for (let y = 0; y < size; y++) {
            let prev = mean.get(x, 0)
            mean.set(x, 0, prev + rowSumsCol[y][x])
        }
    }
    for (let x = 0; x < mWidth; x++) {
        for (let y = 1; y < mHeight; y++) {
            mean.set(x, y, mean.get(x, y - 1) - rowSumsCol[y - 1][x] + rowSumsCol[y + size - 1][x])
        }
    }

    // Devide
    for (let x = 0; x < mWidth; x++) {
        for (let y = 0; y < mHeight; y++) {
            mean.set(x, y, mean.get(x, y) / (size * size))
        }
    }
    return mean
}

/**
 * Grayscale
 * imageData is the bitmap from canvas
 * return nddata as the xxy bitmap (pixels)
 */
function grayScaleCanvas(canvas_ele) {
    let width = canvas_ele.width;
    let height = canvas_ele.height;
    let context = canvas_ele.getContext('2d');
    let imageData = context.getImageData(0, 0, width, height).data;
    let res = zeros([width, height])

    let px_idx=0;
    let x = 0;
    let y = 0;
    for (let p = 0; p < width * height * 4; p += 4) {
        const r = imageData[p];
        const g = imageData[p + 1];
        const b = imageData[p + 2];
        px_idx++;
        x=px_idx%width;
        y= (px_idx-x)/width;
        const gray_px = Math.floor(0.3 * r + 0.59 * g + 0.11 * b);
        res.set(x, y, gray_px)
    }
    return res
}

/**
 * Grayscale
 * grayscaled is the bitmap from grayScaleCanvas
 * 
 */

function adaptiveThreshold(grayscaled, options = {}) {
    let {
        size = 7,/* kernel size */
        compensation = 7, /* the avg_mean will be subtract   */
    } = options
    let midSize = Math.floor(size / 2)
    let [width, height] = grayscaled.shape
    let res = zeros([width, height])


    let meanMatrix = localMean(grayscaled, size)
    let [mWidth, mHeight] = meanMatrix.shape

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let pixel = grayscaled.get(x, y)

            let mX = x - midSize
            let mY = y - midSize
            if (x - midSize < 0) {
                mX = 0
            } else if (x - midSize >= mWidth) {
                mX = mWidth - 1
            } else if (y - midSize < 0) {
                mY = 0
            } else if (y - midSize > mHeight) {
                mY = mHeight - 1
            }
            let mean = meanMatrix.get(mX, mY)

            let threshold = mean - compensation
            if (pixel < threshold) {
                res.set(x, y, 0)
            } else {
                res.set(x, y, 255)
            }
        }
    }
    return res
}
function pixel2Canvas(pixels) {
    return savePixels(pixels, 'canvas');
}

module.exports = {
    grayScaleCanvas,
    localMean,
    adaptiveThreshold,
    pixel2Canvas
}