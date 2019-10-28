
//TODO: remove usage of ImageData from everywhere but this file.

/* Creates a dictionary that maps colorstr to value
 * imageData - imageData with pixels of colors to map onto values
 * values - array of values to map pixel colors to
 */
function imageData2ColorDict(imageData, values) {
    let dict = {};
    let i = 0;
    let data = imageData.data;
    for (let row = 0; row < imageData.height; row++) {
        for (let col = 0; col < imageData.width; col++) {
            let pos = 4 * (col + row*imageData.width);
            // let colorstr = imageData.slice(pos, pos+4).toString()
            let r = data[pos];
            let g = data[pos+1];
            let b = data[pos+2];
            let a = data[pos+3];
            let colorstr = `${r},${g},${b},${a}`;
            dict[colorstr] = values[i++];
            if (i >= values.length) return dict;
        }
    }
    return dict;
}

function img2ColorDict(img, values) {
    return imageData2ColorDict(img2ImageData(img), values);
}

/* Creates a matrix of values corresponding to pixels in imageData 
 *   using the mapping defined in pixelDict
 * imageData - imageData with pixels of colors inside pixelDict
 * pixelDict - mapping of pixel colors to matrix values
 */
function imageData2Matrix(imageData, pixelDict) {
    let matrix = [];
    let data = imageData.data;
    for (let row = 0; row < imageData.height; row++) {
        matrix.push([]);
        for (let col = 0; col < imageData.width; col++) {
            let pos = 4 * (col + row*imageData.width);
            // let colorstr = imageData.slice(pos, pos+4).toString()
            let r = data[pos];
            let g = data[pos+1];
            let b = data[pos+2];
            let a = data[pos+3];
            let colorstr = `${r},${g},${b},${a}`;
            let val = pixelDict[colorstr];
            if (val == undefined) val = null;
            matrix.push(val);
        }
    }
    return matrix;
}

function img2Matrix(img, pixelDict) {
    return imageData2Matrix(img2ImageData(img), pixelDict);
}

function spriteSheetImg2ImgArray(img, spw=32, sph=32) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = spw;
    canvas.height = sph;
    let imgs = [];
    for (let y=0; y < img.height; y+=sph) {
        for (let x=0; x < img.width; x+=spw) {
            ctx.drawImage(img, x, y, spw, sph, 0, 0, spw, sph);
            imgs.push(canvas2Img(canvas));
        }
    }
    return imgs;
}

function img2ImageData(img) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function ctx2Img(ctx) {
    let img = document.createElement("img"); // new Image()
    img.src = ctx.canvas.toDataURL();
    return img;
}

function canvas2Img(canvas) {
    let img = document.createElement("img"); // new Image()
    img.src = canvas.toDataURL();
    return img;
}