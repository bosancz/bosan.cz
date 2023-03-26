const config = require("../config");

const { Routes } = require("@smallhillcz/routesjs");
const routes = (module.exports = new Routes());

var Member = require("../models/member");

routes.get("members", "/", { permission: "members:list" }).handle(async (req, res, next) => {
  var query = Member.find({});
  query.filterByPermission("members:list", req);

  if (req.query.role) query.where({ role: Array.isArray(req.query.role) ? { $in: req.query.role } : req.query.role });
  if (req.query.group) query.where({ group: req.query.group });
  if (req.query.sort) query.sort(req.query.sort);
  if (req.query.select) query.select(req.query.select);
  if (req.query.limit) query.limit(Number(req.query.limit));
  if (req.query.search) {
    const searchString = req.query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
    query.where({
      $or: [
        { nickname: new RegExp(searchString, "i") },
        { "name.first": new RegExp(searchString, "i") },
        { "name.last": new RegExp(searchString, "i") },
      ],
    });
  }

  const members = await query.toObject();

  req.routes.links(members, "member");

  res.json(members);
});

routes.post("members", "/", { permission: "members:list" }).handle(async (req, res) => {
  var member = await Member.create(req.body);
  res.location(`/members/${member._id}`);
  res.status(201).json(member);
});

routes.get("member", "/:id", { permission: "members:read" }).handle(async (req, res, next) => {
  const member = (await Member.findOne({ _id: req.params.id })).toObject();
  req.routes.links(member, "member");
  res.json(member);
});

routes.patch("member", "/:id", { permission: "members:edit" }).handle(async (req, res, next) => {
  await Member.findOneAndUpdate({ _id: req.params.id }, req.body);
  res.sendStatus(204);
});

routes.delete("member", "/:id", { permission: "members:delete" }).handle(async (req, res, next) => {
  await Member.remove({ _id: req.params.id });
  res.sendStatus(204);
});
