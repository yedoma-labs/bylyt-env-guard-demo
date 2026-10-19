import {
	createServer as createHttpServer,
	type IncomingMessage,
	type ServerResponse,
} from "node:http";
import type { Config } from "./config";
import { handleHealth } from "./routes/health";
import { handleInfo } from "./routes/info";

type Handler = (req: Request) => Response;

const routes: Record<string, Handler> = {
	"GET /health": handleHealth,
	"GET /info": handleInfo,
};

// Wandelt Node-Request in Fetch-Request um und schreibt die Fetch-Response zurück
async function toFetchRequest(
	req: IncomingMessage,
	origin: string,
): Promise<Request> {
	const headers = new Headers();
	for (const [key, value] of Object.entries(req.headers)) {
		if (Array.isArray(value)) for (const v of value) headers.append(key, v);
		else if (value !== undefined) headers.set(key, value);
	}
	const chunks: Buffer[] = [];
	for await (const chunk of req) chunks.push(chunk as Buffer);
	const hasBody =
		chunks.length > 0 && req.method !== "GET" && req.method !== "HEAD";
	return new Request(new URL(req.url ?? "/", origin), {
		method: req.method,
		headers,
		body: hasBody ? Buffer.concat(chunks) : undefined,
	});
}

async function writeFetchResponse(
	res: ServerResponse,
	response: Response,
): Promise<void> {
	res.statusCode = response.status;
	for (const [key, value] of response.headers) res.setHeader(key, value);
	res.end(Buffer.from(await response.arrayBuffer()));
}

export function createServer(config: Config) {
	const origin = `http://${config.HOST}:${config.PORT}`;

	const server = createHttpServer(async (req, res) => {
		const url = new URL(req.url ?? "/", origin);
		const handler = routes[`${req.method} ${url.pathname}`];
		const response = handler
			? handler(await toFetchRequest(req, origin))
			: Response.json({ error: "Not found" }, { status: 404 });
		await writeFetchResponse(res, response);
	});

	server.listen(config.PORT, config.HOST, () => {
		console.log(`🚀 Server running at ${origin} (${config.NODE_ENV})`);
	});

	return server;
}
