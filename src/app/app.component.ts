import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ToastController, PopoverController, AlertController } from '@ionic/angular';
import { UserServiceService } from './user-service.service';
import * as SockJS from 'sockjs-client';

declare var SockJS;
declare var Stomp;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  stompClient: any
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
  //alert : any;

  constructor(
    private swUpdate: SwUpdate,
    private toastCtrl: ToastController,
    private userService: UserServiceService,
    public alertController: AlertController
  ) {
   
   // this.initializeApp();
  }



  


   ngOnInit() {
    this.userService.switchViewSource$.subscribe((userType: string) => {
      this.switchViews(userType);
      console.log("hereeee");
      if(userType == 'guardian') {
        console.log("coming hereeee")
        const serverUrl = 'http://localhost:8080/guardian';
        const ws = new SockJS(serverUrl);
        this.stompClient = Stomp.over(ws);
        const that = this;
        this.stompClient.connect({}, function(frame) {
          that.stompClient.subscribe('/topic/get-approval', (message) => {
            console.log(message);
            if (message.body) {
              // console.log(that);
              // console.log(that.stompClient)
              // if(window.confirm("Do you want to approve the request")) {
              //   that.stompClient.send("/app/guardian", {}, 
              //   JSON.stringify({'from': 'anjali', 'creditRequest':'10', 'approved': "true"}));
              // }
              // // } else {
              // //   this.stompClient.send("/app/guardian", {}, 
              // //     JSON.stringify({'from': 'anjali', 'creditRequest':'10', 'approved': "false"}));
              // // }
            
              that.showPrompt();       
            }
          });
        });
      }
    })
    
    // this.swUpdate.available.subscribe(async res => {
    //   const toast = await this.toastCtrl.create({
    //     message: 'Update available!',
    //     position: 'bottom',
    //     buttons: [
    //       {
    //         role: 'cancel',
    //         text: 'Reload'
    //       }
    //     ]
    //   });

    //   await toast.present();

    //   toast
    //     .onDidDismiss()
    //     .then(() => this.swUpdate.activateUpdate())
    //     .then(() => window.location.reload());
    // });

      // var stompClient = null;
	    // var stompClient1 = null;
      // var socket = new SockJS('http://35.196.133.79user');
      // stompClient = Stomp.over(socket);  
      // stompClient.connect({}, function(frame) {
      //     setConnected(true);
      //     console.log('Connected: ' + frame);
      //     stompClient.subscribe('/topic/send-approval', function(messageOutput) {
      //         alert(JSON.parse(messageOutput.body));
      //     });
      // });
      // var socket1 = new SockJS('http://localhost:8080/guardian');
      // stompClient1 = Stomp.over(socket);  
      // stompClient1.connect({}, function(frame) {
      //     setConnected(true);
      //     console.log('Connected: ' + frame);
      //     stompClient1.subscribe('/topic/get-approval', function(messageOutput) {
      //         showMessageOutput(JSON.parse(messageOutput.body));
      //     });
      // });

      
   
  }


  async showPrompt() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert!!!',
      message: 'You Guardian is asking to load $100 more, Do you want to approve?',
      buttons: [{
        text : 'Ok',
        handler: () => {
          this.stompClient.send("/app/guardian", {}, 
          JSON.stringify({'from': 'anjali', 'creditRequest':'10', 'approved': "true"}));
        }
      }]
    });
    await alert.present();
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
