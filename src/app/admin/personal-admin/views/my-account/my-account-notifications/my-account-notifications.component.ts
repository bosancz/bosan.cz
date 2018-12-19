import { Component, OnInit } from '@angular/core';

import { ApiService } from "app/services/api.service";

import { User, UserNotification } from "app/schema/user";

declare const Notification:any;

@Component({
  selector: 'my-account-notifications',
  templateUrl: './my-account-notifications.component.html',
  styleUrls: ['./my-account-notifications.component.scss']
})
export class MyAccountNotificationsComponent implements OnInit {

  user:User;
  
  notifications = [
    { id: "new-event", name: "Nová událost" },
    { id: "new-gallery", name: "Nová galerie" },
    { id: "changed-event", name: "Změna události" },
    { id: "received-payment", name: "Přijatá platba" }
  ];
  
  userNotifications:{ [id:string]:UserNotification };
  
  systemNotificationStatus:boolean = false;
  
  constructor(private api:ApiService) {
    this.updateNotifications();
  }

  ngOnInit() {
    this.loadUser();
  }
  
  async loadUser(){
    this.user = await this.api.get<User>("me:user");
    this.updateNotifications();
  }
  
  updateNotifications(){
    
    this.userNotifications = {};
                              
    this.notifications.forEach(notification => {
      
      this.userNotifications[notification.id] = {
        email: this.user && this.user.notifications && this.user.notifications[notification.id] && !!this.user.notifications[notification.id].email,
        system: this.user && this.user.notifications && this.user.notifications[notification.id] && !!this.user.notifications[notification.id].system
      };
      
    });
  }
  
  updateSystemNotificationStatus(){
    this.systemNotificationStatus = Notification && Notification.permission === "granted";
  }
  
  async requestNotificationPermission(){
    const permission = await Notification.requestPermission();
    if(permission === "granted") this.systemNotificationStatus = true;
  }

}
