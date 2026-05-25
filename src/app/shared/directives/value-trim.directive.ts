import { Directive, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[valueTrim]'
})
export class ValueTrimDirective {
  private readonly ngControl = inject(NgControl);
  private readonly el = this.ngControl;

  @HostListener('blur')
  @HostListener('keydown.enter')
  trimValue(): void {
    if (this.el.control?.value) {
      const value = this.el.control.value;
      if (value !== value.trim()) {
        this.el.control?.patchValue(value.trim());
      }
    }
  }
}
