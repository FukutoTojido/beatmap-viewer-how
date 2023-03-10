class HitCircle {
    startTime;
    endTime;
    positionX;
    positionY;
    isNewCombo;
    isSliderHead;
    originalX;
    originalY;

    draw(opacity, trol, expandRate, preemptRate, colour, colourIdx, comboIdx, currentScaleFactor) {
        const normalizedExpandRate = opacity >= 0 ? 1 : 1 + (1 - expandRate) * 0.5;
        const approachRateExpandRate = opacity >= 0 ? -3 * Math.min(preemptRate, 1) + 4 : 0;
        const HRMultiplier = !mods.HR ? 1 : 4 / 3;
        const EZMultiplier = !mods.EZ ? 1 : 1 / 2;
        let currentHitCircleSize = 2 * (54.4 - 4.48 * circleSize * HRMultiplier * EZMultiplier);

        this.positionX =
            this.originalX * currentScaleFactor +
            (canvas.width - 512 * currentScaleFactor) / 2 -
            (currentHitCircleSize * currentScaleFactor * 276) / 256 / 2;
        this.positionY =
            this.originalY * currentScaleFactor +
            (canvas.height - 384 * currentScaleFactor) / 2 -
            (currentHitCircleSize * currentScaleFactor * 276) / 256 / 2;

        // console.log(this.positionX, this.positionY)

        const currentDrawSize = (currentHitCircleSize * currentScaleFactor * normalizedExpandRate * 276) / 256;
        const baseDrawSize = (currentHitCircleSize * currentScaleFactor * sampleApproachCircle.width.baseVal.value) / 256;

        ctx.beginPath();
        ctx.globalAlpha = opacity >= 0 ? opacity : expandRate >= 0 ? expandRate : 0;

        ctx.drawImage(
            approachCircleArr[colourIdx],
            this.positionX - (baseDrawSize * approachRateExpandRate - baseDrawSize) / 2,
            this.positionY - (baseDrawSize * approachRateExpandRate - baseDrawSize) / 2,
            baseDrawSize * approachRateExpandRate,
            baseDrawSize * approachRateExpandRate
        );

        if (mods.HR) {
            ctx.save();
            ctx.translate(0, this.positionY - (currentDrawSize - currentDrawSize / normalizedExpandRate) / 2 + currentDrawSize);
            ctx.scale(1, -1);
        }
        ctx.drawImage(
            hitCircleArr[colourIdx],
            this.positionX - (currentDrawSize - currentDrawSize / normalizedExpandRate) / 2,
            !mods.HR ? this.positionY - (currentDrawSize - currentDrawSize / normalizedExpandRate) / 2 : 0,
            currentDrawSize,
            currentDrawSize
        );
        if (mods.HR) {
            ctx.restore();
        }

        // ctx.beginPath();
        // ctx.fillStyle = "yellow";
        // ctx.strokeStyle = "yellow";
        // ctx.arc(
        //     this.positionX,
        //     this.positionY - (currentDrawSize - currentDrawSize / normalizedExpandRate) / 2 + currentDrawSize / 2,
        //     2,
        //     0,
        //     Math.PI * 2,
        //     0
        // );
        // ctx.stroke();
        // ctx.fill();
        // ctx.closePath();

        if (opacity < 0) {
            ctx.globalAlpha = Math.max((expandRate - 0.6) / 0.4, 0);
        }

        if (mods.HR) {
            ctx.save();
            ctx.translate(0, this.positionY + (currentHitCircleSize * currentScaleFactor * 276) / 256);
            ctx.scale(1, -1);
        }
        ctx.drawImage(
            defaultArr[comboIdx],
            this.positionX,
            !mods.HR ? this.positionY : 0,
            (currentHitCircleSize * currentScaleFactor * 276) / 256,
            (currentHitCircleSize * currentScaleFactor * 276) / 256
        );
        if (mods.HR) {
            ctx.restore();
        }

        ctx.globalAlpha = 1;
        ctx.closePath();
    }

    constructor(positionX, positionY, time, isSliderHead, isNewCombo) {
        this.originalX = positionX;
        this.originalY = positionY;

        this.startTime = time - preempt;
        this.endTime = time + 240;

        this.positionX = positionX * scaleFactor + (canvas.width - 512 * scaleFactor) / 2 - (hitCircleSize * scaleFactor * 276) / 256 / 2;
        this.positionY = positionY * scaleFactor + (canvas.height - 384 * scaleFactor) / 2 - (hitCircleSize * scaleFactor * 276) / 256 / 2;

        this.isNewCombo = isNewCombo;
    }
}
