import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';

import { MenuController, Platform, ToastController } from '@ionic/angular';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Storage } from '@ionic/storage';

import { UserData } from './providers/user-data';
import { UserServiceService } from './user-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'PassBook',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    {
      title: 'Select Location',
      url: '/app/tabs/map',
      icon: 'navigate'
    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information'
    },
  ];
  userAppPages = [
    {
      title: 'PassBook',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    {
      title: 'Select Location',
      url: '/app/tabs/map',
      icon: 'navigate'
    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information'
    },
  ];

  guardianAppPages = [
    {
      title: 'PassBook',
      url: '/app/tabs/schedule',
      icon: 'calendar'
    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information'
    },
  ]


  loggedIn = false;
  dark = false;

  constructor(
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private userService: UserServiceService
  ) {
   // this.initializeApp();
  }

  async ngOnInit() {
    this.userService.switchViewSource$.subscribe((userType: string) => {
      this.switchViews(userType);
    })
    this.swUpdate.available.subscribe(async res => {
      const toast = await this.toastCtrl.create({
        message: 'Update available!',
        position: 'bottom',
        buttons: [
          {
            role: 'cancel',
            text: 'Reload'
          }
        ]
      });

      await toast.present();

      toast
        .onDidDismiss()
        .then(() => this.swUpdate.activateUpdate())
        .then(() => window.location.reload());
    });
  }
  switchViews(userType: string) {
    console.log(userType)
    this.userService.currentUserType = 'userType';
    if(userType == 'user') {
      this.appPages = [...this.userAppPages];
    } else {
      this.appPages = [...this.guardianAppPages];
    }
  }
}
