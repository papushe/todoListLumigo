import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TASKS_NUMBER} from '../../constants/common-constants';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  @Input() public progressBar: number[] | undefined;
  public readonly TASKS_NUMBER = TASKS_NUMBER;
}
