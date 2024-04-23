import WordpressService from "../../../infra/wordpress/service";

class PostsEntity {
  constructor(categorySlug?: string) {
    this.categorySlug = categorySlug || "";
  }

  private categorySlug: string;

  async get() {
    const posts = await WordpressService.getPostsByCategory(this.categorySlug);
    return posts;
  }
}

export default PostsEntity;
