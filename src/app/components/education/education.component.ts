import { Component } from '@angular/core';

@Component({
    selector: 'app-education',
    templateUrl: './education.component.html',
    styleUrls: ['./education.component.scss'],
})
export class EducationComponent {
    wildCodeSchoolSkills = [
        'Microservices',
        'authentification',
        'déploiement',
        'sécurité',
        'SCRUM',
        'DevOps',
        'intégration continue',
        'développement mobile',
    ];
    ironhackSkills = [
        'HTML',
        'CSS',
        'Javascript',
        'Node.js',
        'Express',
        'MongoDB',
        'ReactJS',
    ];
}
