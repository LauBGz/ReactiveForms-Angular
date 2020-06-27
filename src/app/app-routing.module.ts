import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveComponent } from './pages/reactive/reactive.component';


const routes: Routes = [
    {path: 'reactivo', component: ReactiveComponent},
    {path: '**', pathMatch: 'full', redirectTo:'reactivo'}
    //En el resto de paths queremos que cargue el componente template
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
