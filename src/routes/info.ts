import config from "../config";

export function handleInfo(_req: Request): Response {
	return Response.json({
		name: config.APP_NAME,
		version: config.APP_VERSION,
		environment: config.NODE_ENV,
		log_level: config.LOG_LEVEL,
		enable_docs: config.ENABLE_DOCS,
		allowed_origins: config.ALLOWED_ORIGINS,
		max_request_size_kb: config.MAX_REQUEST_SIZE_KB,
	});
}
