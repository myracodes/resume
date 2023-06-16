import { Component } from "@angular/core";

@Component({
    selector: "app-dialog",
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.scss"],
})
export class DialogComponent {
    visible: boolean = false;
    header!: string;
    content!: any;

    showDialog() {
        this.visible = true;
    }
}
