import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OrderClosedPage } from './order-closed.page';

describe('OrderClosedPage', () => {
  let component: OrderClosedPage;
  let fixture: ComponentFixture<OrderClosedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderClosedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderClosedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
