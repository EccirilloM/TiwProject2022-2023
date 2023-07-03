import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  isUserSearchEnabled: boolean = false;
  
  toggleUserThreadSearch() {
    this.isUserSearchEnabled = !this.isUserSearchEnabled;
    console.log(`User filter enabled: ${this.isUserSearchEnabled}`);
  }
  
  ngOnInit(): void {
    console.log("OnInit SearchComponent");
  }

}
