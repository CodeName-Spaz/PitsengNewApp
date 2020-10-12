import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DisclosurePage } from './disclosure.page';

describe('DisclosurePage', () => {
  let component: DisclosurePage;
  let fixture: ComponentFixture<DisclosurePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisclosurePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DisclosurePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
