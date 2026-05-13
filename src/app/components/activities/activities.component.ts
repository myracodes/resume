import { Component } from "@angular/core";

@Component({
    selector: "app-activities",
    templateUrl: "./activities.component.html",
    styleUrls: ["./activities.component.scss"],
    standalone: false,
})
export class ActivitiesComponent {
    sectionTitle = $localize`:@@activities.sectionTitle:Activités`;
}
