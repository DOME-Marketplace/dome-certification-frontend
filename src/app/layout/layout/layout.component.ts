import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './../../components/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbComponent } from '../../components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, ToolbarComponent, RouterOutlet, BreadcrumbComponent],
  template: `
    <div class=" ">
      <app-toolbar></app-toolbar>
      <main
        class=" py-6 mt-16 max-w-screen-xl mx-auto min-h-[calc(100dvh-4rem)]"
      >
        <app-breadcrumb></app-breadcrumb>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
