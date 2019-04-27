/**
 * @File: 系统消息服务
 * @Author: wush
 */
import { EventEmitter, Injectable, NgZone, Optional, SkipSelf } from '@angular/core';
import { BusinessMessageState } from 'app/api/ticket/enums/business-message-state';
import { AuthService } from 'app/core/auth.service';
import { SignalRMessage, SignalRService, ConnectionState } from 'app/core/signalr.service';
import { throwIfAlreadyLoaded } from 'app/core/module-import-guard';
import { MessageService } from 'app/core/message.service';
import { PageOperationType } from 'app/api/ticket/enums/page-operation-type';
import { PermissionsHomePageType } from 'app/api/authorization-center/enums/permissions-home-page-type';
import { MyTicketApiService } from 'app/api/ticket/my-ticket.api';

export class SidebarMessage {
    public data: SignalRMessage;
    public summary: string;
    public dateTime: string;
    public detail: string;
    public severity: 'info' | 'success' | 'warn' | 'error';
}

@Injectable()
export class SystemMessageService {

    public newMessagesEvent = new EventEmitter<SignalRMessage[]>();
    public setReadEvent = new EventEmitter<string>();

    // 未读消息
    public msgs: SidebarMessage[] = [];

    // 全部消息
    public msgsAsRead: SidebarMessage[] = [];

    private connectionState: ConnectionState = ConnectionState.Connecting;

    public constructor(@Optional() @SkipSelf() parentModule: SystemMessageService,
                       private signalRService: SignalRService,
                       private authService: AuthService,
                       private myTicketApiService: MyTicketApiService,
                       private mytabsRouteService: MytabsRouteService,
                       private messageService: MessageService,
                       private zone: NgZone) {
        throwIfAlreadyLoaded(parentModule, 'SystemMessageService');
        this.init();
    }

    /**
     * 设为已读
     */
    public setRead(msg: SidebarMessage) {
        if (this.connectionState !== ConnectionState.Connected) {
            this.messageService.warn('无法连接消息中心，不能进行已读操作！');
            return false;
        }

        this.afterSetReaded(msg.data.id);
        this.signalRService.hubProxy.invoke(
            'changeBusinessMessageState',
            this.authService.currentUserId,
            msg.data.id,
            BusinessMessageState.Read);
        return true;
    }

    /**
     * 将 SignalRMessage 对象转换为 SystemMessageService 对象
     */
    public newMsgObj(obj: SignalRMessage) {
        const result: SidebarMessage = {
            data: obj,
            summary: `${obj.remark}`,
            dateTime: `${(obj.addTime || '').toString().replace(/[TZ]/g, ' ').substring(5, 19)}`, // MM-dd HH:mm:ss
            detail: obj.content,
            severity: obj.state === BusinessMessageState.Read ? 'success' : 'info'
        };
        return result;
    }

    public navTo(item: SidebarMessage) {
        this.myTicketApiService.getTicketByTicketNo(this.authService.currentUserId, +item.data.businessId)
            .subscribe(res => {
                if (res.result) {
                    const currentNodeName = res.currentNodeName ? `-${res.currentNodeName}` : '';
                    this.mytabsRouteService.navigateToTicketHandlerTab({
                        id: res.id,
                        theme: `${res.productName}-${res.name}${currentNodeName}`,
                        pageOperationType: PageOperationType.操作页面,
                        permissionsHomePageType: PermissionsHomePageType.我的工单
                    });
                } else {
                    this.messageService.warn('该消息的工单已过期或被处理！');
                }
            });
    }

    public getUnreadBusinessMessage() {
        if (this.connectionState !== ConnectionState.Connected) {
            this.messageService.warn('无法连接消息中心，无法获取消息！');
            return;
        }

        this.signalRService.hubProxy.invoke('getTodayBusinessMessages', this.authService.currentUserId);
    }

