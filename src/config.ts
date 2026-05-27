import { createEnv, eg } from "@yedoma-labs/bylyt-env-guard";

const config = createEnv({
	schema: {
		PORT: eg.port().default(3000),
		HOST: eg.string().default("localhost"),
		NODE_ENV: eg
			.enum(["development", "production", "test"] as const)
			.default("development"),
		APP_NAME: eg.string().default("bylyt-env-guard-demo"),
		APP_VERSION: eg.string().default("0.1.0"),
		API_KEY: eg.string().required().sensitive(),
		LOG_LEVEL: eg
			.enum(["debug", "info", "warn", "error"] as const)
			.default("info"),
		ALLOWED_ORIGINS: eg.array().default(["http://localhost:3000"]),
		MAX_REQUEST_SIZE_KB: eg.number().default(1024),
		ENABLE_DOCS: eg.boolean().default(true),
	},
});

export type Config = typeof config;
export default config;
