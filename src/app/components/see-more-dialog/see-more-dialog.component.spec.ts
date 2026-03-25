import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SeeMoreDialogComponent } from "./see-more-dialog.component";

describe("SeeMoreDialogComponent", () => {
    let component: SeeMoreDialogComponent;
    let fixture: ComponentFixture<SeeMoreDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SeeMoreDialogComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });
        fixture = TestBed.createComponent(SeeMoreDialogComponent);
        component = fixture.componentInstance;
        component.content = {
            header: ["Titre", "Sous-titre", "Info"],
            paragraphs: ["Paragraphe 1"],
            stack: ["Action 1"],
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
