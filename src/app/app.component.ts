import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { ApiService } from "./services/api.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'winimy-ui';
  message;
  	constructor(private translate: TranslateService, private messagingService: ApiService) {
        translate.setDefaultLang('en');
    }

    ngOnInit() {
      //const userId = '7QkSBkQwO7PgN82FowbLOfx9QTR2';
      this.messagingService.getPermission()
      this.messagingService.receiveMessage()
      this.message = this.messagingService.currentMessage
  }
}
