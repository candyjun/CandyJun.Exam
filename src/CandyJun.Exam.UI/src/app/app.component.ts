import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { MessageService } from './core/message.service';
import { ModelStorageService } from './shared/model-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'app';
  public hide: boolean = true;

  public constructor(private readonly router: Router,
    private readonly messageService: MessageService,
    private readonly modelStorageService: ModelStorageService,
    private readonly changeDetectorRef: ChangeDetectorRef) {
    this.modelStorageService.remove();
    // 通过手动控制loading显示隐藏
    this.messageService.loadingSubject
      .subscribe((v: boolean) => {
        this.hide = v;
        this.changeDetectorRef.detectChanges();
      });

    this.router.events.subscribe((event) => {
      // 在路由开始显示loading
      if (event instanceof NavigationStart) {
        this.hide = false;
      }

      if (event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // 在路由结束或错误时隐藏loading
        this.hide = true;
      }
    }
    );
  }
}
