import { Component } from "@angular/core";
import { GIT_HASH } from "../version";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    standalone: false
})
export class AppComponent {
    title = "myracodes-resume";
    version = GIT_HASH;
}
