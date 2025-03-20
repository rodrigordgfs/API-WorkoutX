import fastify from "fastify";
import cors from "@fastify/cors";
import routes from "./src/routes/index.js";
import { startJobs } from "./src/jobs/index.js";
import { clerkPlugin } from "@clerk/fastify";

startJobs();

const app = fastify({
  pluginTimeout: 60000,
  bodyLimit: 10 * 1024 * 1024,
});

app.register(cors, {
  origin: [
    "http://localhost:3000",  // Permite requisições de localhost:3000
    "https://www.workoutx.site"    // Permite requisições do domínio workout.site
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Todos os métodos HTTP
  allowedHeaders: "*", // Permite qualquer header
  credentials: true, // Permite cookies e headers de autenticação
  preflight: true, // Garante que as preflight requests sejam permitidas
});

app.register(clerkPlugin, {
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

app.register(routes);

app
  .listen({
    port: process.env.PORT || 8080,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });
