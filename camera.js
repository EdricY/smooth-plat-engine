class Camera {
    xAnchor = 0;
    yAnchor = 0;
    x = this.xAnchor;
    y = this.yAnchor;

    xShakeFactor = 0;
    yShakeFactor = 0;
    xShakeSeed = 0;
    yShakeSeed = 0;
    shake(amplitude) {
        let z1 = (Math.random() - Math.random()) * amplitude / 5;
        let z2 = (Math.random() - Math.random()) * amplitude / 5;
        this.xShakeFactor = amplitude + z1;
        this.yShakeFactor = amplitude + z2;
        this.xShakeSeed = Math.random() * TAU;
        this.yShakeSeed = Math.random() * TAU;
    }

    update() {
        if (this.xShakeFactor > 0)  {
            let now = Date.now();
            this.x = this.xAnchor + this.xShakeFactor * Math.sin(this.xShakeSeed-now);
            this.y = this.yAnchor + this.yShakeFactor * Math.cos(this.yShakeSeed-now);
            this.xShakeFactor *= .9;
            this.yShakeFactor *= .9;

            if (this.xShakeFactor < .5) {
                this.xShakeFactor = 0;
                this.yShakeFactor = 0;
            }
        }
    }

    moveCtx(ctx) {
        // TODO: this is backwards
        if (this.xShakeFactor > 0) ctx.translate(this.x, this.y);
        else ctx.translate(this.xAnchor, this.yAnchor);
    }
}
