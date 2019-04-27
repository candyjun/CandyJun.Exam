import { Injectable } from '@angular/core';

export enum FormMode {
    Create = '新增',
    Update = '修改',
}

@Injectable()
export class FormModeService {
    public isUpdate(mode: FormMode): boolean {
        return mode === FormMode.Update;
    }
}
