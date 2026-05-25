import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'shared-empty-data',
  standalone: true,
  templateUrl: './empty-data.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyDataComponent {
  @Input() title = '';
}
