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
import { MaxValidator, MinValidator } from '../core/validators';
import { FormModeService } from '../shared/form-mode';
import { CalendarLocaleService } from './calendar-locale.service';
import { ModelStorageService } from 'app/shared/model-storage.service';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        CheckboxModule,
        DropdownModule,
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
    ]
})
export class SharedModule {
}
