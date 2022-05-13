export function generateId() {
	const symbols = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789".split("");
	let id = symbols.sort((a, b) => Math.random() - 0.5);
	id.length = 18;
	return id.join("");
}