import { Component, ElementRef, Inject, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform, ToastController } from '@ionic/angular';
import { DOCUMENT} from '@angular/common';
import { darkStyle } from './map-dark-style';
import { UserServiceService } from '../../user-service.service';
import * as SockJS from 'sockjs-client';

declare var SockJS;
declare var Stomp;

interface merchant {
  "merchant_id" : number,
  "merchant_category" : string
  "merchant_name" : string
  "merchant_addr_street" : string
  "merchant_addr_city" : string
  "imgUrl": string
}
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {
  @ViewChild('mapCanvas', { static: true }) mapElement: ElementRef;

  @ViewChild('animation', { static: true }) animationEffect : ElementRef;
  sockjs : any;
  public stompClient;
  pageHeader: String = 'Location';
  paymentDone: boolean = false;
  locationSelected : boolean = false;
  creditInfo  : any = {};
  currentAmount : number = 200;
  payBtn: boolean = true;
  selectedMerchant : merchant= {
    "merchant_id" : 1,
    "merchant_category" : '',
    "merchant_name" : '',
    "merchant_addr_street" : '',
    "merchant_addr_city" : '',
    "imgUrl": ''
  };
  userName : string = '';
  cardCredential  = {
    "ccId": 1,
    "ccNumber": "4916 2476 9197 6171",
    "ccCVV": 234,
    "ccLimit": 100.0,
    "ccBalance": 0.0,
    "ccExpDate": "03/23"
  };

  // locations = [
  //   {"name" : "McDonalds", "imgUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F4%2F4b%2FMcDonald%2527s_logo.svg%2F220px-McDonald%2527s_logo.svg.png&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMcDonald%2527s&tbnid=vHOwZP6qyoY5OM&vet=12ahUKEwj-0ZTA9IXvAhWRsksFHbqzAaMQMygKegUIARC8AQ..i&docid=tg3qNrQIjRxkLM&w=220&h=167&itg=1&q=mcd&ved=2ahUKEwj-0ZTA9IXvAhWRsksFHbqzAaMQMygKegUIARC8AQ"},
  //   {"name" : "BurgerKing", "imgUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F4%2F4b%2FMcDonald%2527s_logo.svg%2F220px-McDonald%2527s_logo.svg.png&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMcDonald%2527s&tbnid=vHOwZP6qyoY5OM&vet=12ahUKEwj-0ZTA9IXvAhWRsksFHbqzAaMQMygKegUIARC8AQ..i&docid=tg3qNrQIjRxkLM&w=220&h=167&itg=1&q=mcd&ved=2ahUKEwj-0ZTA9IXvAhWRsksFHbqzAaMQMygKegUIARC8AQ"},
  //   {"name" : "Pertol Pump", "imgUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F4%2F4b%2FMcDonald%2527s_logo.svg%2F220px-McDonald%2527s_logo.svg.png&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMcDonald%2527s&tbnid=vHOwZP6qyoY5OM&vet=12ahUKEwj-0ZTA9IXvAhWRsksFHbqzAaMQMygKegUIARC8AQ..i&docid=tg3qNrQIjRxkLM&w=220&h=167&itg=1&q=mcd&ved=2ahUKEwj-0ZTA9IXvAhWRsksFHbqzAaMQMygKegUIARC8AQ"}
  // ]

  locations : merchant[] = [{
    "merchant_id" : 1,
    "merchant_category" : "food_dining", 
    "merchant_name" : "McDonalds",
    "merchant_addr_street" : "Fort", 
    "merchant_addr_city" : "Mumbai",
    "imgUrl": "data:image/png;base64,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"
  },
  {
    "merchant_id" : 2,
    "merchant_category" : "petroleum", 
    "merchant_name" : "Burger King",
    "merchant_addr_street" : "Fort", 
    "merchant_addr_city" : "Mumbai",
    "imgUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fimg.pngio.com%2Findex-of-wp-content-uploads-2015-02-burger-king-logo-png-3000_3000.png&imgrefurl=https%3A%2F%2Fpngio.com%2FPNG%2Fa36184-burger-king-logo-png.html&tbnid=Z1GtvYOiP5l31M&vet=12ahUKEwiU2qCigIfvAhXTAXIKHcM5BWAQMygAegQIARBP..i&docid=Qzd3UnSvBrxHdM&w=3000&h=3000&q=burger%20king%20logo%20avatar&ved=2ahUKEwiU2qCigIfvAhXTAXIKHcM5BWAQMygAegQIARBP"
  },
  {
    "merchant_id" : 3,
    "merchant_category" : "petroleum", 
    "merchant_name" : "Pertol Pump",
    "merchant_addr_street" : "Fort", 
    "merchant_addr_city" : "Mumbai",
    "imgUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fimg.pngio.com%2Findex-of-wp-content-uploads-2015-02-burger-king-logo-png-3000_3000.png&imgrefurl=https%3A%2F%2Fpngio.com%2FPNG%2Fa36184-burger-king-logo-png.html&tbnid=Z1GtvYOiP5l31M&vet=12ahUKEwiU2qCigIfvAhXTAXIKHcM5BWAQMygAegQIARBP..i&docid=Qzd3UnSvBrxHdM&w=3000&h=3000&q=burger%20king%20logo%20avatar&ved=2ahUKEwiU2qCigIfvAhXTAXIKHcM5BWAQMygAegQIARBP"
  },
  {
    "merchant_id" : 4,
    "merchant_category" : "petroleum", 
    "merchant_name" : "Cafe Coffee Day",
    "merchant_addr_street" : "Fort", 
    "merchant_addr_city" : "Mumbai",
    "imgUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fimg.pngio.com%2Findex-of-wp-content-uploads-2015-02-burger-king-logo-png-3000_3000.png&imgrefurl=https%3A%2F%2Fpngio.com%2FPNG%2Fa36184-burger-king-logo-png.html&tbnid=Z1GtvYOiP5l31M&vet=12ahUKEwiU2qCigIfvAhXTAXIKHcM5BWAQMygAegQIARBP..i&docid=Qzd3UnSvBrxHdM&w=3000&h=3000&q=burger%20king%20logo%20avatar&ved=2ahUKEwiU2qCigIfvAhXTAXIKHcM5BWAQMygAegQIARBP"
  },
  {
    "merchant_id" : 5,
    "merchant_category" : "petroleum", 
    "merchant_name" : "Reliance Smart",
    "merchant_addr_street" : "Fort", 
    "merchant_addr_city" : "Mumbai",
    "imgUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fimg.pngio.com%2Findex-of-wp-content-uploads-2015-02-burger-king-logo-png-3000_3000.png&imgrefurl=https%3A%2F%2Fpngio.com%2FPNG%2Fa36184-burger-king-logo-png.html&tbnid=Z1GtvYOiP5l31M&vet=12ahUKEwiU2qCigIfvAhXTAXIKHcM5BWAQMygAegQIARBP..i&docid=Qzd3UnSvBrxHdM&w=3000&h=3000&q=burger%20king%20logo%20avatar&ved=2ahUKEwiU2qCigIfvAhXTAXIKHcM5BWAQMygAegQIARBP"
  },
  ]
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public confData: ConferenceData,
    public platform: Platform,
    private cdref: ChangeDetectorRef,
    private toastCtrl: ToastController,
    private userService: UserServiceService) {
      this.userService.switchViewSource$.subscribe((userType: string) => {
        if(userType == 'user') {
          const serverUrl = 'http://localhost:8080/user';
          const ws = new SockJS(serverUrl);
          this.stompClient = Stomp.over(ws);
          const that = this;
          this.stompClient.connect({}, function(frame) {
            that.stompClient.subscribe('/topic/send-approval', async (message) => {
              console.log(message)
              if (message.body) {
                
                const toast = await that.toastCtrl.create({
                  message: 'Voila! Request Approved',
                  position: 'bottom',
                  duration: 2000
                });
                await toast.present();
                this.payBtn = false;
                toast
                  .onDidDismiss()
                  .then(() => console.log("hi"));
               // that.msg.push(message.body);
              }
            });
          });
        }
    });
    }

    ngOnInit() {
     // this.initializeWebSocketConnection();
      console.log("IN MAPS")
      this.userName = this.userService.user1.user_name;
    }
    payBtnClicked() {
      this.pageHeader = 'Payment';
      // make network call and give the user transaction entity to backend
      const transaction = { "transaction_id" : 1,
          "ccId" : this.creditInfo['ccId'],
          "user_id" : this.userService.user1.user_id,
          "transaction_amount" : 0, 
          "merchant_id" : this.selectedMerchant.merchant_id,
          "timeOfDay" : 20,
          "Fstatus" : "SUCCESS"
       }
     
        this.paymentDone = true;
        this.cdref.detectChanges();
        const appEl = this.doc.querySelector('#animation');
        appEl.classList.add('load-complete');
        setTimeout(() => {
          this.doc.getElementById('checkmark').style.display='block';
        }, 1500);
   
      
    }
    initializeWebSocketConnection() {
      console.log(this.userService.currentUserType);
     
      

   
      
    }

    onLocationSelect(location: any) {
       
          if(this.cardCredential.ccLimit < this.currentAmount) {
            this.stompClient.send("/app/user", {}, 
            JSON.stringify({'from': 'user', 'creditRequest':'10', 'approved': "true"}));
          } 
          this.locationSelected = true;
        
    }

    
  async ngAfterViewInit() {
    const appEl = this.doc.querySelector('ion-app');
    let isDark = false;
    let style = [];
    if (appEl.classList.contains('dark-theme')) {
      style = darkStyle;
    }

    const googleMaps = await getGoogleMaps(
      'YOUR_API_KEY_HERE'
    );

    let map;

    this.confData.getMap().subscribe((mapData: any) => {
      const mapEle = this.mapElement.nativeElement;

      map = new googleMaps.Map(mapEle, {
        center: mapData.find((d: any) => d.center),
        zoom: 16,
        styles: style
      });

      mapData.forEach((markerData: any) => {
        const infoWindow = new googleMaps.InfoWindow({
          content: `<h5>${markerData.name}</h5>`
        });

        const marker = new googleMaps.Marker({
          position: markerData,
          map,
          title: markerData.name
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      });

      googleMaps.event.addListenerOnce(map, 'idle', () => {
        mapEle.classList.add('show-map');
      });
    });

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const el = mutation.target as HTMLElement;
          isDark = el.classList.contains('dark-theme');
          if (map && isDark) {
            map.setOptions({styles: darkStyle});
          } else if (map) {
            map.setOptions({styles: []});
          }
        }
      });
    });
    observer.observe(appEl, {
      attributes: true
    });
  }
}


function getGoogleMaps(apiKey: string): Promise<any> {
  const win = window as any;
  const googleModule = win.google;
  if (googleModule && googleModule.maps) {
    return Promise.resolve(googleModule.maps);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=3.31`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      const googleModule2 = win.google;
      if (googleModule2 && googleModule2.maps) {
        resolve(googleModule2.maps);
      } else {
        reject('google maps not available');
      }
    };
  });
}

