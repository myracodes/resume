import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { EducationComponent } from './components/education/education.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { TitleComponent } from './components/atoms/title/title.component';
import { ProfessionalXpComponent } from './components/professional-xp/professional-xp.component';
import { SharedModule } from './shared/modules/shared.module';
import { DialogComponent } from './components/atoms/dialog/dialog.component';
import { StackComponent } from './components/atoms/stack/stack.component';
import { SeparatorComponent } from './components/atoms/separator/separator.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        ProfessionalXpComponent,
        EducationComponent,
        SkillsComponent,
        ActivitiesComponent,
        TitleComponent,
        DialogComponent,
        StackComponent,
        SeparatorComponent,
    ],
    imports: [AppRoutingModule, BrowserModule, SharedModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
