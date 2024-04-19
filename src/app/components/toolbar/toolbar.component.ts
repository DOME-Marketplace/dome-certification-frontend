import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule],
  template: `
    <div class="fixed top-0 left-0 right-0 bg-[#2D58A7] w-full ">
      <div
        class="flex items-center justify-between shadow-lg max-w-screen-xl mx-auto  h-16  "
      >
        <div class="flex items-center justify-start gap-8 ">
          <a
            class="no-underline flex justify-between items-center gap-2"
            routerLink="/"
          >
            <img
              src="https://dome-marketplace.org/resources/core/images/DOME_Icon_White.png"
              width="44px"
              height="44px"
            />
            <span class=" text-2xl cursor-pointer text-white font-normal mb-1"
              >Certification
            </span>
          </a>

          <a
            class="cursor-pointer no-underline text-white"
            routerLink="/dashboard"
          >
            Dasboard
          </a>
          <a
            class="cursor-pointer no-underline text-white"
            routerLink="/newRequest"
          >
            New Request
          </a>
        </div>

        <div
          #topbarmenu
          class="flex justify-between items-center gap-4 text-white"
        >
          <!-- <p-button size="small" icon="pi pi-plus" [rounded]="true"></p-button> -->
          <button class="p-link layout-topbar-button  text-white">
            <i class="pi pi-user  text-white"></i>
            <span class="ml-2  text-white">Profile</span>
          </button>
          <button
            class="p-link layout-topbar-button  text-white"
            [routerLink]="'/documentation'"
          >
            <i class="pi pi-cog  text-white"></i>
            <span class="ml-2  text-white">Settings</span>
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {}
