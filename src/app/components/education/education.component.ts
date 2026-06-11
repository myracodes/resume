import { Component } from "@angular/core";

@Component({
    selector: "app-education",
    templateUrl: "./education.component.html",
    styleUrls: ["./education.component.scss"],
    standalone: false,
})
export class EducationComponent {
    sectionTitle = $localize`:@@education.sectionTitle:Formation`;

    wildCodeSchoolSkills = [
        "Microservices",
        $localize`:@@education.authentication:authentification`,
        $localize`:@@education.deployment:déploiement`,
        $localize`:@@education.security:sécurité`,
        "SCRUM",
        "DevOps",
        $localize`:@@education.continuousIntegration:intégration continue`,
        $localize`:@@education.mobileDevelopment:développement mobile`,
    ];
    ironhackSkills = [
        "HTML",
        "CSS",
        "Javascript",
        "Node.js",
        "Express",
        "MongoDB",
        "ReactJS",
    ];
    autoformationSkills = ["HTML", "CSS", "Javascript"];
}
