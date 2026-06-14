import { Component, ElementRef } from "@angular/core";
import { GIT_HASH } from "../version";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
    standalone: false
})
export class AppComponent {
    title = "myracodes-resume";
    version = GIT_HASH;

    activeSections: string[] = ["xp"];

    xpSectionTitle = $localize`:@@xp.sectionTitle:Expérience professionnelle`;
    educationSectionTitle = $localize`:@@education.sectionTitle:Formation`;
    skillsSectionTitle = $localize`:@@skills.sectionTitle:Compétences`;
    languagesSectionTitle = $localize`:@@languages.sectionTitle:Langues`;
    activitiesSectionTitle = $localize`:@@activities.sectionTitle:Activités`;

    constructor(private elementRef: ElementRef<HTMLElement>) {}

    // iOS/WebKit can leave the accordion panel's painted layer stuck at its
    // pre-animation (near-zero) bounds after the open/close animation, so
    // the new content stays clipped until the element leaves and re-enters
    // the viewport. Toggling `display` forces WebKit to discard that stale
    // layer and repaint the element at its current size. The display change
    // and its revert happen synchronously in the same task, so the browser
    // never paints the intermediate `display: none` state.
    onAccordionToggle(): void {
        setTimeout(() => {
            const panels = this.elementRef.nativeElement.querySelectorAll<HTMLElement>(".p-accordioncontent");
            panels.forEach((panel) => {
                panel.style.display = "none";
                void panel.offsetHeight;
                panel.style.display = "";
            });
        }, 450);
    }
}
