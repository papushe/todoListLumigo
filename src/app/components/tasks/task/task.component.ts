import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Task} from 'src/app/interfaces-and-types/coomon-interfaces';
import {TaskActions} from '../../../interfaces-and-types/common-types';
import {LocalStorageService} from '../../../services/local-storage.service';
import {ITEMS_LOCALSTORAGE_KEY} from '../../../constants/common-constants';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
  @Input() public task: Task | undefined;
  @Input() public availableActions: TaskActions[] | undefined;
  @Output() public actionEmitter = new EventEmitter<void>();

  public setAction(action: TaskActions): void {
    const tasks: Task[] = LocalStorageService.getItem(ITEMS_LOCALSTORAGE_KEY) || [];
    const task: Task = tasks.filter(task => task.id === this.task?.id)?.[0];

    if (!!task) {
      switch (action) {
        case 'clear':
          const clearItems = tasks.filter(task => task.id !== this.task?.id);
          this.setUpdatedList(clearItems);
          break;
        case 'pause':
          task.status = 'postponed';
          const postponedItems = tasks.filter(task => task.id !== this.task?.id);
          this.setUpdatedList([...postponedItems, task]);
          break;
        case 'done':
          task.status = 'completed';
          const completedItems = tasks.filter(task => task.id !== this.task?.id);
          this.setUpdatedList([...completedItems, task]);
          break;
      }
    }
    this.actionEmitter.next();
  }

  private setUpdatedList(items: Task[]): void {
    LocalStorageService.setItem(ITEMS_LOCALSTORAGE_KEY, items);
  }
}
