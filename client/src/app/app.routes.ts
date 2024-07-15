import { RouterOutlet, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MainComponent } from './layouts/main/main.component';
import { AuthGuard } from './helpers/auth.guard';
import { NoAuthGuard } from './helpers/no-auth.guard';
import { DashboardComponent as DashboardLayout } from './layouts/dashboard/dashboard.component';
import { VerifyComponent } from './pages/verify/verify.component';
import { CreateComponent } from './pages/links/create/create.component';
import { UpdateComponent } from './pages/links/update/update.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ListComponent } from './pages/links/list/list.component';

//register routes
export const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            {
                path: '',
                component: HomeComponent
            },
            {
                path: 'about',
                component: AboutComponent
            },
            {
                path: 'pricing',
                component: PricingComponent
            },
        ]
    },
    {
        path: 'auth',
        component: AuthComponent,
        canActivate: [NoAuthGuard],
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'verify',
                component: VerifyComponent
            }
        ]
    },
    {
        path: '',
        component: DashboardLayout,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'links',
                children: [
                    {
                        path: '',
                        component: ListComponent
                    },
                    {
                        path: 'new',
                        component: CreateComponent
                    },
                    {
                        path: 'edit/:id',
                        component: UpdateComponent
                    }
                ]
            },
        ]
    },
    
    {
        path: '**',
        component: NotFoundComponent
    }

];