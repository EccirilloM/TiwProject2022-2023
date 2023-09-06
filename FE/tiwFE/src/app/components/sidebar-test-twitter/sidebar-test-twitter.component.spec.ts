import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarTestTwitterComponent } from './sidebar-test-twitter.component';

describe('SidebarTestTwitterComponent', () => {
  let component: SidebarTestTwitterComponent;
  let fixture: ComponentFixture<SidebarTestTwitterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidebarTestTwitterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarTestTwitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
