/**
 * @File: videojs component
 * @Author: wush
 */
import { Component, ElementRef, Input, NgModule, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import * as videojs from 'video.js';

@Component({
    selector: 'app-components-video',
    template: `
        <!--用 *ngIf 的会找不到 videoEle-->
        <div [hidden]="notFound">
            <div [hidden]="!url">
                <video #videoEle controls preload="auto" dir="ltr"
                        class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9">
                    <source [src]="url" type="video/mp4"/>
                    <source [src]="url" type="video/webm"/>
                    <source [src]="url" type="video/ogg"/>
                    <source [src]="url" type="video/wmv"/>
                    <p class="">请升级浏览器！</p>
                </video>
            </div>
            <div class="p-3 text-center text-info" [hidden]="url">
                <i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>
                <h5>正在加载视频...</h5>
            </div>
        </div>
        <div class="p-3" *ngIf="notFound">
            <h5 class="text-danger"><i class="fa fa-exclamation-triangle"></i> 当前无视频!</h5>
        </div>
    `,
    styles: [`
        .video-js.vjs-16-9 {
            padding-top: 354px;
        }
    `]
})
export class VideoComponent implements OnChanges {
    /**
     * not found video
     */
    @Input()
    public notFound: boolean;
    /**
     * video asset url
     *
     */
    @Input()
    public url: string;
    /**
     * video element
     *
     */
    @ViewChild('videoEle') private elementRef: ElementRef;
    /**
     * video player
     *
     */
    private player: videojs.Player;

    public ngOnChanges(changes: SimpleChanges): void {
        const changeUrl = changes.url;
        if (changeUrl && changeUrl.currentValue) {
            this.initVideo();
        }
    }

    private initVideo() {
        const options = {
            autoplay: false,
            controlBar: {
                fullscreenToggle: false,
                currentTimeDisplay: true,
            }
        };
        try {
            this.player.dispose();
        } catch (e) {
            //
        }
        setTimeout(() => {
            this.player = videojs(this.elementRef.nativeElement, options, () => {

                this.player.on('loadstart', () => {
                    this.player.play();
                });

                this.player.on('loadeddata', () => {
                    this.player.pause();
                });

                window.onresize = this.resizeVideoJS;
                this.resizeVideoJS();
            });
        });
    }

    private resizeVideoJS() {
        if (this.elementRef) {
            const width = this.elementRef.nativeElement.parentElement.offsetWidth;
            const aspectRatio = 264 / 640;
            this.player.width(width);
            this.player.height(width * aspectRatio);
        }
    }
}

@NgModule({
    imports: [SharedModule],
    declarations: [VideoComponent],
    exports: [VideoComponent]
})
export class VideoJsModule {}
