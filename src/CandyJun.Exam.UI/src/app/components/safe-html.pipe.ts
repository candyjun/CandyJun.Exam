/**
 * @File: 解析安全的含样式的 Html 字符串
 * @Author: wush
 */
import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, NgModule, PipeTransform } from '@angular/core';

@Pipe({ name: 'appSafeHtml'})
export class SafeHtmlPipe implements PipeTransform  {

  public constructor(private sanitized: DomSanitizer) {}

  public transform(value: string) {
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

@NgModule({
    declarations: [SafeHtmlPipe],
    exports: [SafeHtmlPipe]
})
export class SafeHtmlPipeModule {
}
