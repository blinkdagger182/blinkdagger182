import { NgModule } from '@angular/core';
import { mapsLoadingComponent } from './loading.component';
import { Component } from '@angular/core';

@NgModule({
    exports: [
        mapsLoadingComponent,
    ], declarations: [
        mapsLoadingComponent
    ],
})
export class mapsLoadingModule {
}