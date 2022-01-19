import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthUserComponent } from './auth.user.component';

const routes: Routes = [
    { path: '', component: AuthUserComponent },
    { path: 'admin', component: AuthUserComponent },// AuthComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {
}