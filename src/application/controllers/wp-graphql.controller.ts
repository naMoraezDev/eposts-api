import { FastifyReply, FastifyRequest } from "fastify";
import { WPGraphQLService } from "../../domain/services/wp-graphql.service";

export class WPGraphQLController {
  constructor(readonly wpGraphQLService: WPGraphQLService) {}

  public async getPostsByCategorySlug(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const params = request.params as { categorySlug: string };
    const { categorySlug } = params;
    const query = request.query as {
      after?: string | null;
      before?: string | null;
      number?: string | null;
    };
    const posts = await this.wpGraphQLService.getPostsByCategorySlug({
      ...query,
      categorySlug,
    });
    return reply.status(200).send(posts);
  }

  public async getCategoryBySlug(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { slug: string };
    const { slug } = params;
    const category = await this.wpGraphQLService.getCategoryBySlug(slug);
    return reply.status(200).send(category);
  }

  public async getPostBySlug(request: FastifyRequest, reply: FastifyReply) {
    const params = request.params as { slug: string };
    const { slug } = params;
    const post = await this.wpGraphQLService.getPostBySlug(slug);
    return reply.status(200).send(post);
  }

  public async getPostsBySearchTerm(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    const query = request.query as {
      term: string;
      after?: string | null;
      before?: string | null;
      number?: string | null;
    };
    const posts = await this.wpGraphQLService.getPostsBySearchTerm({
      ...query,
    });
    return reply.status(200).send(posts);
  }

  public async getTags(_request: FastifyRequest, reply: FastifyReply) {
    const post = await this.wpGraphQLService.getTags();
    return reply.status(200).send(post);
  }
}
