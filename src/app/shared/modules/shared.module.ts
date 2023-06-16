import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { DialogModule } from "primeng/dialog";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

const ANGULAR_MODULE = [BrowserAnimationsModule];

const PRIMENG = [DialogModule];

@NgModule({
    declarations: [],
    imports: [ANGULAR_MODULE, PRIMENG],
    exports: [ANGULAR_MODULE, PRIMENG],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
