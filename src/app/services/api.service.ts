import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs/index";
import {ApiResponse} from "../services/api.response";
import { environment } from "../../environments/environment"
import {Router} from "@angular/router";
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class ApiService {
  currentMessage = new BehaviorSubject(null);
  constructor(private http: HttpClient, private router: Router, private db: AngularFireDatabase, private afAuth: AngularFireAuth, private angularFireMessaging: AngularFireMessaging) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
  }

  baseUrl: string = environment.apiBaseUrl;
  
  /**
   * Handle all POST requests
   * @param url Rest API route 
   * @param postBody postBody is a form data
   */
  post(url:any, postBody: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl + url, postBody) 
  }

  /**
   * Handle all GET requests
   * @param url Rest API route 
   */
  get(url:any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + url)
  }

  /**
   * Handle all DELETE requests
   * @param url Rest API route 
   */
  delete(url:any): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + url)
  }

  /**
   * update token in firebase database
   * @param userId userId as a key 
   * @param token token as a value
   */
  updateToken(token) {
    /* this.afAuth.authState.pipe(take(1)).subscribe(() => {
      const data = { "7QkSBkQwO7PgN82FowbLOfx9QTR2": token };
      this.db.object('fcmTokens/').update(data);
    }); */
    let user_id = this.getRandomStr()
    this.post('users/fcmtoken', {token: token})
    .subscribe(res => {
      console.log(res)
      localStorage.setItem('token', token)
      if(res && res.status == 201){
        this.afAuth.authState.pipe(take(1)).subscribe(() => {
          const data = { [res.result._id]: token };
          this.db.object('fcmTokens/').update(data);
        });
        }else{
          console.log("Error")
        }
    },(err: any) => {
      console.log(err)
    });
  }


  /**
   * request permission for notification from firebase cloud messaging
   * @param userId userId
   */
  getPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        this.updateToken(token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
      })
  }

  getRandomStr() {
     let length = 6
     let result = '';
     let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     let charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }

}
