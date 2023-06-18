import { Component, ElementRef, HostListener, Input } from "@angular/core";
import { IDetailsDialog } from "src/app/interfaces/DetailsDialog.interface";
import { closeOnClickOutside } from "src/app/shared/utils/mouseEvent.utils";

@Component({
    selector: "app-dialog",
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.scss"],
})
export class DialogComponent {
    elementRef: any;
    isVisible: boolean = false;

    @Input() content!: IDetailsDialog;
    constructor(myElement: ElementRef) {
        this.elementRef = myElement;
    }

    ngOnInit() {}

    showDialog() {
        this.isVisible = true;
    }

    @HostListener("document:mousedown", ["$event"]) clickFct(event: any) {
        const close = closeOnClickOutside(event, this.elementRef.nativeElement);
        if (close) {
            this.isVisible = false;
        }
    }
}
