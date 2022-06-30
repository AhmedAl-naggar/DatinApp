import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MemmberEditComponent } from '../members/memmber-edit/memmber-edit.component';

@Injectable({
  providedIn: 'root'
})
export class PreventUnsavedChangesGuard implements CanDeactivate<MemmberEditComponent> {
  canDeactivate(
    component: MemmberEditComponent): boolean {
    if (component.editForm.dirty) {
      return confirm('You do not save changes yet, Are you sure to continue ?')
    }
    return true;
  }

}
