// https://angular.io/docs/ts/latest/guide/style-guide.html#!#04-10

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    ButtonModule,
    CheckboxModule,
    ConfirmationService,
    ConfirmDialogModule,
    DialogModule,
    DropdownModule,
    InputTextareaModule,
    InputTextModule
} from 'primeng/primeng';
import { SelectItemPipeModule } from '../components/select-item.pipe';
import { AppComponentWatermarkModule } from '../components/watermark.directive';
import { MaxValidator, MinValidator } from '../core/validators';
import { FormModeService } from '../shared/form-mode';
import { CalendarLocaleService } from './calendar-locale.service';
import { MenuButtonDirectiveModule } from '../components/menu-button.directive';
import { ModelStorageService } from './model-storage.service';
import { ProductSelectModule } from '../components/product-select.component';
import { TabViewMenuService } from './tab-view-menu.service';
import { MenuTabPermissionDirectiveModule } from '../components/menu-tab.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        CheckboxModule,
        DropdownModule,
        SelectItemPipeModule,
        MenuButtonDirectiveModule,
        ProductSelectModule,
        MenuTabPermissionDirectiveModule
    ],
    declarations: [
        MinValidator,
        MaxValidator
    ],
    providers: [
        ConfirmationService,
        FormModeService,
        CalendarLocaleService,
        ModelStorageService,
        TabViewMenuService
    ],
    exports: [
        CommonModule,
        FormsModule,
        MinValidator,
        MaxValidator,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        CheckboxModule,
        ConfirmDialogModule,
        DialogModule,
        DropdownModule,
        SelectItemPipeModule,
        AppComponentWatermarkModule,
        MenuButtonDirectiveModule,
        ProductSelectModule,
        MenuTabPermissionDirectiveModule
    ]
})
export class SharedModule {
}
