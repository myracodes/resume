import { Component, Input } from "@angular/core";

@Component({
    selector: "app-external-link",
    templateUrl: "./external-link.component.html",
    styleUrls: ["./external-link.component.scss"],
    standalone: false
})
export class ExternalLinkComponent {
    @Input() href!: string;
    @Input() target: string = "_blank";
    @Input() rel: string = "noopener noreferrer";
    @Input() ariaLabel?: string;
}
