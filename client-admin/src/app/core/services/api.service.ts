import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentLink } from "app/schema/api-document";
import { ApiEndpoint } from 'app/schema/api-endpoints';
import { ApiError } from 'app/schema/api-error';
import { ApiInfo } from 'app/schema/api-info';
import { environment } from "environments/environment";

type PathObject =
  ApiEndpoint
  | [ApiEndpoint, ...(string | number)[]]
  | { href: string; };

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  root = environment.apiRoot;

  resources = this.http.get<ApiInfo>(this.root).toPromise().then(api => api._links);

  constructor(private http: HttpClient) { }


  link2href(link: DocumentLink): string {
    if (!link.href.match(/^[a-z]+\:\/\//)) return this.root + link.href;
    else return link.href;
  }

  async path2href(pathObj: PathObject): Promise<string> {

    if (!pathObj) throw new ApiError("Missing link");

    var path: string;
    var expand: (string | number)[] | any = [];

    if (Array.isArray(pathObj)) {
      if (typeof pathObj[1] === "object") [path, expand] = pathObj;
      else { path = pathObj[0]; expand = pathObj.slice(1); }
    }
    else if (typeof pathObj === "object") {
      path = pathObj.href;
    }
    else {
      path = pathObj;
    }

    var href;

    if (typeof path === "string" && path.match(/^[a-z\-\:]+$/i)) {
      const resources = await this.resources;

      if (path in resources) {
        href = resources[<keyof typeof resources>path].href;
      }
      else {
        throw new ApiError(`Resource ${path} does not exist on the API endpoint ${this.root}.`);
      }
    }
    else if (typeof path === "string") {
      href = path;
    }
    else {
      throw new ApiError("Invalid link: " + JSON.stringify(pathObj));
    }

    href = this.expandHref(href, expand);

    if (!href.match(/^[a-z]+\:\/\//)) href = this.root + href;

    return href;

  }

  expandHref(href: string, expand: any | (string | number)[]): string {

    const re = /\{([^\}]+)\}/g;

    if (Array.isArray(expand)) {
      var i = 0;
      href = href.replace(re, key => { i++; return expand[i - 1]; });
    }

    else {
      href = href.replace(re, key => expand[key]);
    }

    return href;
  }

  async get<T>(path: PathObject, params?: any): Promise<T> {
    const href = await this.path2href(path);
    return this.http.get<T>(href, { params: this.toParams(params) }).toPromise();
  };

  async getAsText(path: PathObject, params?: any): Promise<string> {
    const href = await this.path2href(path);
    return this.http.get(href, { params: this.toParams(params), responseType: "text" }).toPromise();
  };

  async post<T>(path: PathObject, data?: T): Promise<HttpResponse<string>> {
    const href = await this.path2href(path);
    return this.http.post(href, data, { observe: "response", responseType: "text" }).toPromise();
  };

  async put<T>(path: PathObject, data: T): Promise<HttpResponse<string>> {
    const href = await this.path2href(path);
    return this.http.put(href, data, { observe: "response", responseType: "text" }).toPromise();
  };

  async patch<T>(path: PathObject, data: Partial<T>): Promise<HttpResponse<string>> {
    const href = await this.path2href(path);
    return this.http.patch(href, data, { observe: "response", responseType: "text" }).toPromise();
  }

  async delete(path: PathObject, expand?: any): Promise<HttpResponse<string>> {
    const href = await this.path2href(path);
    return this.http.delete(href, { observe: "response", responseType: "text" }).toPromise();
  }

  private setParam(params: HttpParams, name: string, value: any) {
    if (value === undefined) return params;

    if (value === null) return params.delete(name);

    if (typeof value !== "object") return params.set(name, value);

    if (Array.isArray(value)) {
      value.forEach((item, i) => params = this.setParam(params, name + "[" + i + "]", item));
      return params;
    }

    Object.entries(value).forEach(entry => params = this.setParam(params, name + "[" + entry[0] + "]", entry[1]));
    return params;
  }

  private toParams(options: { [s: string]: any; }): HttpParams {
    let params = new HttpParams();

    if (options) Object.entries(options).forEach(entry => params = this.setParam(params, entry[0], entry[1]));

    return params;
  }
}
