import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('access_token');
  if (token) {
    return true;
  }
  const router = new Router();
  router.navigate(['/']);
  return false;
};
