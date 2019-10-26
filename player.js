// requires animator.js
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
    animator = new Animator();
    facingRight = false;
    constructor() {
        this.initAnimator();
        this.animator.switchState("midair");
    }

    animCheck(stateName) {
        return this.animator.inState(stateName);
    } 

    draw(ctx) {
        let ptop = this.y - this.h+1;
        let pleft = this.x - this.hw
        let x = Math.floor(pleft);
        let y = Math.floor(ptop);
        ctx.fillStyle = 'red';
        ctx.fillRect(x, y, this.w, this.h);
        
        let frame = this.animator.getFramePositionData(this);
        let top = this.y - (frame.py - frame.y);
        let left = this.x - (frame.px - frame.x);
        if (this.facingRight) {
            let right = this.x + (frame.px - frame.x);
            ctx.scale(-1, 1);
            ctx.drawImage(psprites, frame.x, frame.y, frame.w, frame.h, -right, top, frame.w, frame.h);
            ctx.scale(-1, 1);
        } else {
            ctx.drawImage(psprites, frame.x, frame.y, frame.w, frame.h, left, top, frame.w, frame.h);
        }
        
    }

    update(cMap, keys, lastKeys, camera) {
        this.animator.update();
        if (true) { //controls (switch to "takingInput" condition)
            if (keys[37] || keys[65]) { //left
                this.vx -= this.ax;
                if (this.vx < -this.maxv) this.vx = -this.maxv;
                if (this.vx < 0) this.facingRight = false;
            }
            if (keys[39] || keys[68]) { //right
                this.vx += this.ax;
                if (this.vx > this.maxv) this.vx = this.maxv;
                if (this.vx > 0) this.facingRight = true;
            }
            if (this.jumps && (keys[38] || keys[87]) && (!lastKeys[38] && !lastKeys[87]) && !this.animCheck("jumpcrouch")) { //up
                this.jv = -18;
                this.animator.switchState("jumpcrouch", t => {
                    if (t > P_CROUCH_DUR) {
                        this.animator.switchState("midair");
                        this.vy = this.jv;
                    }
                });
            }
            if ((!keys[38] && !keys[87]) && (lastKeys[38] || lastKeys[87]) && this.animCheck("jumpcrouch")) { //short hop
                this.jv = -13;
            }
        }
        let omidair = this.midair;
        let ovy = this.vy;
        this.vy += GRAVITY;
        let vy = Math.round(this.vy);

        //TODO: x-to-y ratio-driven slanted movement instead of L-shaped movement
        if (vy > 0) { //moving down
            for (let i = 0; i < vy; i++) {
                let x_cls = cMap.getCollisionDown(this.y, this.x, this.hw);
                //TODO: fix clinging to right edge of screen
                if (x_cls == null) {
                    this.y++;
                    this.midair = true;
                } else { //landed on something
                    this.vy = 0;
                    this.midair = false;
                    if (ovy > 5) { //hard landing
                        camera.shake(8);
                        this.animator.switchState("land", t => {
                            if (t > P_LAND_DUR) {
                                this.animator.switchState("stand");
                            }
                        });
                    } else if (this.animCheck("midair")) {
                        this.animator.switchState("stand");
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

        if (!this.midair) {
            this.vx *= FRICTION;
            if (Math.abs(this.vx) - .01 < 0) {
                this.vx = 0;
            }
        }
            
        if (this.midair && this.animCheck("stand"))
        {
            this.animator.switchState("midair"); //need timeout? (custom timeout?)
        }
    }

    initAnimator() {
        let midairframes = [
            { x:340, y:433, w:50, h:59, px:356, py:486 },
            { x:393, y:430, w:46, h:62, px:411, py:486 },
            { x:7,   y:511, w:44, h:66, px:24 , py:572 },
            { x:59,  y:507, w:41, h:70, px:76 , py:572 },
            { x:106, y:506, w:36, h:71, px:125, py:572 },
            { x:154, y:507, w:36, h:70, px:172, py:572 },
            { x:197, y:507, w:37, h:70, px:213, py:572 },
        ]
        this.animator.register("midair",
            midairframes,
            t => {
                // if      (obj.vy > -2.25)  return 6;
                // else if (obj.vy > -4.5)   return 5;
                // else if (obj.vy > -6.75)  return 4;
                // else if (obj.vy > -9)     return 3;
                // else if (obj.vy > -11.25) return 2;
                // else if (obj.vy > -13.5)  return 1;
                // else                      return 0;
                return Math.floor(Math.min(6,Math.max(0, 7+this.vy/2.25)));
            }
        );

        let jumpcrouchframes = [
            { x:154, y:441, w:56, h:54, px:182, py:494 },
            { x:214, y:440, w:55, h:55, px:242, py:494 },
        ];
        this.animator.register("jumpcrouch",
            jumpcrouchframes,
            getTimeBasedFrameSelector(P_CROUCH_DUR, jumpcrouchframes.length)
        );

        let landingframes = [
            { x:241, y:507, w:47, h:87, px:270, py:590 },
            { x:291, y:551, w:58, h:43, px:332, py:581 },
        ];
        this.animator.register("land",
            landingframes,
            getTimeBasedFrameSelector(P_LAND_DUR, landingframes.length)
        );

        this.animator.register("stand", [
                // { x:312, y:671, w:34, h:36, px:326, py:703 },
                { x:3, y:23, w:40, h:43, px:25, py:62 },
                { x:48, y:16, w:39, h:50, px:68, py:62 },
                { x:96, y:8, w:37, h:58, px:113, py:62 },
                { x:48, y:16, w:39, h:50, px:68, py:62 },
            ],
            getLoopingFrameSelector(60, 4)
            // (() => 0) //always select frame 0
        );
    }
}