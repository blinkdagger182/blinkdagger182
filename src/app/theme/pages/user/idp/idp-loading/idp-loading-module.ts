import { NgModule } from '@angular/core';
import { IDPLoadingComponent } from './idp-loading-component';
import { Component } from '@angular/core';

@NgModule({
    exports: [
        IDPLoadingComponent,
    ], declarations: [
        IDPLoadingComponent
    ],
})
export class IDPLoadingModule {
}