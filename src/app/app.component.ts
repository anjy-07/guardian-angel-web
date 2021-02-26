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
        const serverUrl = 'http://35.196.133.79/guardian';
        const ws = new SockJS(serverUrl);
        this.stompClient = Stomp.over(ws);
        const that = this;
        this.stompClient.connect({}, function(frame) {
          that.stompClient.subscribe('/topic/get-approval', (message) => {
            console.log(message);
            if (message.body) {
              if(window.confirm("Do you want to approve the request")) {
                this.stompClient.send("/app/guardian", {}, 
                JSON.stringify({'from': 'anjali', 'creditRequest':'10', 'approved': "true"}));
              } else {
                this.stompClient.send("/app/guardian", {}, 
                  JSON.stringify({'from': 'anjali', 'creditRequest':'10', 'approved': "false"}));
              }
            
              this.showPrompt();       
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
      // var socket1 = new SockJS('http://35.196.133.79/guardian');
      // stompClient1 = Stomp.over(socket);  
      // stompClient1.connect({}, function(frame) {
      //     setConnected(true);
      //     console.log('Connected: ' + frame);
      //     stompClient1.subscribe('/topic/get-approval', function(messageOutput) {
      //         showMessageOutput(JSON.parse(messageOutput.body));
      //     });
      // });

      
   
  }


  showPrompt() {
    this.alertController.create({
      header: 'Prompt Alert',
      subHeader: 'Enter information requested',
      message: 'Enter your favorate place',
      inputs: [
        {
          name: 'Place',
          placeholder: 'Eg.NY',
          
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: (data: any) => {
            console.log('Canceled', data);
          }
        },
        {
          text: 'Done!',
          handler: (data: any) => {
            console.log('Saved Information', data);
          }
        }
      ]
    }).then(res => {
      res.present();
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
