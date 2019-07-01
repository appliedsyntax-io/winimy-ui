import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { TemplateComponent } from './template/template.component';
import { SendNotificationsComponent } from './send-notifications/send-notifications.component';


const routes: Routes = [
	{path: '', component: TemplateComponent},
  	{path: 'register', component: UserRegistrationComponent},
  	{path: 'notification/create', component: SendNotificationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
