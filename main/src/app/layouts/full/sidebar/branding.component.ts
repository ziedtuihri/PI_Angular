import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  imports: [RouterModule],
  template: `
    <a [routerLink]="['/']">
  <img
    src="./assets/images/logos/Logo_ESPRIT_Ariana.jpg"
    class="align-middle m-2"
    alt="logo"
    style="height: 80px;" 
  />
</a>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();
  constructor(private settings: CoreService) {} 
}
