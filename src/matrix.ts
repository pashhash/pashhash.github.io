const CHARSET =
	"ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890";
const CHAR_HEIGHT = 24;
const CHAR_WIDTH = 18;
const DELAY = 50;
const GLITCH_RATE = 0.2;

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let SPAWN_RATE = 0.6 / (1920 / canvas.width);

window.onresize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	SPAWN_RATE = 0.5 / (1920 / canvas.width);
};

let frame = 0;

class Stream {
	private chars: string[] = [];
	private length: number;
	private speed: number;
	private x: number;
	private glitches: number[] = [];

	public constructor(x: number) {
		this.length = Math.floor(Math.random() * 40) + 4;
		this.speed = Math.floor(Math.random() * 2) + 1;
		this.x = x;

		for (let i = 0; i < canvas.height / CHAR_HEIGHT; i++)
			if (Math.random() < GLITCH_RATE) this.glitches.push(i);
	}

	public update() {
		if (frame % this.speed === 0) {
			this.chars.push(CHARSET[Math.floor(Math.random() * CHARSET.length)]);
			if (this.chars.length >= this.length)
				this.chars[this.chars.length - this.length] = " ";
		}

		if (this.chars.length - this.length > canvas.height / CHAR_HEIGHT)
			return true;

		ctx.font = `${CHAR_HEIGHT}px Rubik`;

		for (let i = 0; i < this.chars.length; i++) {
			if (this.glitches.includes(i) && this.chars[i] !== " ")
				this.chars[i] = CHARSET[Math.floor(Math.random() * CHARSET.length)];

			ctx.fillStyle = i === this.chars.length - 1 ? "#6c7086" : "#313244";
			ctx.fillText(this.chars[i], this.x, i * CHAR_HEIGHT);
		}
	}
}

const streams: Stream[] = [];

let lastTick = Date.now();

const tick = () => {
	requestAnimationFrame(tick);

	if (Date.now() > lastTick + DELAY) {
		if (Math.random() < SPAWN_RATE)
			streams.push(
				new Stream(
					Math.floor((Math.random() * canvas.width) / CHAR_WIDTH) * CHAR_WIDTH
				)
			);

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

requestAnimationFrame(tick);
