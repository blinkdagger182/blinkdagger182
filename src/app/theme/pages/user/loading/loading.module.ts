import { NgModule } from '@angular/core';
import { UserLoadingComponent } from './loading.component';
import { Component } from '@angular/core';

@NgModule({
    exports: [
        UserLoadingComponent,
    ], declarations: [
        UserLoadingComponent
    ],
})
export class UserLoadingModule {
}