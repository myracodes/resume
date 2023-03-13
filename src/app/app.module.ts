import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SectionHeaderComponent } from './components/atoms/section-header/section-header.component';
import { HeaderComponent } from './components/header/header.component';
import { ProfessionalXpComponent } from './components/professional-xp/professional-xp.component';
import { EducationComponent } from './components/education/education.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ActivitiesComponent } from './components/activities/activities.component';

@NgModule({
  declarations: [
    AppComponent,
    SectionHeaderComponent,
    HeaderComponent,
    ProfessionalXpComponent,
    EducationComponent,
    SkillsComponent,
    ActivitiesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
