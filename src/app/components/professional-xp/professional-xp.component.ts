import { Component } from "@angular/core";
import { IDetailsDialog } from "src/app/interfaces/DetailsDialog.interface";

@Component({
    selector: "app-professional-xp",
    templateUrl: "./professional-xp.component.html",
    styleUrls: ["./professional-xp.component.scss"],
    standalone: false,
})
export class ProfessionalXpComponent {
    sectionTitle = $localize`:@@xp.sectionTitle:Expérience professionnelle`;
    otherExperiencesLabel = $localize`:@@xp.otherExperiencesLabel:Voir plus d'expériences`;

    detailsCapco: IDetailsDialog = {
        header: [
            $localize`:@@xp.role.frontEndDev:Développeuse web front-end`,
            "Cap Collectif",
            $localize`:@@xp.capco.dialog.dates:avril 2024 - aujourd'hui`,
        ],
        paragraphs: [
            $localize`:@@xp.capco.dialog.p1:Cap Collectif développe des outils open source d'intelligence collective, sous la forme d'un SaaS.`,
            $localize`:@@xp.capco.dialog.p2:Les différentes applications du produit : budget participatif, questionnaire, débat, boîte à idées, consultation, etc.`,
            $localize`:@@xp.capco.dialog.p3:⭐️ Ma valeur ajoutée : la proactivité dans la réduction de la dette technique, la réduction des coûts, et l'amélioration de l'expérience Développeuse.`,
            $localize`:@@xp.capco.dialog.p4:📌 Une initiative : j'ai suggéré et pris en charge la correction régulière des failles de sécurité.`,
            $localize`:@@xp.capco.dialog.p5:📌 Une optimisation clé : j'ai réorganisé les tests et corrigé "flaky" en priorisant ceux qui échouaient le plus fréquemment, ce qui a permis d'économiser des crédits CI, et de faire gagner du temps à l'équipe tech au quotidien (diminution de 33% de la durée moyenne d'une CI).`,
            $localize`:@@xp.capco.dialog.p6:📌 Une amélioration invisible mais impactante : en supprimant les sources de variabilité comme les images aléatoires et les dates dynamiques dans Storybook, j'ai réduit les faux positifs dans les tests visuels. Cela a permis de diminuer le besoin de validations manuelles.`,
            $localize`:@@xp.capco.dialog.p7:📌 Une tâche challengeante : le remplacement de l'outil de bundle du Design System, non-maintenu (TSDX) par Rollup.`,
            $localize`:@@xp.capco.dialog.p8:Recrutée au poste de développeuse front-end, je n'ai pas hésité à me porter volontaire pour des tâches back-end, avec l'assistance de l'IA, afin de réduire la charge de travail de l'équipe.`,
        ],
        stack: [
            "ReactJS",
            "TypeScript",
            "GraphQL",
            "Next.js",
            "Relay",
            "react-hook-form",
            "Storybook",
            "Chromatic",
            "Figma",
            "Cypress",
            "CircleCI",
            "GitHub",
            "OrbStack",
            "NPM",
            $localize`:@@xp.stack.agileRituals:Rituels Agiles`,
            "Claude Code",
        ],
    };
    detailsAvanade: IDetailsDialog = {
        header: [
            $localize`:@@xp.role.frontEndDev:Développeuse web front-end`,
            "Avanade (ESN)",
            $localize`:@@xp.avanade.dialog.dates:septembre 2022 - décembre 2023`,
        ],
        paragraphs: [
            $localize`:@@xp.avanade.dialog.p1:Avanade est une ESN, joint-venture entre Microsoft et Accenture`,
            $localize`:@@xp.avanade.dialog.p2:📌 De décembre 2022 à décembre 2023 (pour VEOLIA et la Société des Eaux de Marseille) : portage en Angular d'une application web existante permettant de gérer les abonnements en eau sur toute la France.`,
            $localize`:@@xp.avanade.dialog.p3:L'application permet la gestion des données relatives aux clientes et clients, aux interventions, aux contrats, etc.`,
            $localize`:@@xp.avanade.dialog.p4:⭐️ Ma valeur ajoutée : proposer l'adoption de normes (git flow, conventional commits, approche design system, conventions de nommage, etc.) et l'uniformisation du code, nécessaires sur un projet d'une telle ampleur.`,
            $localize`:@@xp.avanade.dialog.p5:📌 Avant décembre 2022 (en interne) : j'ai participé au développement de divers outils et applications.`,
        ],
        stack: [
            "Angular",
            "TypeScript",
            "REST",
            "Tailwind CSS",
            "SCSS",
            "NgRx",
            "SCRUM",
            "Azure DevOps",
            $localize`:@@xp.stack.agileRituals:Rituels Agiles`,
            "SQL",
            "Figma",
            "Adobe XD",
        ],
    };
    detailsGoodVibes: IDetailsDialog = {
        header: [
            $localize`:@@xp.role.fullstackDev:Développeuse web fullstack`,
            "GOOD Vibes",
            $localize`:@@xp.goodVibes.dialog.dates:Juillet 2021 - juillet 2022`,
        ],
        paragraphs: [
            $localize`:@@xp.goodVibes.dialog.p1:GOOD Vibes est un système d'envoi de vidéos personnalisées pour les entreprises, par e-mail et sms.`,
            $localize`:@@xp.goodVibes.dialog.p2:Le produit comporte une plate-forme admin, qui permet de créer une playlist et de gérer les envois, ainsi qu'un player vidéo interactif.`,
            $localize`:@@xp.goodVibes.dialog.p3:J'ai travaillé sur 3 projets : la refonte du site vitrine, l'amélioration de la plate-forme, et l'amélioration du "player" (le lecteur vidéo et son écosystème).`,
            $localize`:@@xp.goodVibes.dialog.p4:📌 Le site vitrine a été réalisé en ReactJS.`,
            $localize`:@@xp.goodVibes.dialog.p5:📌 Les améliorations front-end ont consisté en la proposition de nouvelles maquettes (réalisées sur Figma), ensuite développées en ReactJS et SCSS avec Storybook, ainsi que le développement d'une galerie de composants réutilisables. Pour éviter toute régression visuelle, une validation des écrans sur Chromatic était obligatoire.`,
            $localize`:@@xp.goodVibes.dialog.p6:📌 Côté back-end, il s'agissait de correction de bugs.`,
            $localize`:@@xp.goodVibes.dialog.p7:Chaque fonctionnalité était testée (Cypress & Jest) au moment du développement, et les erreurs monitorées sur Sentry.`,
            $localize`:@@xp.goodVibes.dialog.p8:📌 J'ai mis à profit mes compétences en gestion de projet pour améliorer les processus internes et la documentation du code.`,
        ],
        stack: [
            "ReactJS",
            "TypeScript",
            "Storybook",
            "Chromatic",
            "Node.js",
            "Netlify",
            "Cypress",
            "Jest",
            "GitHub",
            "Figma",
            "Sentry",
            "AppDrag",
            "SQL",
            $localize`:@@xp.goodVibes.stack.asyncWork:Travail asynchrone France - USA`,
        ],
    };
    detailsVisigo: IDetailsDialog = {
        header: [
            $localize`:@@xp.role.webProjectManager:Chargée de projets web`,
            "Visigo",
            $localize`:@@xp.visigo.dialog.dates:Juillet 2021 - juillet 2022`,
        ],
        paragraphs: [
            $localize`:@@xp.visigo.dialog.p1:📌 J'ai œuvré à la mise à jour et l'optimisation du site internet.`,
            $localize`:@@xp.visigo.dialog.p2:Avec l'aide d'un consultant spécialisé, j'ai effectué un diagnostic de l'existant et cherché les améliorations possibles pour le référencement, notamment avec les outils de la suite Google (Lighthouse, Search Console, Analytics).`,
            $localize`:@@xp.visigo.dialog.p3:J'ai travaillé avec une graphiste à la refonte de certaines pages, que j'ai mises à jour en implémentant les nouveaux designs et en améliorant le responsive design.`,
            $localize`:@@xp.visigo.dialog.p4:J'ai également corrigé et amélioré le contenu éditorial (notamment la syntaxe et l'orthographe).`,
            $localize`:@@xp.visigo.dialog.p5:📌 Afin d'améliorer la fluidité des processus internes, j'ai mis en place de nouveaux outils, et formé l'équipe à leur utilisation.`,
        ],
        stack: [
            "Google Analytics",
            "Google Lighthouse",
            "Google Search Console",
            $localize`:@@xp.stack.seo:Référencement`,
            "SEO",
            "HTML",
            "CSS",
            "AppDrag",
        ],
    };
    detailsGapYear: IDetailsDialog = {
        header: [
            $localize`:@@xp.role.personalDev:Développement personnel`,
            "",
            $localize`:@@xp.gapYear.dialog.dates:Novembre 2018 - juillet 2021`,
        ],
        paragraphs: [
            $localize`:@@xp.gapYear.dialog.p1:📌 Après l'obtention de mon Master, j'ai souhaité faire une année de césure afin de voyager et de développer mes projets personnels.`,
            $localize`:@@xp.gapYear.dialog.p2:Mon visa Vacances-Travail en poche, je me suis rendue au Canada pour 2 ans (durée raccourcie en raison de la pandémie 😷). Sur place, j'ai voyagé et occupé divers postes : commise en boulangerie, professoresse de français (pour anglophones), et nanny dans une famille Canadienne.`,
            $localize`:@@xp.gapYear.dialog.p3:J'ai été guitariste dans un groupe de rock 60's à Montréal, et chanteuse-guitariste dans un duo de bluegrass (musique traditionnelle américaine).`,
            $localize`:@@xp.gapYear.dialog.p4:Durant ces deux années, j'ai voyagé seule au Canada, aux Etats-Unis, en Europe, et en France.`,
            $localize`:@@xp.gapYear.dialog.p5:📌 De retour du Canada, j'ai co-fondé l'association Pourvoir Féministe, laboratoire d'idées et d'actions, en lien avec des chercheuses et spécialistes des questions politiques et féministes.`,
            $localize`:@@xp.gapYear.dialog.p6:📌 J'ai également participé à l'organisation et la coordination d'événements féministes.`,
            $localize`:@@xp.gapYear.dialog.p7:📌 C'est durant cette période que j'ai commencé à m'autoformer afin de lancer ma reconversion professionnelle et de devenir développeuse web.`,
        ],
        stack: [
            $localize`:@@xp.stack.volunteering:Bénévolat`,
            $localize`:@@xp.stack.travel:Voyages`,
            $localize`:@@xp.stack.projectDev:Développement de projets`,
            $localize`:@@xp.stack.eventOrg:Organisation d'événements`,
            $localize`:@@xp.stack.docWriting:Rédaction de documents`,
            $localize`:@@xp.stack.frenchLessons:Cours de français`,
            $localize`:@@xp.stack.guitarSinging:Guitare & chant`,
        ],
    };
    detailsBnpParibas: IDetailsDialog = {
        header: [
            $localize`:@@xp.role.commsManager:Chargée de projets, communication, et événements`,
            "BNP Paribas",
            $localize`:@@xp.bnp.dialog.dates:Septembre 2015 - octobre 2018`,
        ],
        paragraphs: [
            $localize`:@@xp.bnp.dialog.p1:Poste occupé dans 3 entités différentes du Groupe. A chaque fois, en charge de l'organisation de nombreux événements ainsi que de la communication digitale.`,
            $localize`:@@xp.bnp.dialog.p2:📌 A la Fondation (mécénat d'entreprise) - de 2017 à 2018`,
            $localize`:@@xp.bnp.dialog.p3:J'ai organisé plus de 130 soirées de relations publiques partout en France (et quelques événements à l'étranger) : concerts et festivals musicaux, avant-premières à l'Opéra national de Paris, spectacles de cirque nouveau, magie nouvelle, danse contemporaine.`,
            $localize`:@@xp.bnp.dialog.p4:J'ai également participé à la création du Dansathon, premier hackathon mêlant danse et technologie, durant 3 jours, à Lyon (France), Liège (Belgique) et Londres (Royaume-Uni).`,
            $localize`:@@xp.bnp.dialog.p5:En plus de ces missions, j'ai participé au suivi du lien avec les artistes soutenu·es par la Fondation ainsi qu'à la communication digitale autour de leurs actualités.`,
            $localize`:@@xp.bnp.dialog.p6:📌 Chez LEGAL (fonction Juridique) - de 2016 à 2017`,
            $localize`:@@xp.bnp.dialog.p7:En charge de la production et publication quotidienne du contenu éditorial : entretiens, portraits, nouveautés et actualités juridiques, images d'illustration, etc.`,
            $localize`:@@xp.bnp.dialog.p8:Je prenais également en charge l'organisation des événements : séminaires, collectes caritatives, team buildings, journées d'accueil, salons de recrutement, etc.`,
            $localize`:@@xp.bnp.dialog.p9:Afin d'améliorer la fluidité du travail et la performance des équipes, j'ai pu développer de nouveaux outils (tels que le réseau social interne) et former les équipes à son utilisation.`,
            $localize`:@@xp.bnp.dialog.p10:📌 Au sein de Group Procurement (fonction Achats) - de 2015 à 2016`,
            $localize`:@@xp.bnp.dialog.p11:En binôme avec ma responsable, j'ai organisé tous les événements de la filière Achats en France et à l'étranger pour le Groupe. Des événements caritatifs (collectes de dons et de fonds pour des associations nationales) aux séminaires avec les responsables Achats à l'étranger, en passant par les journées d'accueil des nouveaux et nouvelles arrivantes et les teams buildings des différentes équipes.`,
            $localize`:@@xp.bnp.dialog.p12:J'ai également développé (architecture et design) le réseau social interne, promu son utilisation et formé les équipes.`,
        ],
        stack: [
            $localize`:@@xp.stack.eventOrg:Organisation d'événements`,
            $localize`:@@xp.stack.internalExternalComms:Communication interne & externe`,
            $localize`:@@xp.stack.digitalCulture:Acculturation digitale`,
        ],
    };
    detailsOtherExperiences: IDetailsDialog = {
        header: [
            $localize`:@@xp.role.otherXp:Bénévolat et jobs étudiants`,
            "",
            $localize`:@@xp.other.dialog.dates:Depuis 2010`,
        ],
        paragraphs: [
            $localize`:@@xp.other.dialog.p1:📌 Vendeuse et auxiliaire d'accueil (les week-ends et vacances scolaires) pendant mes études`,
            $localize`:@@xp.other.dialog.p2:📌 Baby-sitter (10 ans d'expérience)`,
            $localize`:@@xp.other.dialog.p3:📌 Photographe éditrice bénévole au sein d'associations (concerts et événements)`,
            $localize`:@@xp.other.dialog.p4:📌 Correctrice-relectrice bénévole pour divers médias`,
            $localize`:@@xp.other.dialog.p5:📌 Régie plateau bénévole d'une compagnie de théâtre`,
            $localize`:@@xp.other.dialog.p6:📌 Organisation de collectes (Restos du Coeur et Téléthon)`,
        ],
        stack: [
            $localize`:@@xp.stack.responsibility:Sens des responsabilités`,
            $localize`:@@xp.stack.sharing:Sens du partage`,
            $localize`:@@xp.stack.solidarity:Solidarité`,
            $localize`:@@xp.stack.photoEditing:Production & édition d'images`,
            $localize`:@@xp.stack.customerRelations:Relation client`,
            $localize`:@@xp.stack.autonomy:Autonomie`,
            $localize`:@@xp.stack.financialManagement:Gestion financière`,
        ],
    };
}
