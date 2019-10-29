const PIXELDICT = {
    '255,174,201,255': null,
    '255,255,255,255': 0, //only down collision
    '0,0,0,255': 1
}

class CollisionMap {
    constructor(collMatrix) {
        this.collMatrix = collMatrix;
    }

    getPixel(x, y) {
        return this.collMatrix[y][x];
    }

    // returns x pos of collision or null
    getCollisionDown(bottom, x, halfwidth) {
        let r = Math.round(bottom) + 1; //row below bottom
        if (r >= H) return x;           //screen bottom
        x = Math.round(x) - halfwidth;  //left
        for (let c = x; c < x + halfwidth*2; c++) {
            // if (this.collMatrix[r][c] !== null) {
            if (this.collMatrix[r][c] == 1) {
                return c;
            }
        }
        return null;
    }

    // returns x pos of collision or null
    getCollisionUp(top, x, halfwidth) {
        let r = Math.round(top) - 1;    //row above top
        if (r < 0) return x;            //screen top
        x = Math.round(x) - halfwidth;  //left
        for (let c = x; c < x + halfwidth*2; c++) {
            if (this.collMatrix[r][c] == 1) {
                return c;
            }
        }
        return null;
    }

    // returns y pos of collision or null
    getCollisionRight(right, y, height) {
        let c = Math.round(right) + 1;  //col after right
        if (c >= W) return y-height+1;  //screen right
        y = Math.round(y);              //bottom
        for (let r = y-height+1; r <= y; r++) { //scan downward to find highest collision
            if (this.collMatrix[r][c] == 1) {
                return r;
            }
        }
        return null;
    }

    // returns y pos of collision or null
    getCollisionLeft(left, y, height) {
        let c = Math.round(left) - 1;   //col before left
        if (c < 0) return y-height+1;   //screen left
        y = Math.round(y);              //bottom
        for (let r = y-height+1; r <= y; r++) { //scan downward
            if (this.collMatrix[r][c] == 1) {
                return r;
            }
        }
        return null;
    }
}