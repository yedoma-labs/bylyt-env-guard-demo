import config from "../config";

export function handleHealth(_req: Request): Response {
	return Response.json({
		status: "ok",
		uptime: Math.floor(process.uptime()),
		environment: config.NODE_ENV,
		version: config.APP_VERSION,
	});
}
