class ObjectsList {
    hitCirclesList;
    slidersList;
    objectsList;
    drawTime;
    coloursList;
    currentColor;
    coloursObject;

    compare(a, b) {
        if (a.time < b.time) {
            return -1;
        }
        if (a.time > b.time) {
            return 1;
        }
        return 0;
    }

    constructor(hitCirclesList, slidersList, coloursList) {
        this.hitCirclesList = hitCirclesList;
        this.slidersList = slidersList;
        this.objectsList = hitCirclesList.concat(slidersList).sort(this.compare);
        this.currentColor = 1 % coloursList.length;
        this.comboIdx = 1;

        if (coloursList.length !== 0) {
            hitCircleArr = [];
            coloursList.forEach((colour, idx) => {
                document.querySelector("#hitCircleColor").style.backgroundColor = colour;
                const base64_hitCircle = window.btoa(new XMLSerializer().serializeToString(sampleHitCircle));
                const hitCircleImgData = `data:image/svg+xml;base64,${base64_hitCircle}`;
                const hitCircleImg = new Image();
                hitCircleImg.src = hitCircleImgData;

                document.querySelector("#approachCircleColor").style.backgroundColor = colour;
                const base64_approachCircle = window.btoa(new XMLSerializer().serializeToString(sampleApproachCircle));
                const approachCircleImgData = `data:image/svg+xml;base64,${base64_approachCircle}`;
                const approachCircleImg = new Image();
                approachCircleImg.src = approachCircleImgData;

                hitCircleArr[idx] = hitCircleImg;
                approachCircleArr[idx] = approachCircleImg;
            });
        }

        this.objectsList = this.objectsList.map((object, idx) => {
            if (object.obj.isNewCombo && idx !== 0) {
                this.currentColor = (this.currentColor + 1) % coloursList.length;
                this.comboIdx = 1;
            }
            return {
                ...object,
                comboIdx: this.comboIdx++ % 10,
                colour: coloursList[this.currentColor],
                colourIdx: this.currentColor,
            };
        });
    }

    draw(timestamp, staticDraw) {
        // console.log(timestamp);
        updateTime(timestamp);

        if (parseInt(getComputedStyle(document.querySelector("#playerContainer")).width) !== canvas.width)
            canvas.width = parseInt(getComputedStyle(document.querySelector("#playerContainer")).width);

        if (parseInt(getComputedStyle(document.querySelector("#playerContainer")).height) !== canvas.height)
            canvas.height = parseInt(getComputedStyle(document.querySelector("#playerContainer")).height);

        const currentScaleFactor = Math.min(
            parseInt(getComputedStyle(document.querySelector("#playerContainer")).height) / 480,
            parseInt(getComputedStyle(document.querySelector("#playerContainer")).width) / 640
        );

        let currentAR = !mods.EZ ? approachRate : approachRate / 2;
        currentAR = !mods.HR ? currentAR : Math.min((currentAR * 4) / 3, 10);
        const currentPreempt = currentAR < 5 ? 1200 + (600 * (5 - currentAR)) / 5 : currentAR > 5 ? 1200 - (750 * (currentAR - 5)) / 5 : 1200;
        const currentFadeIn = currentAR < 5 ? 800 + (400 * (5 - currentAR)) / 5 : currentAR > 5 ? 800 - (500 * (currentAR - 5)) / 5 : 800;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.objectsList
            .filter((object) => object.time - currentPreempt < timestamp && object.obj.endTime > timestamp)
            .reverse()
            .forEach((object) => {
                const objStartTime = object.time - currentPreempt;
                if (timestamp >= objStartTime) {
                    const opacity =
                        timestamp < object.time ? (timestamp - objStartTime) / currentFadeIn : (timestamp - (object.obj.endTime - 240)) / 240 - 1;

                    // console.log(object.time, timestamp, timestamp < object.time);

                    object.obj.draw(
                        opacity,
                        (timestamp - object.time) / (object.obj.endTime - 240 - object.time),
                        1 - (timestamp - object.time) / 240,
                        (timestamp - objStartTime) / currentPreempt,
                        object.colour,
                        object.colourIdx,
                        object.comboIdx,
                        currentScaleFactor
                    );
                }
            });

        if (isPlaying && playingFlag && !staticDraw)
            window.requestAnimationFrame((currentTime) => {
                if (!document.querySelector("audio")) return;
                const currentAudioTime = document.querySelector("audio").currentTime * 1000;
                // const currentAudioTime = currentTime - this.drawTime;
                const timestampNext = currentAudioTime * playbackRate;
                return this.draw(timestampNext);
            });
    }

    render() {
        this.drawTime = new Date().getTime() - originalTime;
        window.requestAnimationFrame((currentTime) => {
            const currentAudioTime = document.querySelector("audio").currentTime * 1000;
            // const currentAudioTime = currentTime - this.drawTime;
            const timestamp = currentAudioTime * playbackRate;
            return this.draw(timestamp);
        });
    }
}
