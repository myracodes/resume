import { Component } from '@angular/core';
import { IDetailsDialog } from 'src/app/interfaces/DetailsDialog.interface';

@Component({
    selector: 'app-professional-xp',
    templateUrl: './professional-xp.component.html',
    styleUrls: ['./professional-xp.component.scss'],
})
export class ProfessionalXpComponent {
    detailsCapco: IDetailsDialog = {
        header: [
            'Développeuse web front-end',
            'Cap Collectif',
            "avril 2024 - aujourd'hui",
        ],
        paragraphs: [
            "Cap Collectif développe des outils open source d'intelligence collective, sous la forme d'un SaaS.",
            'Les différentes applications du produit : budget participatif, questionnaire, débat, boîte à idées, consultation, etc.',
            "Ma valeur ajoutée sur ce projet : la proactivité dans la réduction de la dette technique et l'amélioration de l'expérience Développeuse.",
            "📌 Une tâche challengeante : le remplacement de l'outil de bundle du Design System, non-maintenu (TSDX) par Rollup.",
            "📌 Une initiative : j'ai pris en charge la mise à jour régulière des librairies afin de diminuer le nombre de failles de sécurité.",
            "📌 Une optimisation clé : j'ai identifié et amélioré les tests flaky les plus fréquents, ce qui a permis de diminuer le taux d'échec, d'économiser des crédits CI, et de faire gagner du temps à l'équipe tech au quotidien.",
            '📌 Une amélioration invisible mais impactante : en supprimant les sources de variabilité comme les images aléatoires et les dates dynamiques dans Storybook, j’ai réduit les faux positifs dans les tests visuels. Cela a permis de diminuer le besoin de validations manuelles inutiles.',
            "Recrutée au poste de développeuse front-end, je n'ai pas hésité à me porter volontaire pour faire des tâches back-end, avec l'assistance de l'IA, afin de réduire la charge de travail de l'équipe back-end.",
        ],
        stack: [
            'ReactJS',
            'Typescript',
            'GraphQL',
            'Next.js',
            'Relay',
            'Storybook',
            'Chromatic',
            'Figma',
            'Cypress',
            'Jest',
            'CircleCI',
            'GitHub',
            'OrbStack',
            'Mac OS',
            'NPM',
            'Yarn',
            'rituels agiles',
            'Sentry',
        ],
    };
    detailsAvanade: IDetailsDialog = {
        header: [
            'Développeuse web front-end',
            'Avanade (ESN)',
            'septembre 2022 - décembre 2023',
        ],
        paragraphs: [
            'Avanade est une ESN, joint-venture entre Microsoft et Accenture',
            "📌 De décembre 2022 à décembre 2023 (pour VEOLIA et la Société des Eaux de Marseille) : portage en Angular d'une application web existante permettant de gérer les abonnements en eau sur toute la France.",
            "L'application permet la gestion des données relatives aux clientes et clients, aux interventions, aux contrats, etc.",
            "Ma valeur ajoutée sur ce projet : la proposition de normes (git flow, conventional commits, approche design system, conventions de nommage, etc.) et l'uniformisation du code, nécessaires sur un projet d'une telle ampleur.",
            "📌 Avant décembre 2022 (en interne) : j'ai participé au développement de divers outils et applications.",
        ],
        stack: [
            'Angular',
            'Typescript',
            'REST',
            'Tailwind CSS',
            'SCSS',
            'NgRx',
            'SCRUM',
            'Azure DevOps',
            'npm',
            'Rituels agiles',
            'SQL',
        ],
    };
    detailsGoodVibes: IDetailsDialog = {
        header: [
            'Développeuse web fullstack',
            'GOOD Vibes',
            'Juillet 2021 - juillet 2022',
        ],
        paragraphs: [
            "GOOD Vibes est un système d'envoi de vidéos personnalisées pour les entreprises, par e-mail et sms.",
            "Le produit comporte une plate-forme admin, qui permet de créer une playlist et de gérer les envois, ainsi qu'un player vidéo interactif.",
            "J'ai travaillé sur 3 projets : la refonte du site vitrine, l'amélioration de la plate-forme, et l'amélioration du \"player\" (le lecteur vidéo et son écosystème).",
            '📌 Le site vitrine a été réalisé en ReactJS.',
            "📌 Les améliorations front-end ont consisté en la proposition de nouvelles maquettes (réalisées sur Figma), ensuite développées en ReactJS et SCSS avec Storybook, ainsi que le développement d'une galerie de composants réutilisables. Pour éviter toute régression visuelle, une validation des écrans sur Chromatic était obligatoire.",
            "📌 Côté back-end, il s'agissait de correction de bugs.",
            'Chaque fonctionnalité était testée (Cypress & Jest) au moment du développement, et les erreurs monitorées sur Sentry.',
            "📌 J'ai mis à profit mes compétences en gestion de projet pour améliorer les processus internes et la documentation du code.",
        ],
        stack: [
            'ReactJS',
            'Typescript',
            'Storybook',
            'Chromatic',
            'Node.js',
            'Netlify',
            'Cypress',
            'Jest',
            'GitHub',
            'Figma',
            'yarn',
            'Sentry',
            'AppDrag',
            'SQL',
        ],
    };
    detailsVisigo: IDetailsDialog = {
        header: [
            'Chargée de projets web',
            'Visigo',
            'Juillet 2021 - juillet 2022',
        ],
        paragraphs: [
            "📌 J'ai œuvré à la mise à jour et l'optimisation du site internet.",
            "Avec l'aide d'un consultant spécialisé, j'ai effectué un diagnostic de l'existant et cherché les améliorations possibles pour le référencement, notamment avec les outils de la suite Google (Lighthouse, Search Console, Analytics).",
            "J'ai travaillé avec une graphiste à la refonte de certaines pages, que j'ai mises à jour en implémentant les nouveaux designs et en améliorant le responsive design.",
            "J'ai également corrigé et amélioré le contenu éditorial (notamment la syntaxe et l'orthographe).",
            "📌 Afin d'améliorer la fluidité des processus internes, j'ai mis en place de nouveaux outils, et formé l'équipe à leur utilisation.",
        ],
        stack: [
            'Google Analytics',
            'Google Lighthouse',
            'Google Search Console',
            'Référencement',
            'SEO',
            'HTML',
            'CSS',
            'AppDrag',
        ],
    };
    detailsGapYear: IDetailsDialog = {
        header: ['Développement personnel', '', 'Novembre 2018 - juillet 2021'],
        paragraphs: [
            "📌 Après l'obtention de mon Master, j'ai souhaité faire une année de césure afin de voyager et de développer mes projets personnels.",
            "Mon visa Vacances-Travail en poche, je me suis rendue au Canada pour 2 ans (durée raccourcie en raison de la pandémie 😷). Sur place, j'ai voyagé et occupé divers postes : commise en boulangerie, professoresse de français (pour anglophones), et nanny dans une famille Canadienne.",
            "J'ai été guitariste dans un groupe de rock 60's à Montréal, et chanteuse-guitariste dans un duo de bluegrass (musique traditionnelle américaine).",
            "Durant ces deux années, j'ai voyagé seule au Canada, aux Etats-Unis, en Europe, et en France.",
            "📌 De retour du Canada, j'ai co-fondé l'association Pourvoir Féministe, laboratoires d'idées et d'actions, en lien avec des chercheuses et spécialistes des questions politiques et féministes.",
            "📌 J'ai également participé à l'organisation et la coordination d'événements féministes.",
            "📌 C'est durant cette période que j'ai commencé à m'autoformer afin de lancer ma reconversion professionnelle et de devenir développeuse web.",
        ],
        stack: [
            'Bénévolat',
            'Voyages',
            'Développement de projets',
            "Organisation d'événements",
            'Rédaction de documents',
            'Cours de français',
            'Guitare & chant',
        ],
    };
    detailsBnpParibas: IDetailsDialog = {
        header: [
            'Chargée de projets, communication, et événements',
            'BNP Paribas',
            'Septembre 2015 - octobre 2018',
        ],
        paragraphs: [
            "Poste occupé dans 3 entités différentes du Groupe. A chaque fois, en charge de l'organisation de nombreux événements ainsi que de la communication digitale.",
            "📌 A la Fondation (mécénat d'entreprise) - de 2017 à 2018",
            "J'ai organisé plus de 130 soirées de relations publiques partout en France (et quelques événements à l'étranger) : concerts et festivals musicaux, avant-premières à l'Opéra national de Paris, spectacles de cirque nouveau, magie nouvelle, danse contemporaine.",
            "J'ai également participé à la création du Dansathon, premier hackathon mêlant danse et technologie, durant 3 jours, à Lyon (France), Liège (Belgique) et Londres (Royaume-Uni).",
            "En plus de ces missions, j'ai participé au suivi du lien avec les artistes soutenu·es par la Fondation ainsi qu'à la communication digitale autour de leurs actualités.",
            '📌 Chez LEGAL (fonction Juridique) - de 2016 à 2017',
            "En charge de la production et publication quotidienne du contenu éditorial : entretiens, portraits, nouveautés et actualités juridiques, images d'illustration, etc.",
            "Je prenais également en charge l'organisation des événements : séminaires, collectes caritatives, team buildings, journées d'accueil, salons de recrutement, etc.",
            "Afin d'améliorer la fluidité du travail et la performance des équipes, j'ai pu développer de nouveaux outils (tels que le réseau social interne) et former les équipes à son utilisation.",
            '📌 Au sein de Group Procurement (fonction Achats) - de 2015 à 2016',
            "En binôme avec ma responsable, j'ai organisé tous les événements de la filière Achats en France et à l'étranger pour le Groupe. Des événements caritatifs (collectes de dons et de fonds pour des associations nationales) aux séminaires avec les responsables Achats à l'étranger, en passant par les journées d'accueil des nouveaux et nouvelles arrivantes et les teams buildings des différentes équipes.",
            "J'ai également développé (architecture et design) le réseau social interne, promu son utilisation et formé les équipes.",
        ],
        stack: [
            "Organisation d'événements",
            'Communication interne & externe',
            'Acculturation digitale',
        ],
    };
    detailsOtherExperiences: IDetailsDialog = {
        header: ['Bénévolat et jobs étudiants', '', 'Depuis 2010'],
        paragraphs: [
            '📌 Vendeuse (les week-ends et vacances scolaires) pendant mes études',
            "📌 Baby-sitter (10 ans d'expérience)",
            "📌 Photographe éditrice bénévole au sein d'associations (concerts et événements)",
            '📌 Correctrice-relectrice bénévole pour divers médias',
            "📌 Régie plateau bénévole d'une compagnie de théâtre",
            '📌 Organisation de collectes (Restos du Coeur et Téléthon)',
        ],
        stack: [
            'Sens des responsabilités',
            'Sens du partage',
            'Solidarité',
            "Production & édition d'images",
            'Relation client',
            'Autonomie',
            'Gestion financière',
        ],
    };
}
