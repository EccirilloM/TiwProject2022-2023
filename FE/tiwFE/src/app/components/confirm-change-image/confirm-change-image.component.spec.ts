import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmChangeImageComponent } from './confirm-change-image.component';

describe('ConfirmChangeImageComponent', () => {
  let component: ConfirmChangeImageComponent;
  let fixture: ComponentFixture<ConfirmChangeImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmChangeImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmChangeImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
