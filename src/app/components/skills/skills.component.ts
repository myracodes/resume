import { Component } from "@angular/core";

@Component({
    selector: "app-skills",
    templateUrl: "./skills.component.html",
    styleUrls: ["./skills.component.scss"],
    standalone: false,
})
export class SkillsComponent {
    professionalSkills = [
        {
            sectionTitle: "Front-end",
            skills: [
                "ReactJS",
                "Angular",
                "Typescript",
                "Storybook",
                "Chromatic",
                "Next.js",
            ],
        },
        {
            sectionTitle: "Design et CSS",
            skills: [
                "Tailwind",
                "SCSS",
                "librairies (PrimeNG, Mantine, etc.)",
                "Custom Design System",
                "perfectionnisme UX/UI",
            ],
        },
        { sectionTitle: "Back-end", skills: ["Node.js", "PHP"] },
        { sectionTitle: "Maquettage", skills: ["Figma", "Photoshop"] },
        { sectionTitle: "Tests", skills: ["Cypress", "Jest", "Jasmine"] },
        {
            sectionTitle: "Méthodologie",
            skills: ["SCRUM", "agile", "pair programming", "code reviews"],
        },
        { sectionTitle: "Veille", skills: ["meetups", "conférences"] },
        {
            sectionTitle: "Certifications",
            skills: ["Microsoft AZ-900", "Microsoft PL-900"],
        },
        { sectionTitle: "Partage", skills: ["oratrice Ladies of Code Paris"] },
    ];

    personalSkills = [
        {
            sectionTitle: "Amélioration continue",
            skills: [
                "identification et mise en œuvre d’améliorations dans les processus et le code.",
            ],
        },
        {
            sectionTitle: "Sens du détail",
            skills: [
                "attention élevée à la qualité, à la précision, et aux bonnes pratiques.",
            ],
        },
        {
            sectionTitle: "Curiosité",
            skills: [
                "goût pour l'expérimentation, y compris sur des sujets inconnus.",
            ],
        },
        {
            sectionTitle: "Vision long terme",
            skills: [
                "documentation, maintenabilité des solutions, et prévention de la dette technique.",
            ],
        },
        {
            sectionTitle: "Pensée systémique",
            skills: [
                "approche globale pour anticiper les impacts et les dépendances.",
            ],
        },
        {
            sectionTitle: "Communication",
            skills: [
                "excellente maîtrise de l'expression écrite (FR/EN) ; communication claire et structurée avec toutes les équipes.",
            ],
        },
    ];
}
