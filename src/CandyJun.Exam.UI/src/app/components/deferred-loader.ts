import { ContentChild, Directive, EmbeddedViewRef, NgModule, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

/**
 *  use Template reference variables to reference appDeferredLoader as container,
 *  anything inside ng-template will be loaded on if you call load(),
 *  call ngOnDestroy() to clear the content.
 *  tslint:disable:no-access-missing-member
 *  tslint:enable:no-access-missing-member
 * @example
 *    <div appDeferredLoader #def="appDeferredLoader">
 *        <ng-template>
 *            <app-tabs-mytab6></app-tabs-mytab6>
 *        </ng-template>
 *        <button (click)="def.ngOnDestroy(); def.load()">New Tab {{a}}</button>
 *    </div>
 * @example
 *    <ng-container *ngFor="let a of [1,2]">
 *       <div appDeferredLoader #def="appDeferredLoader">
 *           <ng-template>
 *               <app-tabs-mytab6></app-tabs-mytab6>
 *               <app-tabs-mytab6></app-tabs-mytab6>
 *           </ng-template>
 *       <button (click)="def.ngOnDestroy(); def.load()">New Tab {{a}}</button>
 *       </div>
 *    </ng-container>
 */
@Directive({
    selector: '[appDeferredLoader]',
    exportAs: 'appDeferredLoader'
})
export class AppDeferredLoaderDirective implements OnDestroy {

    @ContentChild(TemplateRef) private template: TemplateRef<any>;

    private view: EmbeddedViewRef<any>;

    public constructor(public viewContainer: ViewContainerRef) {
        //
    }

    /**
     * load the template content into this view container, if not loaded.
     */
    public load(): void {
        if (!this.view) {
            this.view = this.viewContainer.createEmbeddedView(this.template);
        }
    }

    /**
     *  remove the template content, clear the view container.
     */
    public ngOnDestroy() {
        this.viewContainer.clear();
        this.view = null;
    }
}

@NgModule({
    declarations: [AppDeferredLoaderDirective],
    exports: [AppDeferredLoaderDirective]
})
export class DeferredLoaderModule {
}

