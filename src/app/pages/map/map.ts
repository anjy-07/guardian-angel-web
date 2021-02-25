import { Component, ElementRef, Inject, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { Platform } from '@ionic/angular';
import { DOCUMENT} from '@angular/common';
import { darkStyle } from './map-dark-style';

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {
  @ViewChild('mapCanvas', { static: true }) mapElement: ElementRef;

  @ViewChild('animation', { static: true }) animationEffect : ElementRef;
  pageHeader: String = 'Location';
  paymentDone: boolean = false;
  locationSelected : boolean = false;

  locations = [
    {"name" : "McDonalds", "imgUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F4%2F4b%2FMcDonald%2527s_logo.svg%2F220px-McDonald%2527s_logo.svg.png&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMcDonald%2527s&tbnid=vHOwZP6qyoY5OM&vet=12ahUKEwj-0ZTA9IXvAhWRsksFHbqzAaMQMygKegUIARC8AQ..i&docid=tg3qNrQIjRxkLM&w=220&h=167&itg=1&q=mcd&ved=2ahUKEwj-0ZTA9IXvAhWRsksFHbqzAaMQMygKegUIARC8AQ"},
    {"name" : "BurgerKing", "imgUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F4%2F4b%2FMcDonald%2527s_logo.svg%2F220px-McDonald%2527s_logo.svg.png&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMcDonald%2527s&tbnid=vHOwZP6qyoY5OM&vet=12ahUKEwj-0ZTA9IXvAhWRsksFHbqzAaMQMygKegUIARC8AQ..i&docid=tg3qNrQIjRxkLM&w=220&h=167&itg=1&q=mcd&ved=2ahUKEwj-0ZTA9IXvAhWRsksFHbqzAaMQMygKegUIARC8AQ"},
    {"name" : "Pertol Pump", "imgUrl": "https://www.google.com/imgres?imgurl=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F4%2F4b%2FMcDonald%2527s_logo.svg%2F220px-McDonald%2527s_logo.svg.png&imgrefurl=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMcDonald%2527s&tbnid=vHOwZP6qyoY5OM&vet=12ahUKEwj-0ZTA9IXvAhWRsksFHbqzAaMQMygKegUIARC8AQ..i&docid=tg3qNrQIjRxkLM&w=220&h=167&itg=1&q=mcd&ved=2ahUKEwj-0ZTA9IXvAhWRsksFHbqzAaMQMygKegUIARC8AQ"}
  ]

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    public confData: ConferenceData,
    public platform: Platform,
    private cdref: ChangeDetectorRef) {}

    ngOnInit() {
      console.log("IN MAPS")
    }
    payBtnClicked() {
      this.pageHeader = 'Payment';
      // make network call and give the user transaction entity to backend
      this.paymentDone = true;
      this.cdref.detectChanges();
      const appEl = this.doc.querySelector('#animation');
      appEl.classList.add('load-complete');
      setTimeout(() => {
        this.doc.getElementById('checkmark').style.display='block';
      }, 2000);
    }

    onLocationSelect(location: any) {
      console.log(location)
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

