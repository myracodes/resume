import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RainbowLineComponent } from './rainbow-line.component';

describe('RainbowLineComponent', () => {
  let component: RainbowLineComponent;
  let fixture: ComponentFixture<RainbowLineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RainbowLineComponent]
    });
    fixture = TestBed.createComponent(RainbowLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
