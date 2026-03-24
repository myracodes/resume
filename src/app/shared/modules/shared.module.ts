import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DialogModule } from "primeng/dialog";

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
