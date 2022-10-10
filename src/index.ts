import { ArgonType, hash } from "argon2-browser";

const seed = document.querySelector("#seed") as HTMLInputElement;
const key = document.querySelector("#key") as HTMLInputElement;
const submit = document.querySelector("#submit") as HTMLButtonElement;
const output = document.querySelector("#output")!;

const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMERIC = "0123456789";
const SPECIAL = "!@#$%^&*";

submit.onclick = async () => {
	const hex = (
		await hash({
			pass: key.value,
			salt: seed.value,
			type: ArgonType.Argon2id,
			mem: 65536,
			time: 4,
			parallelism: 8,
			hashLen: 46
		})
	).hash;

	let res = "";
	const characters = LOWERCASE + UPPERCASE + NUMERIC + SPECIAL;

	for (let i = 0; i < 16; i++) res += characters[hex[i] % characters.length];

	let pos = 0;
	for (let i = 16; i < 46; i++) {
		if (i % 2 === 0) {
			pos = hex[i] % res.length;
			continue;
		}

		let charset = "";
		let x = i - 16;
		if (x < 16) charset = LOWERCASE;
		else if (x < 24) charset = UPPERCASE;
		else if (x < 28) charset = NUMERIC;
		else charset = SPECIAL;

		let arr = res.split("");
		arr[pos] = charset[hex[i] % charset.length];
		res = arr.join("");
	}

	output.innerHTML = res;
};
