/**
 * @File: 模型临时存储服务
 * @Author: zhangjl
 */
import { Injectable } from '@angular/core';

@Injectable()
export class ModelStorageService {

    /**
     * 存储模型
     */
    public set(model: any, path?: string) {
        const sessionKey = this.getSessionKey(path);
        sessionStorage.setItem(sessionKey, JSON.stringify(model));
    }

    /**
     * 获取模型
     */
    public get(model: any, path?: string) {
        const sessionKey = this.getSessionKey(path);
        const rawModel = sessionStorage.getItem(sessionKey);
        if (rawModel) {
            Object.assign(model, JSON.parse(rawModel));
        }
        return model;
    }

    /**
     * 移除存储的模型
     */
    public remove(path?: string) {
        const sessionKey = this.getSessionKey(path);
        sessionStorage.removeItem(sessionKey);
    }

    /**
     * 根据标签页标题获取其页面查询模型的会话存储保存key
     */
    private getSessionKey(path = location.pathname) {
        return btoa(`${path}-session-key`);
    }
}
