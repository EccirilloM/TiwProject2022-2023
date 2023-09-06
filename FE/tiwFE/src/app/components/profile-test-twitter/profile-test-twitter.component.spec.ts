import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileTestTwitterComponent } from './profile-test-twitter.component';

describe('ProfileTestTwitterComponent', () => {
  let component: ProfileTestTwitterComponent;
  let fixture: ComponentFixture<ProfileTestTwitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileTestTwitterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileTestTwitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
