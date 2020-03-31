// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment:any = {
  production: false,

  apiRoot: "/api",

  jwtDomains: ["bosancz-kopec.smallhill.cz"],

  gapi: {
    client_id: '249555539983-j8rvff7bovgnecsmjffe0a3dj55j33hh.apps.googleusercontent.com',
    cookiepolicy: 'single_host_origin',
    scope: 'profile email'
  }

};
