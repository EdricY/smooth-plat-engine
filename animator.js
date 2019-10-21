class Animator {
    /* animData: [animDatum] indexed by stateKey
     * animDatum: {frames, frameSelector}
     * frames: [framePositionData] in animation order
     * framePositionData: {x, y, w, h, px, py} or custom setup
     * frameSelector: t => framesIndex
     */
    constructor(animData, stateDict) {
        this.animData = animData;
    }
    
    /* stateDict: {stateName: stateKey}
     */
    stateDict = {};

    /* The current stateKey
    */
    state = -1;
    t = 0;
    onupdate = t => {};

    update() {
        this.onupdate(t)
        t++;
    }

    getFramePositionData() {
        let animDatum = this.animData[this.state];
        let index = animDatum.frameSelector(this.t)
        let framePositionData = animDatum.frames[index];
        return framePositionData;
    }

    register(stateName, frames, {duration, frameSelector}) {
        let stateKey = Object.keys(states).length
        this.stateDict[stateName] = stateKey;
        if (disableTime == null) disableTime = 0;
        if (frameSelector == null) {
            let perFrame = duration/frames.length;
            frameSelector = t => {
                if (t/perFrame >= frames.length) return frames.length-1;
                return Math.floor(t/perFrame);
            }
        }
        this.animData[stateKey] = {frames, frameSelector};
    }
    /*
     * newState - int/enumvalue - the state to switch to
     * onupdate - function(t) - function to call on update
     */
    switchState(newState, onupdate) {
        this.state = newState;
        this.onupdate = onupdate;
        this.t = 0;
    }
}