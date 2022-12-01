import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/components/landing-page/landing-page.component';

const routes: Routes = [
  {
    path: 'facesnaps',
    loadChildren: () =>
      import('./face-snaps/face-snaps.module').then(
        (m) => m.FaceSnapsModule
      ),
  }, // lazy loading pour routes commençant par facesnaps
  { path: '', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
