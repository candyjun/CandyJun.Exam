import { ComponentFactoryResolver, EventEmitter, Injectable, Optional, SkipSelf, Type } from '@angular/core';
import { Confirmation, Message } from 'primeng/primeng';

import { DynamicComponentItem } from '../components/dynamic-component-loader/dynamic-component-item';
import { throwIfAlreadyLoaded } from './module-import-guard';

@Injectable()
export class MessageService {

    public readonly loadingSubject: EventEmitter<boolean> = new EventEmitter<boolean>();
    public readonly growlSubject: EventEmitter<Message> = new EventEmitter<Message>();
    public readonly dialogSubject: EventEmitter<DynamicComponentItem | null> = new EventEmitter<DynamicComponentItem | null>();
    public readonly confirmSubject: EventEmitter<Confirmation | null> = new EventEmitter<Confirmation | null>();

    public constructor(@Optional() @SkipSelf() parent: MessageService) {
        throwIfAlreadyLoaded(parent, 'MessageService');
    }

    /**
     *  MUST call hide.
     *  @see /src/app/core/loading.component.ts
     */
    public showLoading() {
        this.loadingSubject.emit(false);
    }

    public hideLoading() {
        this.loadingSubject.emit(true);
    }

    public success(detail: string, summary: string = '操作成功') {
        this.growlSubject.emit({ summary, detail, severity: 'success' });
    }

    public info(detail: string, summary: string = '提示') {
        this.growlSubject.emit({ summary, detail, severity: 'info' });
    }

    public warn(detail: string, summary: string = '警告') {
        this.growlSubject.emit({ summary, detail, severity: 'warn' });
    }

    public error(detail: string, summary: string = '错误') {
        this.growlSubject.emit({ summary, detail, severity: 'error' });
    }

    /**
     *  Will alway destroy component when close, and only allow one modal at a time.
     * @param {ComponentFactoryResolver} componentFactoryResolver inject ComponentFactoryResolver
     * @param item
     * @see /src/app/core/dialog.component.ts
     * @example
     *   export class Tab1Component {
     *      public constructor(private componentFactoryResolver: ComponentFactoryResolver,
     *                     private messageService: MessageService) {
     *      }
     *      public showDialog() {
     *          this.messageService.showDialog(this.componentFactoryResolver, {
     *              data: 1,
     *              title: "abc",
     *              component: Tab6Component,
     *              outputEvent: value => {
     *                  console.log(value);
     *              }
     *          });
     *          // setTimeout(() => {
     *          //     this.messageService.closeDialog();
     *          // }, 5000);
     *      }
     *   }
     * @example
     *   import { Component, Input, OnDestroy } from '@angular/core';
     *   import { DynamicComponentBase } from '../shared/dynamic-component-base';
     *   export class Tab6Component implements OnDestroy, DynamicComponentBase {
     *       @@Input()
     *       public data: MyClass;
     *       @@Output()
     *       public outputEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
     *       public constructor() {
     *          console.log(1);
     *              setTimeout(() => {
     *              this.outputEvent.emit(false);
     *          });
     *       }
     *       public ngOnDestroy(): void { console.log(2); }
     *   }
     *   export class MyClass {
     *       public abc: string;
     *   }
     */
    public showDialog(componentFactoryResolver: ComponentFactoryResolver,
                      item: { component: Type<any>, data?: any, title: string, outputEvent?(value?: any): void }) {
        this.dialogSubject.emit({
            componentFactoryResolver,
            data: item.data,
            title: item.title,
            component: item.component,
            outputEvent: item.outputEvent
        });
    }

    /**
     * @see /src/app/core/dialog.component.ts
     */
    public closeDialog() {
        this.dialogSubject.emit(null);
    }

    /**
     * @see /src/app/core/confirm.component.ts
     * @example
     *      this.messageService.confirm({
     *          message: 'abc',
     *          accept: () => {
     *              console.log(1);
     *          }
     *      })
     */
    public confirm(confirm: Confirmation) {
        this.confirmSubject.emit(confirm);
    }
}
