import { Component } from "@angular/core";

@Component({
    selector: "app-languages",
    templateUrl: "./languages.component.html",
    styleUrls: ["./languages.component.scss"],
    standalone: false,
})
export class LanguagesComponent {
    languages = [
        { lang: "Français", level: "Langue maternelle" },
        { lang: "Anglais", level: "Maîtrise professionnelle (C1)" },
        {
            lang: "Espagnol",
            level: "Compétence professionnelle limitée (B1/B2)",
        },
        { lang: "Japonais", level: "Notions (A1/A2)" },
        {
            lang: "Chinois",
            level: "Niveau élémentaire (A2), bases académiques (INALCO) ",
        },
    ];
}
