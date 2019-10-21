// requires Animator
class Player {
    x = 100; // middle of player (right pixel)
    y = 200;  // bottom of player
    vx = 0;
    vy = 0;
    w = 32;
    hw = 32/2; //half width
    h = 64;
    ax = .6;
    jv = -18;
    mvx = 50;
    mvy = 20;
    jumps = 1;
    step_h = 16;
    midair = true;
    frameStep = 0;
    states = { FREE:0, CROUCHING:1, LANDING:2 };
    state = 0;
    animationTimer = 0;
    animator = new Animator();
    constructor() { }


    draw(ctx) {
        let ptop = this.y - this.h+1;
        let pleft = this.x - this.hw
        let x = Math.floor(pleft);
        let y = Math.floor(ptop);
        ctx.fillStyle = 'red';
        // ctx.fillRect(x, y, this.w, this.h, this.color);
        
        let frame;
        if (this.state == this.states.CROUCHING) {
            frame = playerframes["jumpcrouch"][this.frameStep]
        }
        else if (this.state == this.states.LANDING) {
            frame = playerframes["land"][this.frameStep]
        }
        else if (this.midair) {
            if      (this.vy < -13.5)  this.frameStep = 0;
            else if (this.vy < -11.25) this.frameStep = 1;
            else if (this.vy < -9)     this.frameStep = 2;
            else if (this.vy < -6.75)  this.frameStep = 3;
            else if (this.vy < -4.5)   this.frameStep = 4;
            else if (this.vy < -2.25)  this.frameStep = 5;
            else                       this.frameStep = 6;
            frame = playerframes["midair"][this.frameStep];
        }
        else {
            frame = playerframes["stand"][0];
        }
        if (frame == undefined) console.log(this.state)
    
        let top = this.y - (frame.py - frame.y);
        let left = this.x - (frame.px - frame.x);
        ctx.drawImage(psprites, frame.x, frame.y, frame.w, frame.h, left, top, frame.w, frame.h);
    }

    update(cMap, keys, lastKeys) {
        if (this.state == this.states.CROUCHING) {
            this.frameStep = Math.floor(this.animationTimer / 4);
            this.animationTimer++;
            if (this.animationTimer >= 8) {
                this.animationTimer = 0;
                this.state = this.states.FREE; //this might trigger the next if...
                this.vy = -18;
            }
        } else if (this.state == this.states.LANDING) {
            this.frameStep = Math.floor(this.animationTimer / 7);
            this.animationTimer++;
            if (this.animationTimer >= 14) {
                this.animationTimer = 0;
                this.state = this.states.FREE;
            }
        }
        if (this.state == this.states.FREE || this.state == this.states.LANDING) { //controls
            if (keys[37] || keys[65]) { //left
                this.vx -= this.ax;
                if (this.vx < -this.maxv)
                    this.vx = -this.maxv;
            }
            if (keys[39] || keys[68]) { //right
                this.vx += this.ax;
                if (this.vx > this.maxv)
                    this.vx = this.maxv;
            }
            if (this.jumps && (keys[38] || keys[87]) && (!lastKeys[38] && !lastKeys[87])) { //up
                this.state = this.states.CROUCHING; //maybe need to timeout this?
                this.frameStep = 0;
            }
        }
        let ovy = this.vy;
        this.vy += GRAVITY;
        let vy = Math.round(this.vy);

        //TODO: x-to-y ratio-driven slanted movement instead of L-shaped movement
        if (vy > 0) { //moving down
            for (let i = 0; i < vy; i++) {
                let x_cls = cMap.getCollisionDown(this.y, this.x, this.hw);
                if (x_cls == null) {
                    this.y++;
                    this.midair = true;
                } else { //landed on something
                    this.vy = 0;
                    this.midair = false;
                    if (ovy > 5) { //actually landed
                        this.state = this.states.LANDING;
                        this.frameStep = 0;
                    }
                }
            }
        } else if (vy < 0) { //moving up
            this.midair = true;
            for (let i = 0; i > vy; i--) {
                let top = this.y-this.h+1;
                let x_cls = cMap.getCollisionUp(top, this.x, this.hw);
                if (x_cls == null) {
                    this.y--;
                } else { //hit your head
                    this.vy = 0;
                }
            }
        }
        
        let vx = Math.round(this.vx);
        if (vx > 0) { //moving right
            for (let i = 0; i < vx; i++) {
                let right = this.x+this.hw-1;
                let y_cls = cMap.getCollisionRight(right, this.y, this.h);
                if (y_cls == null) {
                    this.x++;
                } else { //hit wall
                    this.vx = 0;
                    let step_h = this.y-y_cls;
                    if (step_h < this.step_h) {
                        this.y = y_cls-1;
                        this.x++;
                        //not implemented: climbing more than 1 step
                    }
                }
            }
        } else if (vx < 0) { //moving left
            for (let i = 0; i > vx; i--) {
                let y_cls = cMap.getCollisionLeft(this.x-this.hw, this.y, this.h);
                if (y_cls == null) {
                    this.x--;
                } else { //hit wall
                    this.vx = 0;
                    let step_h = this.y-y_cls;
                    if (step_h < this.step_h) {
                        this.y = y_cls-1;
                        this.x--;
                        //not implemented: climbing more than 1 step
                    }
                }
            }
        }

        this.vx *= FRICTION;
        if (Math.abs(this.vx) - .01 < 0) {
            this.vx = 0;
        }
    }
}