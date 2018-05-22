import { Routes, RouterModule } from '@angular/router';

import { ProblemListComponent } from './components/problem-list/problem-list.component';
import { ProblemDetailComponent } from './components/problem-detail/problem-detail.component';
import { NewProblemComponent } from './components/new-problem/new-problem.component';

const routes: Routes = [
      {
        path: '',
        redirectTo: 'codegether/problems',
        pathMatch: 'full'
      },
      {
        path: 'codegether/problems',
        children: [
          {
            path: 'new',
            component: NewProblemComponent
          },
          {
            path: ':id',
            component: ProblemDetailComponent
          },
          {
            path: '',
            component: ProblemListComponent
          }
        ]
      },
      {
        path: '**',
        redirectTo: 'codegether/problems'
      }
];

export const routing = RouterModule.forRoot(routes);