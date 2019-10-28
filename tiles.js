class TileManager {
    tileDict = {}; // color -> idx
    tileImgs = []; // idx  -> img
    constructor(tileImgs, tw=32, th=32) {
        this.tw = tw;
        this.th = th;
    }

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

    registerTilesFromImg(imageData, tileImgs) {
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
                this.registerTile(colorstr, tileImgs[i++]);
                if (i >= tileImgs.length) return;
            }
        }
    }

    createTileMap(imageData) {
        let tileDataMatrix = [];
        let data = imageData.data;
        for (let row = 0; row < imageData.height; row++) {
            tileDataMatrix.push([])
            for (let col = 0; col < imageData.width; col++) {
                let pos = 4 * (col + row*imageData.width);
                // let colorstr = imageData.slice(pos, pos+4).toString()
                let r = data[pos];
                let g = data[pos+1];
                let b = data[pos+2];
                let a = data[pos+3];
                let colorstr = `${r},${g},${b},${a}`;
                let tidx = this.getTileIdx(colorstr);
                if (tidx == undefined) tidx = null;
                tileDataMatrix[row].push(tidx);
            }
        }
        return tileDataMatrix;
    }
}

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