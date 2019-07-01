import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../services/api.service";

@Component({
  selector: 'app-send-notifications',
  templateUrl: './send-notifications.component.html',
  styleUrls: ['./send-notifications.component.css']
})
export class SendNotificationsComponent implements OnInit {
  pushMsgForm: FormGroup;
  invalidRegister: boolean = false;
  successMsg: string;
  errorMsg: string;
  devices: any;
  userToken: String;
  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
  	this.pushMsgForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      devices: ['', Validators.required]
    });

    this.getDevices()
    this.userToken = localStorage.getItem('token')
  }

  /**
   * FCM push notifications post request
   */
  onSubmit() {
    if (this.pushMsgForm.invalid) {
      return;
    }
    this.invalidRegister = false
    
    const fcmPayload = {
      title: this.pushMsgForm.controls.title.value,
      body: this.pushMsgForm.controls.body.value,
      devices: this.pushMsgForm.controls.devices.value
    }
    this.apiService.post('users/sendnotifications', fcmPayload)
    .subscribe(data => {
      if(data && data.status == 201){
      	this.successMsg = "Push notification sent successfully."
      }else{
      	this.errorMsg = data.message
      }
    },(err: any) => {
      this.invalidRegister = true;
      console.log(err)
      this.errorMsg = err
    });
  }

  /**
   * Get registered FCM device tokens
   */
   getDevices(){
	   	this.apiService.get('users/getdevices')
	    .subscribe(data => {
	      if(data && data.status == 201){
	      	this.devices = data.result
	      }
	    },(err: any) => {
	      console.log(err)
	    });
   }

}
