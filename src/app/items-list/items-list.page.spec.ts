import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemsListPage } from './items-list.page';

describe('ItemsListPage', () => {
  let component: ItemsListPage;
  let fixture: ComponentFixture<ItemsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
