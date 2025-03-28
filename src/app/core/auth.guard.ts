import {CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state: RouterStateSnapshot): boolean | UrlTree => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.isAuthenticated() ? true : router.createUrlTree(['/'], { queryParams: { returnUrl: state.url } });
};
