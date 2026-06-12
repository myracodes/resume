import { Component } from "@angular/core";

@Component({
    selector: "app-languages",
    templateUrl: "./languages.component.html",
    styleUrls: ["./languages.component.scss"],
    standalone: false,
})
export class LanguagesComponent {
    languages = [
        {
            lang: $localize`:@@languages.french:Français`,
            level: $localize`:@@languages.frenchLevel:Langue maternelle`,
        },
        {
            lang: $localize`:@@languages.english:Anglais`,
            level: $localize`:@@languages.englishLevel:Maîtrise professionnelle (C1)`,
        },
        {
            lang: $localize`:@@languages.spanish:Espagnol`,
            level: $localize`:@@languages.spanishLevel:Compétence professionnelle limitée (B1/B2)`,
        },
        {
            lang: $localize`:@@languages.japanese:Japonais`,
            level: $localize`:@@languages.japaneseLevel:Notions (A1/A2)`,
        },
        {
            lang: $localize`:@@languages.chinese:Chinois`,
            level: $localize`:@@languages.chineseLevel:Niveau élémentaire (A2), bases académiques (INALCO)`,
        },
    ];
}
