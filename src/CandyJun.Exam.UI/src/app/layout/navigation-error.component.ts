import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-error',
    template: `
        <h1 class="text-danger">Error while loading {{error?.url}}</h1>
        <hr>
        <h5>{{error?.message}}</h5>
    `
})
export class NavigationErrorComponent {

    public error: any;

    public constructor(private activatedRoute: ActivatedRoute) {
        this.activatedRoute.queryParams.subscribe((v) => {
            this.error = v;
        });
    }
}
