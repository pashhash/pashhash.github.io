import { COLOURS } from "./colours";

// characters used in Matrix font, will be converted to katakana
const CHARSET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
const CHAR_HEIGHT = window.innerWidth < 768 ? 16 : 24;
const CHAR_WIDTH = 0.75 * CHAR_HEIGHT;
const DELAY = 50;
const GLITCH_RATE = 0.1;
const ERROR_RATE = 0.05;
const ERROR_GLITCH_RATE = 0.6;
const MESSAGE_RATE = 0.02;
const FADE = 0.9;
const GOLD = 0.5;
const OPACITY = 0.4;
const ERROR_OPACITY = 0.8;
const GOLD_OPACITY = 1;
const MESSAGES = [
    "HELLOWORLD",
    "NEALWANG",
    "THEMATRIX",
    "3.1415926535",
    "6.2831853071",
    "2.7182818284"
];

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.font = `${CHAR_HEIGHT * 1.25}px Matrix Code NFI`;

let SPAWN_RATE = canvas.width / 1920;

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    SPAWN_RATE = canvas.width / 2500;
};

let frame = 0;

let mouse = { x: -1000, y: -1000, acc: 0 };

document.onmousemove = e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.acc += e.movementX * e.movementX + e.movementY * e.movementY;
};

class Stream {
    private chars: string[] = [];
    private length: number;
    private speed: number;
    private x: number;
    private error: boolean;
    private message: string | undefined;

    public constructor(x: number, message?: string) {
        this.length = Math.floor(Math.random() * 40) + 4;
        this.speed = Math.floor(Math.random() * 2) + 1;
        this.x = x;

        this.error = Math.random() < ERROR_RATE;

        this.message = message;
    }

    public update() {
        if (frame % this.speed === 0) {
            if (!this.message) {
                this.chars.push(
                    CHARSET[Math.floor(Math.random() * CHARSET.length)]
                );
            } else {
                // custom message
                this.chars.push(
                    this.message[(frame / this.speed) % this.message.length]
                );
            }

            if (this.chars.length >= this.length) {
                this.chars[this.chars.length - this.length] = " ";
            }
        }

        if (this.chars.length - this.length > canvas.height / CHAR_HEIGHT)
            return true;

        for (let i = 0; i < this.chars.length; i++) {
            // "glitching" characters
            if (
                Math.random() <
                    (this.error ? ERROR_GLITCH_RATE : GLITCH_RATE) &&
                this.chars[i] !== " " &&
                !this.message
            ) {
                this.chars[i] =
                    CHARSET[Math.floor(Math.random() * CHARSET.length)];
            }

            let x = this.x + CHAR_WIDTH / 2;
            let y = i * CHAR_HEIGHT - CHAR_HEIGHT / 2;

            // don't render tail of stream
            if (this.chars[i] === " ") continue;

            // circle around mouse for golden code
            const isGold =
                (x - mouse.x) * (x - mouse.x) + (y - mouse.y) * (y - mouse.y) <
                    mouse.acc * GOLD || this.message;
            const isLast = i === this.chars.length - 1;

            ctx.fillStyle = isGold
                ? isLast
                    ? COLOURS.text.hex
                    : COLOURS.peach.hex
                : this.error
                  ? isLast
                      ? COLOURS.red.hex
                      : COLOURS.maroon.hex
                  : isLast
                    ? COLOURS.text.hex
                    : COLOURS.green.hex;
            ctx.globalAlpha =
                (isGold ? GOLD_OPACITY : this.error ? ERROR_OPACITY : OPACITY) *
                // fade out characters at end of stream
                ((i - (this.chars.length - this.length)) / this.length);
            ctx.fillText(this.chars[i], this.x, i * CHAR_HEIGHT);
        }

        return false;
    }
}

const streams: Stream[] = [];

let lastTick = Date.now();

const tick = () => {
    requestAnimationFrame(tick);

    if (Date.now() > lastTick + DELAY) {
        mouse.acc *= FADE;

        if (Math.random() < SPAWN_RATE) {
            const message =
                Math.random() < MESSAGE_RATE
                    ? MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
                    : undefined;

            streams.push(
                new Stream(
                    Math.floor((Math.random() * canvas.width) / CHAR_WIDTH) *
                        CHAR_WIDTH,
                    message
                )
            );
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < streams.length; i++) {
            if (streams[i].update()) {
                streams.splice(i, 1);
                i--;
            }
        }

        frame++;

        lastTick = Date.now();
    }
};

setTimeout(() => {
    requestAnimationFrame(tick);
}, 1500);
