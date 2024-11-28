import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
} from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, RouterModule],
  template: `
    <div class=" flex justify-start mb-8  max-w-screen-xl mx-auto ">
      <p-breadcrumb
        class="max-w-full text-xs"
        styleClass="text-xs p-1 pointer-events-none"
        [model]="menuItems"
        (onItemClick)="onBreadcrumbClick($event)"
        [home]="home"
      ></p-breadcrumb>
    </div>
  `,
})
export class BreadcrumbComponent implements OnInit {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  readonly home = { icon: 'pi pi-home', url: '/dashboard' };
  public menuItems!: MenuItem[];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(
        () =>
          (this.menuItems = this.createBreadcrumbs(this.activatedRoute.root))
      );
  }
  onBreadcrumbClick(event: any): void {
    event.originalEvent.preventDefault(); // Evita la navegación
    event.originalEvent.stopPropagation(); // Detiene la propagación del evento
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '#',
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] {
    const children = route.children;

    if (!children) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        breadcrumbs.push({ label, routerLink: url + '/' + routeURL });
      }

      if (child.children && child.children.length > 0) {
        this.createBreadcrumbs(child, url + '/' + routeURL, breadcrumbs);
      }
    }

    return breadcrumbs;
  }
}
