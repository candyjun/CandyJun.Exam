import { Component } from '@angular/core';
import { DynamicComponentItem } from '../components/dynamic-component-loader/dynamic-component-item';

import { MessageService } from '../core/message.service';

@Component({
    selector: 'app-dialog',
    template: `
        <p-dialog [header]="componentItem?.title" positionTop="50"
                  [contentStyle]="{'overflow':'visible','max-height': '80vh','overflow-y': 'auto'}"
                  [(visible)]="display" [modal]="true" [resizable]="false" (onHide)="onHide()">
            <app-components-dynamic-component-container [componentItem]="componentItem"></app-components-dynamic-component-container>
        </p-dialog>
    `,
})
export class DialogComponent {

    public display: boolean = false;

    public componentItem: DynamicComponentItem | null;

    public constructor(private messageService: MessageService) {
        this.messageService.dialogSubject
            .subscribe((v: DynamicComponentItem | null) => {
                if (v === null) {
                    this.display = false;
                    this.componentItem = null;
                } else {
                    this.display = true;
                    this.componentItem = v;
                }
            });
    }

    public onHide() {
        this.componentItem = null;
    }
}
