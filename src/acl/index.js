var dynacl = require("express-dynacl");

var roles = {
  // default
  "admin": require("./default/admin"),
  "guest": require("./default/guest"),
  "user": require("./default/user"),

  // custom
  "clen": require("./custom/clen"),
  "vedouci": require("./custom/vedouci"),
  "revizor": require("./custom/revizor"),
  "spravce": require("./custom/spravce")
};

var dynaclOptions = {
  roles: roles,
  userRoles: req => req.user ? req.user.roles.concat(["user"]) : [],
  defaultRole: "guest",
  logConsole: true,
  logString: (event) => {
    var params = {
      "Action": event.action,
      "User": event.req.user ? event.req.user._id : null,
      "Role": event.role,
      "Params": Object.keys(event.params).length ? JSON.stringify(event.params) : null,
      "Source": event.req.headers['x-forwarded-for'] || event.req.connection.remoteAddress,
      "Url": event.req.originalUrl.split("?")[0],
      "Query": event.req.query ? JSON.stringify(event.req.query) : null
    };
    return `DynACL ${event.permission ? "OK" : "XX"} :: ` + Object.entries(params).filter(param => param[1]).map(param => `${param[0]}: ${param[1]}`).join(", ");
  }
};

dynacl.config(dynaclOptions);

module.exports = dynacl;
