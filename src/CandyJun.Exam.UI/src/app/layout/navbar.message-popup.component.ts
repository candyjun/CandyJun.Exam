/**
 * @File: system message popup component.
 * @Author: wush
 */
import { Component, OnInit } from '@angular/core';
import { SidebarMessage, SystemMessageService } from 'app/core/system-message.service';
import { MytabsRouteService } from 'app/mytabs/mytabs-route.service';
import remove from 'lodash-es/remove';

@Component({
    selector: 'app-layout-navbar-message-popup',
    template: `
        <div class="pointer-cursor">
            <div (click)="handleClickNotificationMenu($event)"
                 class="ui-menuitem-link ui-corner-all ng-star-inserted notification-menu-item">
                <span class="fa fa-bell fa-lg"></span>
                <span class="notification-count" [ngClass]="{'animated flash': msgs.length > 0}"
                    *ngIf="msgs.length > 0">
                    {{msgs.length >= 100 ? '99+' : msgs.length.toString()}}
                </span>
            </div>

            <div class="notification-container" *ngIf="showed" appAutoFocus tabindex="0" (blur)="handleBlurNotificationMenu($event)">
                <div class="notification-title">系统新消息</div>
                <div class="notifications-body">
                    <ul class="list-group">
                        <ng-container *ngIf="msgs && (msgs.length > 0); else msgEmpty">
                            <li *ngFor="let msg of msgs"
                                class="list-group-item list-group-item-action flex-column align-items-start">
                                <div class="pointer-cursor">
                                    <div class="d-flex w-100 justify-content-between">
                                        <strong class="mb-1">{{msg.summary}}</strong>
                                        <small>{{msg.dateTime}}</small>
                                    </div>
                                    <p class="mb-1">{{msg.detail}}</p>
                                </div>
                                <div class="text-right">
                                    <a class="badge badge-success" title="已读"  (click)="handleSetRead(msg)">已读</a>
                                    <a class="badge badge-light" title="打开工单" (click)="handleClickMsg(msg)">打开工单</a>
                                </div>
                            </li>
                        </ng-container>
                    </ul>
                    <!-- 表现空状态 -->
                    <ng-template #msgEmpty>
                        <div class="empty-message"></div>
                    </ng-template>
                </div>
                <div class="notification-footer">
                    <a class="pointer-cursor" (click)="handleClickViewAll()">到【我的工单】查看所有</a>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .notification-menu-item {
            position: relative;
            width: 4em;
            top: .2em;
            padding: 0 1em;
            color: white;
        }

        .notification-container {
            background-color: #fff;
            border: .1em solid rgba(100, 100, 100, .4);
            -webkit-box-shadow: 0 3px 8px rgba(0, 0, 0, .25);
            overflow: visible;
            position: absolute;
            top: 4em;
            margin-left: -16em;
            width: 22em;
            color: #000000;
            border-radius: 0.25rem;
            z-index: 999;
        }

        .notification-container::before {
            content: '';
            display: block;
            position: absolute;
            width: 0;
            height: 0;
            color: transparent;
            border: 1em solid black;
            border-color: transparent transparent white;
            margin-top: -1.8em;
            margin-left: 16.8em;
            z-index: 999;
        }

        .notification-title {
            font-weight: bold;
            font-size: 1em;
            color: #000000;
            padding: .6em 0 .5em 1em;
            background-color: #ffffff;
            position: fixed;
            width: 21.8em;
            border-bottom: .1em solid #dddddd;
            border-top-left-radius: 0.25rem;
            border-top-right-radius: 0.25rem;
            line-height: 2.5em;
            z-index: 1000;
        }

        .notifications-body {
            padding: 3em 0 0 0 !important;
            height: 25em;
            overflow-y: scroll;
            line-height: 1.5em;
        }

        .notifications-body::-webkit-scrollbar {
            width: 0;
        }

        .notification-footer {
            background-color: #e9eaed;
            text-align: center;
            font-weight: bold;
            font-size: 1em;
            color: #3AC5F0;
            padding: .6em;
            border-top: .1em solid #dddddd;
            border-bottom-left-radius: 0.25rem;
            border-bottom-right-radius: 0.25rem;
            line-height: 2.5em;
            z-index: 1000;
        }

        .notification-count {
            padding: .2em .5em;
            background: #cc0000;
            color: #ffffff;
            font-weight: bold;
            margin-left: .5em;
            border-radius: .9em;
            position: absolute;
            margin-top: -3em;
            font-size: .5em;
            line-height: 1.2em;
        }

        .pointer-cursor {
            cursor: pointer;
        }
    `]
})
export class MessagePopupComponent implements OnInit {
    public showed = false;
    public get msgs(): SidebarMessage[] {
        return this.systemMessageService.msgs;
    }

    public constructor(public systemMessageService: SystemMessageService, private mytabsRouteService: MytabsRouteService) {
        //
    }

    public ngOnInit() {
        //
    }

    public handleClickNotificationMenu(event: Event) {
        this.showed = true;

        event.preventDefault();
        event.stopPropagation();
    }

    public handleBlurNotificationMenu(event: Event) {
        this.showed = false;

        event.preventDefault();
        event.stopPropagation();
    }

    public handleClickViewAll() {
        this.mytabsRouteService.navigateToMyTicketTab();
        this.showed = false;
    }

    public handleClickMsg(msg: SidebarMessage) {
        this.systemMessageService.navTo(msg);
        this.showed = false;
    }

    public handleSetRead(msg: SidebarMessage) {
        this.systemMessageService.setRead(msg);
        remove(this.msgs, (x) => x === msg);
    }

}
