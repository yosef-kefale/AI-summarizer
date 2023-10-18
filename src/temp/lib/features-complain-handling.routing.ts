import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComplainBoardDetailComponent } from './pages/complain-board-detail/complain-board-detail.component';
import { ComplainDetailComponent } from './pages/complain-detail/complain-detail.component';
import { ComplainListComponent } from './pages/complain-list/complain-list.component';
const routes: Routes = [
  {
    path: '',
    component: ComplainListComponent,
    children: [
      { path: 'board/:id', component: ComplainBoardDetailComponent },
      { path: 'detail/:id', component: ComplainDetailComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplainHandlingRoutingModule {}
