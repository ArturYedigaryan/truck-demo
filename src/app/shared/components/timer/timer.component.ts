import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map, startWith } from 'rxjs';

@Component({
  selector: 'shared-timer',
  standalone: true,
  templateUrl: './timer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerComponent {
  startDate = input<string | null>(null);

  private now = toSignal(
    interval(1000).pipe(
      startWith(0),
      map(() => Date.now()),
    ),
    { initialValue: Date.now() },
  );

  elapsed = computed(() => {
    const start = this.startDate();
    if (!start) return null;
    return Math.floor((this.now() - new Date(start).getTime()) / 1000);
  });

  formattedTime = computed(() => {
    const seconds = this.elapsed();
    if (seconds == null || seconds < 0) return '--:--';
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  });
}
