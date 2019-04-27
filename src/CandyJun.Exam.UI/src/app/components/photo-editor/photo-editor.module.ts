import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ColorPickerModule } from 'primeng/primeng';
import { PhotoEditorComponent } from './photo-editor.component';
import { PhotoEditorToolsComponent } from './tools.component';

@NgModule({
    imports: [
        ColorPickerModule,
        SharedModule
    ],
    declarations: [
        PhotoEditorToolsComponent,
        PhotoEditorComponent
    ],
    exports: [
        PhotoEditorToolsComponent,
        PhotoEditorComponent
    ]
})
export class PhotoEditorModule {
}
