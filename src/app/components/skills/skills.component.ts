import { Component } from '@angular/core';

@Component({
    selector: 'app-skills',
    templateUrl: './skills.component.html',
    styleUrls: ['./skills.component.scss'],
})
export class SkillsComponent {
    professionalSkills = [
        {
            sectionTitle: 'Front-end',
            skills: [
                'ReactJS',
                'Angular',
                'Typescript',
                'Storybook',
                'Chromatic',
                'Next.js',
            ],
        },
        {
            sectionTitle: 'CSS & composants',
            skills: [
                'CSS vanilla',
                'Tailwind CSS',
                'SCSS',
                'PrimeNG',
                'Mantine',
                'Custom Design System',
                'sensibilité UX/UI',
            ],
        },
        { sectionTitle: 'Back-end', skills: ['Node.js', 'PHP'] },
        { sectionTitle: 'Maquettage', skills: ['Figma', 'Photoshop'] },
        { sectionTitle: 'Tests', skills: ['Cypress', 'Jest', 'Jasmine'] },
        {
            sectionTitle: 'Méthodologie',
            skills: ['SCRUM', 'agile', 'pair programming', 'code reviews'],
        },
        { sectionTitle: 'Veille', skills: ['meetups', 'conférences'] },
        { sectionTitle: 'Certifications', skills: ['AZ-900', 'PL-900'] },
        { sectionTitle: 'Partage', skills: ['oratrice Ladies of Code Paris'] },
    ];

    personalSkills = [
        'organisation',
        'sens des responsabilités',
        'sens du service',
        'esprit d’équipe',
        'amélioration continue',
        'attention au détail',
        'autonomie',
        'goût de l’apprentissage',
        'orthographe (FR/EN)',
        'vision long terme',
        'flexibilité',
    ];
}
