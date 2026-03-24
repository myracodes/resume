import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DialogModule } from "primeng/dialog";
import { ButtonComponent } from "../../components/atoms/button/button.component";

const ANGULAR_MODULE = [BrowserAnimationsModule];

const PRIMENG = [DialogModule];

@NgModule({
    declarations: [ButtonComponent],
    imports: [ANGULAR_MODULE, PRIMENG],
    exports: [ANGULAR_MODULE, PRIMENG, ButtonComponent],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
