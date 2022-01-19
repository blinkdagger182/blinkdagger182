import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Helpers } from "./helpers";

import { GlobalVariable} from "../environments/environment";


import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

declare var $: any;

@Component({
    selector: 'body',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    title = 'app';
    globalBodyClass = 'control-scroll m-page--loading-non-block m-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-aside-left--fixed m-footer--push m-aside--offcanvas-default';


    idleState = 'Not started.';
    timedOut = false;
    lastPing?: Date = null;
    countSecs;

    env = GlobalVariable.ENV_NAME;
    env_prod = false;

    constructor(private _router: Router, private idle: Idle, private keepalive: Keepalive) {

        if(this.env === 'prod'){
            this.env_prod = true;
        }
        else {
            this.env_prod = false;
        }

        // sets an idle timeout of 10 mints
        idle.setIdle(600);
        // sets a timeout period of 60 seconds. after 60 seconds of inactivity, the user will be considered timed out.
        idle.setTimeout(60);
        // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
        idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

        idle.onIdleEnd.subscribe(() => { 
            this.idleState = 'No longer idle.'
            console.log(this.idleState);
            this.reset();
        });
        
        idle.onTimeout.subscribe(() => {
            this.idleState = 'Timed out!';
            this.timedOut = true;
            console.log(this.idleState);
        });
        
        idle.onIdleStart.subscribe(() => {
            this.idleState = 'You\'ve gone idle!'
            console.log(this.idleState);
            $("#openModal").click();
            this.startTimer();
        });
        
        idle.onTimeoutWarning.subscribe((countdown) => {
            this.countSecs = countdown;
            this.idleState = 'You will time out in ' + countdown + ' seconds!';
            // console.log(this.idleState);
        });

        // sets the ping interval to 15 seconds
        keepalive.interval(15);

        keepalive.onPing.subscribe(() => this.lastPing = new Date());

        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(currentUser && !this.env_prod) {
            idle.watch()
            this.timedOut = false;
        }
        else {
            idle.stop();
        }
        // this.reset();
  
    }

    ngOnInit() {
        
        this._router.events.subscribe((route) => {
            if (route instanceof NavigationStart) {
                Helpers.setLoading(true);
                Helpers.bodyClass(this.globalBodyClass);
            }
            if (route instanceof NavigationEnd) {
                Helpers.setLoading(false);
            }
        });
    }

    reset() {
        this.idle.watch();
        this.idleState = 'Started.';
        this.timedOut = false;
    }

    timeLeft;
    interval;

    startTimer() {
        this.timeLeft = 60;
        this.interval = setInterval(() => {
            if(this.timeLeft > 0) {
                this.timeLeft--;
            } else {
                this.idle.stop();
                $('#idleModal').modal('hide');
                this.logout();
            }
        },1000)
    }

    stay() {
        clearInterval(this.interval);
        this.reset();
    }

    logout() {
        clearInterval(this.interval);
        this._router.navigate(['/logout']);
    }
}