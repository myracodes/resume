import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProSkillsComponent } from './pro-skills.component';

describe('ProSkillsComponent', () => {
  let component: ProSkillsComponent;
  let fixture: ComponentFixture<ProSkillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProSkillsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
