import { Component, Input } from "@angular/core";
import { IDetailsDialog } from "src/app/interfaces/DetailsDialog.interface";

@Component({
    selector: "app-dialog",
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.scss"],
})
export class DialogComponent {
    visible: boolean = false;
    @Input() content!: IDetailsDialog;

    showDialog() {
        this.visible = true;
    }
}
