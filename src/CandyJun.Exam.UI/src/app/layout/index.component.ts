import { Component } from '@angular/core';

@Component({
    selector: 'app-layout-index',
    template: `
        <div class="layout">
            <header class="layout-header">
                <app-layout-navbar></app-layout-navbar>
            </header>
            <div class="layout-body">
                <div class="layout-main">
                    <router-outlet></router-outlet>
                </div>
            </div>
        </div>
    `,
})
export class LayoutIndexComponent {
}
