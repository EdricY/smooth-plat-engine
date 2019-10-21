class Animator {
    constructor() { }

    /* animData: [animDatum] indexed by stateKey
     * animDatum: {frames, frameSelector}
     * frames: [framePositionData] in animation order
     * framePositionData: {x, y, w, h, px, py} or custom setup
     * frameSelector: t => framesIndex
     */
    animData = [];
    
    /* stateDict: {stateName: stateKey}
     */
    stateDict = {};
    /* The current stateKey
    */
    state = -1;
    t = 0;
    onupdate = t => {};

    update() {
        this.t++;
        if (this.onupdate == null) return;
        this.onupdate(this.t)
    }

    getFramePositionData() {
        let animDatum = this.animData[this.state];
        let index = animDatum.frameSelector(this.t, this.obj);
        let framePositionData = animDatum.frames[index];
        return framePositionData;
    }

    register(stateName, frames, frameSelector) {
        let stateKey = Object.keys(this.stateDict).length;
        this.stateDict[stateName] = stateKey;
        this.animData[stateKey] = {frames, frameSelector};
    }

    inState(stateName) {
        return this.state === this.stateDict[stateName];
    }

    /*
     * newState - string (or int/enumvalue) - the state to switch to
     * onupdate - function(t) - function to call on update
     */
    switchState(newState, onupdate) {
        this.state = this.stateDict[newState];
        if (this.state == undefined) this.state = newState;
        this.onupdate = onupdate;
        this.t = 0;
    }
}

function getTimeBasedFrameSelector(duration, numFrames) {
    let perFrame = duration / numFrames;
    return (t => {
        if (t/perFrame >= numFrames) return numFrames-1;
        return Math.floor(t/perFrame);
    });
}
