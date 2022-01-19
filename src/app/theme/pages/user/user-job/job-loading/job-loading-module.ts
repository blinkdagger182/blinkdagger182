import { NgModule } from '@angular/core';
import { JobLoadingComponent } from './job-loading-component';
import { Component } from '@angular/core';

@NgModule({
    exports: [
        JobLoadingComponent,
    ], declarations: [
        JobLoadingComponent
    ],
})
export class JobLoadingModule {
}