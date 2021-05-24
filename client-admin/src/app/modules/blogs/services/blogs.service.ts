import { Injectable } from '@angular/core';
import { ApiService } from 'app/core/services/api.service';
import { Blog } from 'app/schema/blog';

export interface BlogsFilter {
  year: number;
  status?: Blog["status"];
}

@Injectable()
export class BlogsService {

  constructor(
    private api: ApiService
  ) { }

  async list(filter?: BlogsFilter) {

    const options: any = {
      filter: {
        dateFrom: filter?.year ? { $gte: filter.year + "-01-01", $lte: filter.year + "-12-31" } : undefined
      }
    };

    if (filter?.status) options.filter.status = filter.status;

    return this.api.get<Blog[]>("blogs", options);
  }

  async create(data: Omit<Blog, "_id" | "status">) {
    const response = await this.api.post("blogs", data);
    const location = response.headers.get("location");
    if (!location) throw new Error("Error creating new blog");
    return await this.api.get<Blog>({ href: location });
  }

  async load(id: string) {
    return this.api.get<Blog>(["blog", id]);
  }

  async save(id: string, data: Partial<Blog>) {
    await this.api.patch(["blog", id], data);
  }

  async delete(id: string) {
    await this.api.delete(["blog", id]);
  }

  async publish(blog: Blog) {
    if (!blog._actions) throw new Error("Missing actions field");
    await this.api.post(blog._actions.publish);
  }

  async unpublish(blog: Blog) {
    if (!blog._actions) throw new Error("Missing actions field");
    await this.api.post(blog._actions.unpublish);
  }
}
