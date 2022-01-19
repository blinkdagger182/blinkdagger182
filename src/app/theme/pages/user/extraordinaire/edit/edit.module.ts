
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ExorEditComponent } from './edit.component';
import { POST_Service } from '../../../../api/post.service';
import { GET_Service } from '../../../../api/get.service';
import { ContactSearchService } from './contact-search.service';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    declarations: [ExorEditComponent],
    exports: [ExorEditComponent, RouterModule],
    providers: [POST_Service, GET_Service, ContactSearchService]
    // providers:[CountdownPipe]
})
export class ExOrEditModule { }
