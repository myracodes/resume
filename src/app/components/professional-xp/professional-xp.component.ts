import { Component } from "@angular/core";
import { IDetailsDialog } from "src/app/interfaces/DetailsDialog.interface";

@Component({
    selector: "app-professional-xp",
    templateUrl: "./professional-xp.component.html",
    styleUrls: ["./professional-xp.component.scss"],
})
export class ProfessionalXpComponent {
    detailsAvanade: IDetailsDialog = {
        header: [
            "Développeuse web spécialité front-end",
            "Avanade",
            "2022 - aujourd'hui",
        ],
        paragraphs: [
            "Mission principale portage d'une application web pour la Société des Eaux de Marseille / VEOLIA.",
            "Impémentation des webservices pour créer, afficher, éditer, supprimer les données (reactive form) ; ",
            "Valeur ajoutée : proposition de normes (git flow, conventional commits, approche design system, conventions de nommage, etc.), uniformisation du code.",
        ],
        footer: [
            "Angular",
            "Typescript",
            "Tailwind CSS",
            "NgRx",
            "SCRUM",
            "Azure DevOps",
        ],
    };
}
