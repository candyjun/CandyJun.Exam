import { Directive, forwardRef, Input, OnChanges, Provider, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

/* tslint:disable */
function isEmptyInputValue(value: any): boolean {
    // we don't check for string here so it also works with arrays
    return value === null || value === undefined || value.length === 0;
}

// https://github.com/angular/angular/pull/17622
export const MIN_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MinValidator),
    multi: true
};

/**
 * A directive which installs the {@link MinValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `min` attribute.
 *
 * @experimental
 */
@Directive({
    selector: '[min][formControlName],[min][formControl],[min][ngModel]',
    providers: [MIN_VALIDATOR],
    host: { '[attr.min]': 'min ? min : null' }
})
export class MinValidator implements Validator,
    OnChanges {
    @Input() min: string;
    private _validator: ValidatorFn;
    private _onChange: () => void;

    ngOnChanges(changes: SimpleChanges): void {
        if ('min' in changes) {
            this._createValidator();
            if (this._onChange) {
                this._onChange();
            }
        }
    }

    validate(c: AbstractControl): ValidationErrors | null { return this._validator(c); }

    registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

    private _createValidator(): void { this._validator = Validators.min(parseInt(this.min, 10)); }
}


export const MAX_VALIDATOR: Provider = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => MaxValidator),
    multi: true
};

/**
 * A directive which installs the {@link MaxValidator} for any `formControlName`,
 * `formControl`, or control with `ngModel` that also has a `min` attribute.
 *
 */
@Directive({
    selector: '[max][formControlName],[max][formControl],[max][ngModel]',
    providers: [MAX_VALIDATOR],
    host: { '[attr.max]': 'max ? max : null' }
})
export class MaxValidator implements Validator,
    OnChanges {
    @Input() max: string;
    private _validator: ValidatorFn;
    private _onChange: () => void;

    ngOnChanges(changes: SimpleChanges): void {
        if ('max' in changes) {
            this._createValidator();
            if (this._onChange) {
                this._onChange();
            }
        }
    }

    validate(c: AbstractControl): ValidationErrors | null { return this._validator(c); }

    registerOnValidatorChange(fn: () => void): void { this._onChange = fn; }

    private _createValidator(): void { this._validator = Validators.max(parseInt(this.max, 10)); }
}

export class Validators {
    /**
     * Validator that requires controls to have a value greater than a number.
     */
    public static min(min: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (isEmptyInputValue(control.value) || isEmptyInputValue(min)) {
                return null;  // don't validate empty values to allow optional controls
            }
            const value = parseFloat(control.value);
            // Controls with NaN values after parsing should be treated as not having a
            // minimum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-min
            return !isNaN(value) && value < min ? { min: { min, actual: control.value } } : null;
        };
    }

    /**
     * Validator that requires controls to have a value less than a number.
     */
    public static max(max: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (isEmptyInputValue(control.value) || isEmptyInputValue(max)) {
                return null;  // don't validate empty values to allow optional controls
            }
            const value = parseFloat(control.value);
            // Controls with NaN values after parsing should be treated as not having a
            // maximum, per the HTML forms spec: https://www.w3.org/TR/html5/forms.html#attr-input-max
            return !isNaN(value) && value > max ? { max: { max, actual: control.value } } : null;
        };
    }
}
