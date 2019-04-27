import { EventEmitter } from '@angular/core';

export interface DynamicComponentBase {
    data?: any;
    outputEvent?: EventEmitter<any>;
}
