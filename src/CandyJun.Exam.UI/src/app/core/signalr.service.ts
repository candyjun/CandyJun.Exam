/**
 * @File: Signalr service
 * @Author: wush
 */

import { EventEmitter, Injectable } from '@angular/core';

import { environment as config } from '../../environments/environment';
import { AuthService } from './auth.service';

declare let $: any;

declare let require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure(paths: string[], callback: (require: <T>(path: string) => T) => void): void;
};

export enum ConnectionState {
    Connecting = 1,
    Connected = 2,
    Reconnecting = 3,
    Disconnected = 4
}

export class SignalRMessage {

    /**
     * 消息ID
     */
    public id: string;

    /**
     * 业务类型
     */
    public businessType: number;

    /**
     * 业务操作人名称
     */
    public publisher: string;

    /**
     * 业务消息类型
     */
    public messageType: number;

    /**
     * 业务操作类型
     */
    public operationType: number;

    /**
     * 业务Id
     */
    public businessId: string;

    /**
     * 内容
     */
    public content: string;

    /**
     * 备注
     */
    public remark: string;

    /**
     * 消息通知时间
     */
    public addTime: Date;

    /**
     * 消息状态
     */
    public state: number;
}

@Injectable()
export class SignalRService {

    public hubProxy: any;
    public readonly hubInitialized = new EventEmitter();
    public startingEvent = new EventEmitter<any>();
    public connectionStateEvent = new EventEmitter<ConnectionState>();
    public errorEvent = new EventEmitter<string>();
    private hubName = 'businessMessage';
    private url = config.messageCenterUrl + '/messageR';
    private hubConnection: any;

    public constructor(private auth: AuthService) {
        require.ensure(['jquery', 'signalr'], () => {
            const jquery = require('jquery');
            (<any>window).jQuery = jquery;
            (<any>window).$ = jquery;
            require('signalr');
            this.init();
        });
    }

    public start(): void {
        this.hubConnection.start()
            .done(() => this.startingEvent.next())
            .fail((error: any) => this.startingEvent.error(error));
    }

    private init() {
        if ($.hubConnection === undefined) {
            throw new Error(`
            The variable \'$\' or the .hubConnection() function are not defined...
            please check the SignalR scripts have been loaded properly`);
        }

        this.hubConnection = $.hubConnection();

        this.hubConnection.url = this.url;
        this.hubConnection.qs = { userId: this.auth.currentUserId, tenantId: 1 };
        this.hubConnection.logging = false;
        this.hubProxy = this.hubConnection.createHubProxy(this.hubName);
        this.hubInitialized.emit();
        this.hubConnection.stateChanged((state: any) => {
            let newState = ConnectionState.Connecting;

            switch (state.newState) {
                case $.signalR.connectionState.connecting:
                    newState = ConnectionState.Connecting;
                    break;
                case $.signalR.connectionState.connected:
                    newState = ConnectionState.Connected;
                    break;
                case $.signalR.connectionState.reconnecting:
                    newState = ConnectionState.Reconnecting;
                    break;
                case $.signalR.connectionState.disconnected:
                    newState = ConnectionState.Disconnected;
                    break;
                default:
                    break;
            }

            this.connectionStateEvent.next(newState);
        });

        this.hubConnection.error((error: any) => {
            this.errorEvent.next(error);
        });
    }
}
