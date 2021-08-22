import createToken from "./create-token";
import saveCookie from "./save-cookie";

export default async function (res, user, impersonatedBy) {
  var token = await createToken(user, { impersonatedBy });

  saveCookie(res, token);

  return { access_token: token };
}
