import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeometryListModalComponent } from './geometry-list-modal.component';

describe('GeometryListModalComponent', () => {
  let component: GeometryListModalComponent;
  let fixture: ComponentFixture<GeometryListModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeometryListModalComponent]
    });
    fixture = TestBed.createComponent(GeometryListModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
