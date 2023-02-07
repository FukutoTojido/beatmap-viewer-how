const originalTime = new Date().getTime();
const axios = window.axios;

function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            callback(reader.result);
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
}

const scaleFactor = Math.min(window.screen.availHeight / 480, window.screen.availWidth / 640);
const textureScaleFactor = Math.min(window.screen.availHeight / 768, window.screen.availWidth / 1024) ** 2;

let circleSize
let hitCircleSize;

const sliderBorderThickness = 8;
const sliderAccuracy = 0.005;
const sliderSnaking = true;
const sliderBorderColor = "#ffffff";

let approachRate;
let preempt;
let fadeIn;

let isPlaying = true;
const debugPosition = 13505;
const mapId = 1919312;
const playbackRate = 1;

let stackLeniency;
let stackOffset;
let stackThreshold;