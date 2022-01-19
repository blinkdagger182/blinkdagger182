import { NgModule } from '@angular/core';
import { AdmLoadingComponent } from './loading.component';
import { Component } from '@angular/core';

@NgModule({
    exports: [
        AdmLoadingComponent,
    ], declarations: [
        AdmLoadingComponent
    ],
})
export class AdminLoadingModule {
}