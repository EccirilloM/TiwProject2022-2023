import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTestTwitterComponent } from './home-test-twitter.component';

describe('HomeTestTwitterComponent', () => {
  let component: HomeTestTwitterComponent;
  let fixture: ComponentFixture<HomeTestTwitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeTestTwitterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTestTwitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
