import pug from "pug";
import path from "path";
import fastify from "fastify";
import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import fastifyView from "@fastify/view";
import packageJSON from "../package.json";
import fastifySwagger from "@fastify/swagger";
import { routes } from "./presentation/routes";
import { fastifyExpress } from "@fastify/express";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { models } from "./infrastructure/utils/models";
import { viewRouter } from "./presentation/view.router";
import { ZodTypeProvider } from "fastify-type-provider-zod";
// import { redisConnect } from "./infrastructure/db/redis/redis";
import { mongoDBConnect } from "./infrastructure/db/mongoDB/conn";
import { errorHandler } from "./infrastructure/errors/error-handler";

mongoDBConnect();
// redisConnect();

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
  origin: [
    "http://localhost:3000",
    "https://ecrew.vercel.app",
    "https://eposts.vercel.app",
  ],
});

app.register(require("@fastify/static"), {
  root: path.join(__dirname, "../public"),
  prefix: "/public/",
});

app.register(fastifyView, {
  engine: {
    pug,
  },
});

app.register(viewRouter);

app.register(fastifySwagger, {
  swagger: {
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "eCrew API",
      version: packageJSON.version,
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/swagger",
  theme: {
    title: "eCrew API",
    css: [
      {
        filename: "theme.css",
        content:
          'body { padding-bottom: 80px } .topbar { position: sticky } .topbar { top: 0 } .topbar { z-index: 1 } .topbar { width: 100% } .link img { display: none } .link:after { content: "eCrew" }',
      },
    ],
  },
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyExpress);
app.register(routes, { prefix: "/api/v1" });

app.setErrorHandler(errorHandler);

app.register(models);

export default app;
