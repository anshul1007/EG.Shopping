import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './standalone-components/navbar/navbar.component';
import { Component } from '@angular/core';

let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: '',
  providers: [{ provide: NavbarComponent, useClass: MockNavbarComponent }],
})
export class MockNavbarComponent {
  public exists = true;
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([])],

    })
    .overrideComponent(AppComponent, {
      remove: { imports: [ NavbarComponent] },
      add: { imports: [ MockNavbarComponent] }
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'EG.Shopping.Web' title`, () => {
    expect(component.title).toEqual('EG.Shopping.Web');
  });
});