    private init() {
        this.signalRService.hubInitialized
            .subscribe(() => {
                const hubProxy = this.signalRService.hubProxy;

                hubProxy.on('newBusinessMessage', (message: SignalRMessage | SignalRMessage[]) => {
                    const receiveMessages = [].concat(message);

                    this.handleNewBusinessMessage(receiveMessages);

                    const newMessages = receiveMessages.filter(msg => this.msgs.findIndex(x => x.data.id === msg.id) === -1);
                    if (newMessages.length) {
                        const arr = this.msgs.map(item => item.data).concat(newMessages);
                        this.addMessages(this.msgs, arr);
                        this.newMessagesEvent.next(newMessages);
                    }
                });

                hubProxy.on('changeBusinessMessageState', (message: SignalRMessage) => {
                    const arr = message.state > BusinessMessageState.Unread ? this.msgsAsRead : this.msgs;

                    if (message.state === BusinessMessageState.Read && this.setReadEvent) {
                        this.setReadEvent.emit(message.id);
                        this.afterSetReaded(message.id);
                    } else {
                        this.addMessages(arr, message);
                    }
                });

                hubProxy.on('todayBusinessMessage', (message: SignalRMessage[]) => {
                    this.addMessages(this.msgsAsRead, message);
                    this.msgsAsRead = this.msgsAsRead.filter(x => x.data.state > BusinessMessageState.Unread);
                });

                this.prepareSignalr();
                this.signalRService.start();
            });
    }

    private handleNewBusinessMessage(receiveMessages: SignalRMessage[]) {
        if (this.msgs.length) {
            // 检测是否有消息状态变为未读
            if (this.msgsAsRead.length) {
                const unread = this.msgsAsRead.filter(msg => receiveMessages.findIndex(x =>
                    msg && msg.data && x.id === msg.data.id) !== -1);
                if (unread.length) {
                    unread.forEach(msg => {
                        const index = this.msgsAsRead.findIndex(x => x.data.id === msg.data.id);
                        this.msgsAsRead.splice(index, 1);
                    });
                }
            }

            // 检测是否有消息状态变为已读
            const read = this.msgs.filter(msg => receiveMessages.findIndex(x =>
                msg && msg.data && x.id === msg.data.id) === -1);
            if (read.length && this.setReadEvent) {
                read.forEach(msg => {
                    this.setReadEvent.emit(msg.data.id);
                    this.afterSetReaded(msg.data.id);
                });
            }
        }
    }

    private addMessages(arr: SidebarMessage[], msg: SignalRMessage | SignalRMessage[]) {
        if (Array.isArray(msg)) {
            if (msg.length) {
                this.zone.run(() => {
                    arr.length = 0;
                    msg.forEach((item: SignalRMessage) => {
                        arr.push(this.newMsgObj(item));
                    });
                });
            }
        } else if (msg) {
            this.zone.run(() => arr.unshift(this.newMsgObj(msg)));
        }
    }

    private afterSetReaded(id: string) {
        const index = this.msgs.findIndex(x => x.data.id === id);
        if (index > -1) {
            this.msgs[index].severity = 'success';
            this.msgsAsRead.push(this.msgs[index]);
            this.msgs.splice(index, 1);
        }
    }

    private prepareSignalr() {
        this.signalRService.errorEvent.subscribe(
            (error: any) => console.warn(error),
            (error: any) => console.error('errors$ error', error)
        );

        this.signalRService.startingEvent.subscribe(
            () => {
                this.connectionState = ConnectionState.Connected;
                this.getUnreadBusinessMessage();
                if (this.connectionState === ConnectionState.Connected) {
                    this.signalRService.hubProxy.invoke('getNewBusinessMessage', this.authService.currentUserId);
                }
                console.log('signalr service has been started');
            },
            () => {
                this.connectionState = ConnectionState.Disconnected;
                console.warn('signalr service failed to start!');
                // this.messageService.error('无法连接消息中心！');
            }
        );

        let reconnecting = false;
        this.signalRService.connectionStateEvent.subscribe(
            (state: ConnectionState) => {
                this.connectionState = state;
                switch (state) {
                    case ConnectionState.Disconnected: {
                        console.error('Disconnected...');
                        // console.log('Connection closed. Retrying...');

                        // timer(5000).subscribe(() => this.signalRService.start());
                        // this.messageService.warn('与消息中心断开连接，正在尝试重新连接……');
                        reconnecting = true;
                        break;
                    }
                    case ConnectionState.Connected: {
                        if (reconnecting) {
                            console.log('Connection restarted. ');
                            // this.messageService.info('重新连接消息中心成功！');
                        }
                        reconnecting = false;
                        break;
                    }
                    default: break;
                }
            }
        );
    }
}
