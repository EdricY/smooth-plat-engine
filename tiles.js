class TileManager {
    tileDict = {}; // color -> idx
    tileImgs = []; // idx  -> img
    tileCollImgs = []; // idx  -> collImg

    /* tileDictImg - image of pixels corresponding to tileImgs or the dictionary itself
     * tileImgs - list of drawable objects representing tiles or spritesheet
     */
    constructor(tileDictImg, tileImgs, tw=32, th=32, tileCollImgs) {
        if (tileImgs instanceof Image) tileImgs = spriteSheetImg2ImgArray(tileImgs, tw, th);
        this.tileImgs = tileImgs;
        if (tileCollImgs != null) {
            if (tileCollImgs instanceof Image) tileCollImgs = spriteSheetImg2ImgArray(tileCollImgs, tw, th);
            this.tileCollImgs = tileCollImgs;
        }
        let idxarr = tileImgs.map((img, idx) => idx);
        if (tileDictImg instanceof Image) tileDictImg = img2ColorDict(tileDictImg, idxarr);
        this.tileDict = tileDictImg;
        this.tw = tw;
        this.th = th;
    }

    /* Registers any additional tiles to a certain color. Should be mostly unused.
     * Note that issues can arise because of color mismatch in some browsers.
     */
    registerTile(color, tileImg) {
        let idx = this.tileImgs.length;
        this.tileImgs.push(tileImg);
        this.tileDict[color] = idx;
        return idx;
    }

    getTileImg(color) {
        return this.tileImgs[this.tileDict[color]];
    }

    getTileIdx(color) {
        return this.tileDict[color];
    }


    /* Creats a large image of a tile map given a small image of pixels. 
     * pixelImg - the image or ImageData with pixels corresponding to one tile each.
     * tileCallback : function(tileIdx, x, y) - called on each tile--useful for adding objects
     */
    createMap(pixelImg, tileCallback) {
        let matrix;
        if (pixelImg instanceof Image) matrix = img2Matrix(pixelImg, this.tileDict);
        else matrix = imageData2Matrix(pixelImg, this.tileDict);
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = matrix[0].length * this.tw;
        canvas.height = matrix.length * this.th;
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                let tileIdx = matrix[r][c];
                let tileImg = this.tileImgs[tileIdx];
                if (tileImg === undefined) tileImg = null;
                let x = this.tw * c; 
                let y = this.th * r;
                if (tileImg != null) ctx.drawImage(tileImg, x, y);
                if (tileCallback != null) tileCallback(tileIdx, x, y);
            }
        }
        return canvas;
    }

    /* Creats a collision map given a small image of pixels. Requires CollisionMap
     * pixelImg - the image or ImageData with pixels corresponding to one tile each.
     * tileCallback : function(tileIdx, x, y) - called on each tile--useful for adding objects
     */
    createCollisionMap(pixelImg) {
        let matrix;
        if (pixelImg instanceof Image) matrix = img2Matrix(pixelImg, this.tileDict);
        else matrix = imageData2Matrix(pixelImg, this.tileDict);
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = matrix[0].length * this.tw;
        canvas.height = matrix.length * this.th;
        for (let r = 0; r < matrix.length; r++) {
            for (let c = 0; c < matrix[r].length; c++) {
                let tileIdx = matrix[r][c];
                let tileCollImg = this.tileCollImgs[tileIdx];
                if (tileCollImg === undefined) tileCollImg = null;
                let x = this.tw * c; 
                let y = this.th * r;
                if (tileCollImg != null) ctx.drawImage(tileCollImg, x, y);
            }
        }
        return new CollisionMap(img2Matrix(canvas, PIXELDICT));
    }
}

//unused for now
function drawTileMap(ctx, tileDataMatrix) {
    // let isImageData = this.tileImgs[0] instanceof ImageData;
    for (let r = 0; r < tileDataMatrix.length; r++) {
        for (let c = 0; c < tileDataMatrix[0].length; c++) {
            let tidx = tileDataMatrix[r][c];
            if (tidx != null) {
                // if (isImageData) ctx.putImageData(this.tileImgs[tidx], c*this.tw, r*this.th);
                // ctx.drawImage(this.tileImgs[tidx], c*32, r*32);
            }
        }
    }
}