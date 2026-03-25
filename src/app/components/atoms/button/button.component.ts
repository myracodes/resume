import { Component, Input } from "@angular/core";

@Component({
    selector: "app-button",
    templateUrl: "./button.component.html",
    styleUrls: ["./button.component.scss"],
})
export class ButtonComponent {
    @Input() type: "button" | "submit" | "reset" = "button";
    @Input() disabled: boolean = false;
    @Input() variant: "primary" | "secondary" | "ghost" = "primary";
    @Input() ariaLabel: string = "";
    @Input() buttonId: string = "";
}
