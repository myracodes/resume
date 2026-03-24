import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogComponent } from "./dialog.component";

describe("DialogComponent", () => {
    let component: DialogComponent;
    let fixture: ComponentFixture<DialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DialogComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });
        fixture = TestBed.createComponent(DialogComponent);
        component = fixture.componentInstance;
        component.content = {
            header: ["Titre", "Sous-titre", "Info"],
            paragraphs: ["Paragraphe 1"],
            stack: ["Action 1"],
        } as any;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
