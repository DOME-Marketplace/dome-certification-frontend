import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';
import { roleRenamer } from '@utils/roleRenamer';
import { ModalUserProfile } from '@components/modalUserProfile.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonModule,
    MenuModule,
    ModalUserProfile,
  ],
  template: `
    <div class="fixed top-0 left-0 right-0 bg-[#2D58A7] w-full z-50">
      <div
        class="flex items-center justify-between shadow-lg max-w-screen-xl mx-auto  h-[75px]  py-4 "
      >
        <div class="flex items-center justify-start gap-8 ">
          <a
            class="no-underline flex justify-between items-center gap-3"
            routerLink="/"
          >
            <img
              src="../../assets/icon/DOME_Icon_White.svg"
              class="h-4 lg:h-8"
              alt="logo dome certification"
            />
            <span
              class="self-center text-xl lg:text-[24px] font-semibold whitespace-nowrap dark:text-white"
              >DOME CERTIFICATION
            </span>
          </a>

          <a
            class="cursor-pointer no-underline text-white ml-8"
            routerLink="/dashboard"
          >
            Dasboard
          </a>
          @if(this.user?.role == "CUSTOMER" || this.user?.role == "ADMIN"){
          <a
            class="cursor-pointer no-underline text-white"
            routerLink="/newRequest"
          >
            New Request
          </a>
          }
        </div>

        <div
          #topbarmenu
          class="flex justify-between items-center gap-6 text-white"
        >
          @if(user?.role === 'ADMIN' || user?.role === 'EMPLOYEE' || user?.role
          === 'CUSTOMER'){
          <span
            class=" bg-slate-100 rounded-full  px-3 text-color-primary py-0"
          >
            {{ roleRenamer(user?.role) }}
          </span>
          }
          <!-- <p-button size="small" icon="pi pi-plus" [rounded]="true"></p-button> -->
          <button
            class="p-link layout-topbar-button  text-white"
            (click)="menuSettings.toggle($event)"
          >
            <i class="pi pi-user  text-white"></i>
            <span class="ml-2 text-white"
              >{{ user?.firstname }} {{ user?.lastname }}
            </span>
          </button>

          <!-- <button
            (click)="menuSettings.toggle($event)"
            class="p-link layout-topbar-button  text-white "
          >
            <i class="pi pi-cog  text-white"></i>
            <span class="ml-2  text-white">Settings</span>
          </button> -->
        </div>
      </div>
    </div>

    <p-menu
      #menuSettings
      [model]="itemsSettings"
      [popup]="true"
      [style]="{ width: 'auto', minWidth: '200px' }"
    />
    <p-menu
      #menuProfile
      [model]="itemsProfile"
      [popup]="true"
      [style]="{ width: 'auto', minWidth: '200px' }"
    />
    <app-modal-user-profile [user]="user" />
  `,
})
export class ToolbarComponent implements OnInit {
  private authService = inject(AuthService);

  @Input() user: User | null = null;
  roleRenamer = roleRenamer;
  itemsSettings: MenuItem[] | undefined;
  itemsProfile: MenuItem[] | undefined;

  @ViewChild(ModalUserProfile) modalUserProfile!: ModalUserProfile;

  handleOpenModalUserProfile() {
    this.modalUserProfile.handleToggle();
  }

  ngOnInit() {
    this.itemsSettings = [
      {
        label: 'Profile',
        items: [
          {
            label: `${this.user?.firstname} ${this.user?.lastname}`,
            icon: 'pi pi-user',
            command: () => {
              this.handleOpenModalUserProfile();
            },
          },
        ],
      },
      {
        label: 'Settings',
        items: [
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
              this.authService.logout();
            },
          },
        ],
      },
    ];
    this.itemsProfile = [
      {
        label: roleRenamer(this.user?.role),
        items: [
          {
            label: `${this.user?.firstname} ${this.user?.lastname}`,
            icon: 'pi pi-user',
          },
        ],
      },
    ];
  }
}
