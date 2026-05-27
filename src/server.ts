import type { Config } from "./config";
import { handleHealth } from "./routes/health";
import { handleInfo } from "./routes/info";

export function createServer(config: Config) {
	const server = Bun.serve({
		hostname: config.HOST,
		port: config.PORT,
		fetch(req) {
			const url = new URL(req.url);

			if (url.pathname === "/health" && req.method === "GET") {
				return handleHealth(req);
			}

			if (url.pathname === "/info" && req.method === "GET") {
				return handleInfo(req);
			}

			return Response.json({ error: "Not found" }, { status: 404 });
		},
	});

	console.log(
		`🚀 Server running at http://${config.HOST}:${config.PORT} (${config.NODE_ENV})`,
	);

	return server;
}
