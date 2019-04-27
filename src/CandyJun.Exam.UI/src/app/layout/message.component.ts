import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';
import { MessageService } from '../core/message.service';

@Component({
    selector: 'app-message',
    template: `
        <p-growl [value]="msgs" (onClose)="handleClose()"></p-growl>
    `,
})
export class MessageComponent implements OnInit {

    public msgs: Message[] = [];

    public constructor(private messageService: MessageService, private c: ChangeDetectorRef) {
        //
    }

    public ngOnInit(): void {
        this.messageService.growlSubject
            .subscribe((v: Message) => {
                this.msgs = [];
                this.c.detectChanges();
                v.id = Date.now();
                this.msgs = [v];
                this.c.detectChanges();
            });
    }

    public handleClose() {
        this.msgs = [];
        this.c.detectChanges();
    }
}
