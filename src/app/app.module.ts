import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { EducationComponent } from "./components/education/education.component";
import { SkillsComponent } from "./components/skills/skills.component";
import { ActivitiesComponent } from "./components/activities/activities.component";
import { TitleComponent } from "./components/atoms/title/title.component";
import { CertificationsComponent } from "./components/certifications/certifications.component";
import { ProSkillsComponent } from "./components/pro-skills/pro-skills.component";
import { ProfessionalXpComponent } from "./components/professional-xp/professional-xp.component";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ProfessionalXpComponent,
        EducationComponent,
        SkillsComponent,
        ActivitiesComponent,
        TitleComponent,
        CertificationsComponent,
        ProSkillsComponent,
    ],
    imports: [BrowserModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
