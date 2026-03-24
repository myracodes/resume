import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { ProfessionalXpComponent } from "./professional-xp.component";

describe("ProfessionalXpComponent", () => {
    let component: ProfessionalXpComponent;
    let fixture: ComponentFixture<ProfessionalXpComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProfessionalXpComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(ProfessionalXpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
