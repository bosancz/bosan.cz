const { Routes, RoutesACL } = require("@smallhillcz/routesjs");
const routes = (module.exports = new Routes());

var Blog = require("../models/blog");

routes.get("blogs", "/", { permission: "blogs:list" }).handle(async (req, res, next) => {
  const query = Blog.find();
  query.filterByPermission("blogs:drafts:list", req);

  query.select("_id title perex datePublished status");

  const blogs = await query;

  req.routes.links(blogs, "blog");

  res.json(blogs);
});

routes.post("blogs", "/", { permission: "blogs:create" }).handle(async (req, res, next) => {
  const blog = await Blog.create(req.body);

  res.location(`/blogs/${blog._id}`);
  res.status(201).json(blog);
});

routes.get("blog", "/:id", { permission: "blogs:read" }).handle(async (req, res, next) => {
  var query = Blog.findOne({ _id: req.params.id });

  const blog = await query.toObject();

  req.routes.links(blog, "blog");

  res.json(blog);
});

routes.patch("blog", "/:id", { permission: "blogs:edit" }).handle(async (req, res, next) => {
  await Blog.findOneAndUpdate({ _id: req.params.id }, req.body);
  res.sendStatus(204);
});

routes
  .action("blog:publish", "/:id/actions/publish", {
    permission: "blogs:publish",
    hideRoot: true,
    query: { status: { $in: ["draft"] } },
  })
  .handle(async (req, res, next) => {
    await Blog.findOneAndUpdate({ _id: req.params.id }, { status: "public", datePublished: new Date() });
    res.sendStatus(204);
  });

routes
  .action("blog:unpublish", "/:id/actions/unpublish", {
    permission: "blogs:publish",
    hideRoot: true,
    query: { status: { $in: ["public"] } },
  })
  .handle(async (req, res, next) => {
    await Blog.findOneAndUpdate({ _id: req.params.id }, { status: "draft", datePublished: undefined });
    res.sendStatus(204);
  });

routes.delete("blog", "/:id", { permission: "blogs:delete" }).handle(async (req, res, next) => {
  const blog = await Blog.findOne({ _id: req.params.id });

  await Blog.deleteOne({ _id: req.params.id });

  res.sendStatus(204);
});
