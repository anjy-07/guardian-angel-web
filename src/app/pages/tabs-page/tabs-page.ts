import { Component } from '@angular/core';
import { UserServiceService } from '../../user-service.service';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  constructor(private userService: UserServiceService) { }
  tabsArray = [
    { "tabUrl": "about", "name" : "About", "icon": "information-circle"} ,
    { "tabUrl": "schedule", "name" : "Passbook", "icon": "calendar"}, 
    { "tabUrl": "map", "name" : "Location", "icon": "location"},
  ];
  
  tabsUserArray = [
    { "tabUrl": "about", "name" : "About", "icon": "information-circle"} ,
    { "tabUrl": "schedule", "name" : "Passbook", "icon": "calendar"}, 
    { "tabUrl": "map", "name" : "Location", "icon": "location"},
  ];

  tabsGuardianArray = [
    { "tabUrl": "about", "name" : "About", "icon": "information-circle"},
    { "tabUrl": "schedule", "name" : "Passbook", "icon": "calendar"}, 
  ];

  ngOnInit() {
    this.userService.switchViewSource$.subscribe((userType: string) => {
      this.switchViews(userType);
    });
  }

  switchViews(userType) {
    if(userType == 'user') {
      this.tabsArray = [...this.tabsUserArray];
    } else {
      this.tabsArray = [...this.tabsGuardianArray];
    }
  }
}
