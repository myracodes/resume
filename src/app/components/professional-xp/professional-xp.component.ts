import { Component } from "@angular/core";
import { IDetailsDialog } from "src/app/interfaces/DetailsDialog.interface";

@Component({
    selector: "app-professional-xp",
    templateUrl: "./professional-xp.component.html",
    styleUrls: ["./professional-xp.component.scss"],
})
export class ProfessionalXpComponent {
    detailsAvanade: IDetailsDialog = {
        header: "Chez Avanade",
        content: "plus de détails sur mon xp chez Ava",
        footer: "Footer",
    };
}
