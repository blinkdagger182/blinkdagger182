// Angular Imports
import { NgModule } from '@angular/core';

// This Module's Components
import { NominationLoadingComponent } from './nomination-loading.component';

@NgModule({
    declarations: [
        NominationLoadingComponent,
    ],
    exports: [
        NominationLoadingComponent,
    ]
})
export class NominationLoadingModule {

}
