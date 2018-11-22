import { Injectable, EventEmitter } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { User } from "app/schema/user";

import { AuthService } 		from 'app/services/auth.service';
import { ToastService } 		from 'app/services/toast.service';

import { AppConfig, IAppConfig } from "config/config";

export interface ACLRoute{
  route:string;
  allowRoles?:string[];
  allowCheck?:(params:any) => boolean;
  allowAll?:boolean;
}
/**
	* Service to save user information and commnicate user data with server
	*/
@Injectable({
  providedIn: 'root'
})
export class ACLService implements CanActivate {

  routes:ACLRoute[] = [];

  roles:string[] = [];

  admin:boolean = false;

  default:ACLRoute;

  unauthorized:EventEmitter<void> = new EventEmitter();

  constructor(private toastService:ToastService, private router:Router){	}

  canActivate(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean {

    if(this.admin) return true;

    let result = this.checkRoute(state.url);

    if(!result) this.unauthorized.emit();

    return result;

  }

  // function to get user roles and evaluate permissions
  checkRoute(routeString:string, params?:any):boolean{

    const route = this.findRoute(routeString);
    if(!route) return false;

    if(params) Object.assign(route.params,params);

    if(route.routeDef.allowAll === true) return true;

    if(route.routeDef.allowRoles && route.routeDef.allowRoles.some(role => this.roles.indexOf(role) !== -1)) return true;

    if(route.routeDef.allowCheck && route.routeDef.allowCheck(route.params)) return true;

    return false;
  }

  checkAction(){

  }

  findRoute(searchRoute:string):any{

    let route;
    const params = {};   

    searchRoute = searchRoute.split(";")[0];

    const result = this.routes.some(routeDef => {

      let paramNamesMatches = routeDef.route.match(/\:[^\/]+/g);
      let paramNames = paramNamesMatches ? paramNamesMatches.map(item => item.substr(1)) : [];

      let search = new RegExp("^" + routeDef.route.replace("*",".*").replace(/\:[^\/]+/g,"([^\/]+)") + "$");

      let matches = searchRoute.match(search);

      if(matches){
        route = routeDef;
        matches.slice(1).forEach((match,i) => params[paramNames[i]] = match);
        return true;
      }

      return false;

    });

    if(result) return { routeDef: route, params: params };

    else return { routeDef: this.default, params: {}};

  }


}