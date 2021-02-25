import { Component } from '@angular/core';
import { UserServiceService } from '../../user-service.service';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  constructor(private userService: UserServiceService) { }
  tabsArray = [
    { "tabUrl": "schedule", "name" : "Passbook", "icon": "calendar"}, 
    { "tabUrl": "map", "name" : "Location", "icon": "location"},
    { "tabUrl": "about", "name" : "About", "icon": "information-circle"} 
  ];
  
  tabsUserArray = [
    { "tabUrl": "schedule", "name" : "Passbook", "icon": "calendar"}, 
    { "tabUrl": "map", "name" : "Location", "icon": "location"},
    { "tabUrl": "about", "name" : "About", "icon": "information-circle"} 
  ];

  tabsGuardianArray = [
    { "tabUrl": "schedule", "name" : "Passbook", "icon": "calendar"}, 
    { "tabUrl": "about", "name" : "About", "icon": "information-circle"} 
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
