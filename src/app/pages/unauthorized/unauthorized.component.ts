import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule],
  template: ` <div
    class=" min-h-screen  mx-auto flex items-center justify-center "
  >
    <div class="bg-gray-50  w-[520px] p-8 shadow-md rounded-md ">
      <h1 class="text-3xl text-center">
        You don't have permission to access this page
      </h1>
    </div>
  </div>`,
})
export class UnauthorizedComponent {}
