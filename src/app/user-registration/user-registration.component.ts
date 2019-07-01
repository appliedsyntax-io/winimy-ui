import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {ApiService} from "../services/api.service";


@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  registerForm: FormGroup;
  invalidRegister: boolean = false;
  successMsg: String;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) { }

  ngOnInit() {
  	this.registerForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      username: ['', Validators.required],
      fname: ['', Validators.required],
      lname: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postcode: ['', Validators.required]
    });
  }

  /**
   * Register post request
   */
  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    this.invalidRegister = false
    this.successMsg = '';
    
    const registerPayload = {
      email: this.registerForm.controls.email.value,
      username: this.registerForm.controls.username.value,
      fname: this.registerForm.controls.fname.value,
      lname: this.registerForm.controls.lname.value,
      address: this.registerForm.controls.address.value,
      city: this.registerForm.controls.city.value,
      country: this.registerForm.controls.country.value,
      postcode: this.registerForm.controls.postcode.value
    }
    this.apiService.post('users/register', registerPayload)
    .subscribe(data => {
      if(data && data.status == 201){
      	this.successMsg = "User registered successfully."
      }
    },(err: any) => {
      this.invalidRegister = true;
      console.log(err)
    });
  }
}
