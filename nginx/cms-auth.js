import querystring from "querystring";

const STATE_COOKIE = "cms-auth-state";
const SCOPE = "repo,user";

function randomHex(bytes) {
	return Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (b) => b.toString(16).padStart(2, "0")).join("");
}

function callbackUrl(r) {
	return `https://${r.headersIn.host}/cms-auth/callback`;
}

function cookie(r, name) {
	const match = (r.headersIn.cookie || "").match(new RegExp(`(?:^|;\\s*)${name}=([0-9a-f]+)`));
	return match ? match[1] : undefined;
}

function respond(r, result) {
	const state = result.token ? "success" : "error";
	const content = result.token
		? { provider: "github", token: result.token }
		: { provider: "github", error: result.error, errorCode: result.errorCode };
	const message = `authorization:github:${state}:${JSON.stringify(content)}`;
	const html = `<!doctype html><html><body><script>
(() => {
	const message = ${JSON.stringify(message).replace(/</g, "\\u003c")};
	window.addEventListener("message", ({ data, origin }) => {
		if (data !== "authorizing:github" || origin !== location.origin) return;
		window.opener?.postMessage(message, location.origin);
	});
	window.opener?.postMessage("authorizing:github", location.origin);
})();
</script></body></html>`;
	r.headersOut["Content-Type"] = "text/html; charset=utf-8";
	r.headersOut["Cache-Control"] = "no-store";
	r.headersOut["Set-Cookie"] = `${STATE_COOKIE}=; Path=/cms-auth; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
	r.return(200, html);
}

function configured() {
	return Boolean(process.env.CMS_GITHUB_CLIENT_ID && process.env.CMS_GITHUB_CLIENT_SECRET);
}

function auth(r) {
	if (r.args.provider !== "github") {
		return respond(r, { error: "Podporované je jen přihlášení přes GitHub.", errorCode: "UNSUPPORTED_BACKEND" });
	}
	if (!configured()) {
		return respond(r, { error: "Přihlášení přes GitHub není nastavené.", errorCode: "MISCONFIGURED_CLIENT" });
	}
	const state = randomHex(16);
	const params = querystring.stringify({
		client_id: process.env.CMS_GITHUB_CLIENT_ID,
		redirect_uri: callbackUrl(r),
		scope: SCOPE,
		state,
	});
	r.headersOut["Set-Cookie"] = `${STATE_COOKIE}=${state}; Path=/cms-auth; Max-Age=600; HttpOnly; Secure; SameSite=Lax`;
	r.headersOut["Cache-Control"] = "no-store";
	r.return(302, `https://github.com/login/oauth/authorize?${params}`);
}

async function callback(r) {
	const code = r.args.code;
	const state = r.args.state;
	if (!code || !state) {
		return respond(r, { error: "GitHub nevrátil autorizační kód.", errorCode: "AUTH_CODE_REQUEST_FAILED" });
	}
	if (state !== cookie(r, STATE_COOKIE)) {
		return respond(r, { error: "Přihlášení vypršelo, zkus to znovu.", errorCode: "CSRF_DETECTED" });
	}
	if (!configured()) {
		return respond(r, { error: "Přihlášení přes GitHub není nastavené.", errorCode: "MISCONFIGURED_CLIENT" });
	}
	try {
		const response = await ngx.fetch("https://github.com/login/oauth/access_token", {
			method: "POST",
			headers: { Accept: "application/json", "Content-Type": "application/json" },
			body: JSON.stringify({
				client_id: process.env.CMS_GITHUB_CLIENT_ID,
				client_secret: process.env.CMS_GITHUB_CLIENT_SECRET,
				code,
				redirect_uri: callbackUrl(r),
			}),
		});
		const body = await response.json();
		if (body.access_token) return respond(r, { token: body.access_token });
		r.warn(`cms-auth: GitHub token exchange failed: ${body.error || response.status}`);
	} catch (err) {
		r.error(`cms-auth: GitHub token exchange failed: ${err}`);
	}
	respond(r, { error: "Nepodařilo se získat token z GitHubu. Zkus to znovu.", errorCode: "TOKEN_REQUEST_FAILED" });
}

export default { auth, callback };
