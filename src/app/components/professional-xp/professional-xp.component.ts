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
            "septembre 2022 - aujourd'hui",
        ],
        paragraphs: [
            "De décembre 2022 à aujourd'hui : portage d'une application web pour la Société des Eaux de Marseille / VEOLIA.",
            "Implémentation des webservices pour créer, afficher, éditer, et supprimer les données (reactive form).",
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
    detailsGoodVibes: IDetailsDialog = {
        header: [
            "Développeuse web fullstack",
            "GOOD Vibes",
            "Juillet 2021 - juillet 2022",
        ],
        paragraphs: ["", ""],
        footer: [
            "ReactJS",
            "Typescript",
            "Storybook",
            "Chromatic",
            "NodeJS",
            "AppDrag",
            "SQL",
            "Netlify",
            "Cypress",
            "Jest",
            "Sentry",
            "GitHub",
            "Figma",
        ],
    };
    detailsVisigo: IDetailsDialog = {
        header: [
            "Chargée de projets web",
            "Visigo",
            "Juillet 2021 - juillet 2022",
        ],
        paragraphs: ["", ""],
        footer: [
            "Google Analytics",
            "Google Lighthouse",
            "Google Search Console",
            "HTML",
            "CSS",
            "AppDrag",
        ],
    };
    detailsGapYear: IDetailsDialog = {
        header: ["Développement personnel", "", "Novembre 2018 - juillet 2021"],
        paragraphs: [
            "Permis Vacances-Travail au Canada (raccourci par la pandémie 😷)",
            "Voyages : Canada, Etats-Unis, Europe et France",
            "Co-fondation de Pourvoir Féministe, laboratoires d'idées et d'actions féministes",
            "Organisation et coordinations d'événements féministes",
            "Projets musicaux (guitariste dans un groupe de rock 60's au Canada)",
            "Cours de français (grammaire & conjugaison)",
        ],
        footer: [
            "Bénévolat",
            "Voyages",
            "Développement de projets",
            "Organisation d'événements",
            "Rédaction de documents divers",
            "Cours de français",
            "Guitare & chant",
        ],
    };
    detailsBnpParibas: IDetailsDialog = {
        header: [
            "Chargée de projets, communication, et événements",
            "BNP Paribas",
            "Septembre 2015 - octobre 2018",
        ],
        paragraphs: [
            "Organisation d'événements divers (séminaires de managers, team buildings, journées d'accueil des collaborateur·ices, formations, etc.)",
            "Formation des collaborateur·ices aux outils digitaux",
        ],
        footer: [""],
    };
    detailsOtherExperiences: IDetailsDialog = {
        header: ["Bénévolat et jobs étudiants", "", "Depuis 2010"],
        paragraphs: [
            "Vendeuse (les samedis et vacances scolaires) pendant mes études",
            "Baby-sitter (10 ans d'expérience)",
            "Photographe éditrice bénévole",
            "Correctrice-relectrice pour divers médias",
            "Régie plateau bénévole d'une compagnie de théâtre",
            "Organisation de collectes (Restos du Coeur et Téléthon)",
        ],
        footer: [
            "Sens des responsabilités",
            "Sens du partage",
            "Solidarité",
            "Production & édition d'images",
            "Relation client",
            "Autonomie",
            "Gestion financière",
        ],
    };
}
