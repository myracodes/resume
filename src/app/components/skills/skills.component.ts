import { Component } from "@angular/core";

@Component({
    selector: "app-skills",
    templateUrl: "./skills.component.html",
    styleUrls: ["./skills.component.scss"],
    standalone: false,
})
export class SkillsComponent {
    sectionTitle = $localize`:@@skills.sectionTitle:Compétences`;

    professionalSkills = [
        {
            sectionTitle: "Front-end",
            skills: [
                "ReactJS",
                "Angular",
                "Next.js",
                "JavaScript",
                "TypeScript",
                "Storybook",
                "Chromatic",
            ],
        },
        {
            sectionTitle: $localize`:@@skills.designAndCss:Design et CSS`,
            skills: [
                "Tailwind",
                "SCSS",
                $localize`:@@skills.libraries:librairies (PrimeNG, Mantine, etc.)`,
                "Custom Design System",
                $localize`:@@skills.uxUiPerfectionism:perfectionnisme UX/UI`,
                $localize`:@@skills.accessibility:accessibilité (WCAG, ARIA)`,
            ],
        },
        { sectionTitle: "Back-end", skills: ["Node.js", "PHP"] },
        {
            sectionTitle: $localize`:@@skills.prototyping:Maquettage`,
            skills: ["Figma", "Photoshop"],
        },
        {
            sectionTitle: $localize`:@@skills.testing:Tests`,
            skills: ["Cypress", "Jest", "Jasmine"],
        },
        {
            sectionTitle: $localize`:@@skills.methodology:Méthodologie`,
            skills: ["SCRUM", "agile", "pair programming", "code reviews"],
        },
        {
            sectionTitle: $localize`:@@skills.techWatch:Veille`,
            skills: ["meetups", $localize`:@@skills.conferences:conférences`],
        },
        {
            sectionTitle: "Certifications",
            skills: ["Microsoft AZ-900", "Microsoft PL-900"],
        },
        {
            sectionTitle: $localize`:@@skills.communitySharing:Partage`,
            skills: [
                $localize`:@@skills.ladiesOfCode:oratrice Ladies of Code Paris`,
            ],
        },
    ];

    personalSkills = [
        {
            sectionTitle: $localize`:@@skills.continuousImprovement:Amélioration continue`,
            skills: [
                $localize`:@@skills.continuousImprovementDesc:identification et mise en œuvre d’améliorations dans les processus et le code.`,
            ],
        },
        {
            sectionTitle: $localize`:@@skills.attentionToDetail:Sens du détail`,
            skills: [
                $localize`:@@skills.attentionToDetailDesc:attention élevée à la qualité, à la précision, et aux bonnes pratiques.`,
            ],
        },
        {
            sectionTitle: $localize`:@@skills.curiosity:Curiosité`,
            skills: [
                $localize`:@@skills.curiosityDesc:goût pour l’expérimentation, y compris sur des sujets inconnus.`,
            ],
        },
        {
            sectionTitle: $localize`:@@skills.longTermVision:Vision long terme`,
            skills: [
                $localize`:@@skills.longTermVisionDesc:documentation, maintenabilité des solutions, et prévention de la dette technique.`,
            ],
        },
        {
            sectionTitle: $localize`:@@skills.systemsThinking:Pensée systémique`,
            skills: [
                $localize`:@@skills.systemsThinkingDesc:approche globale pour anticiper les impacts et les dépendances.`,
            ],
        },
        {
            sectionTitle: $localize`:@@skills.communication:Communication`,
            skills: [
                $localize`:@@skills.communicationDesc:excellente maîtrise de l’expression écrite (FR/EN) ; communication claire et structurée avec toutes les équipes.`,
            ],
        },
    ];
}
