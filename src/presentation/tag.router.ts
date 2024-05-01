import z from "zod";
import { FastifyInstance } from "fastify";
import { TagService } from "../domain/services/tag.service";
import { tagSchema } from "../domain/schemas/tag/tag.schema";
import { tagListSchema } from "../domain/schemas/tag/tag-list.shema";
import { TagController } from "../application/controllers/tag.controller";
import { TagRepository } from "../infrastructure/repositories/tag.repository";

export async function tagRouter(app: FastifyInstance) {
  app.get(
    "/tags",
    {
      schema: {
        tags: ["tag"],
        summary: "Get a list of tags.",
        
      },
    },
    async (request, reply) => {
      await new TagController(new TagService(new TagRepository())).getTags(
        request,
        reply
      );
    }
  );

  app.get(
    "/tags/:slug",
    {
      schema: {
        tags: ["tag"],
        summary: "Get information about a single tag (by slug).",
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: tagSchema,
        },
      },
    },
    async (request, reply) => {
      await new TagController(new TagService(new TagRepository())).getTagBySlug(
        request,
        reply
      );
    }
  );
}
