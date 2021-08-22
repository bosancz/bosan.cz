const host = process.env.SERVER_HOST || "0.0.0.0";
const port = process.env.SERVER_PORT || 3000;

export default {
  host,
  port,

  baseDir: process.env.BASE_DIR || "/api",
  baseUrl: process.env.BASE_URL || `http://${host}${port && ":" + port}`,

  cors: {
    enable: process.env.CORS_ENABLE,
    origins: process.env.CORS_ORIGINS,
  },
};
