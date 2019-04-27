import { Component } from '@angular/core';
import { Confirmation, ConfirmationService } from 'primeng/primeng';

import { MessageService } from '../core/message.service';

@Component({
    selector: 'app-confirm',
    template: `
        <p-confirmDialog [header]="'确认继续执行该操作?'" icon="fa fa-question-circle" acceptLabel="是" rejectLabel="否"></p-confirmDialog>
    `,
})
export class ConfirmComponent {

    public constructor(private messageService: MessageService,
                       private confirmationService: ConfirmationService) {
        this.messageService.confirmSubject
            .subscribe((v: Confirmation) => {
                this.confirmationService.confirm(v);
            });
    }
}
