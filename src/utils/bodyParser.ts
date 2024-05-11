export function bodyParser(body: string | undefined) {
	try {
		if (!body) return {};

		return JSON.parse(body);
	} catch (e) {
		return {};
	}
}
