/**
 * @File: Photo editor models
 * @Author: wush
 */

/**
 * Client x/y
 */
export interface ClientXY {
    x: number;
    y: number;
}

export enum ZoomType {
    ZoomIn,
    ZoomOut
}

export interface ToolSetting {
    color: string;
    strokeWidth: number;
}
