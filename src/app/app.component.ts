import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {LocalStorageService} from './services/local-storage.service';
import {Task} from './interfaces-and-types/coomon-interfaces';
import {ITEMS_LOCALSTORAGE_KEY, TASKS_STATUS} from './constants/common-constants';
import {takeWhile} from 'rxjs';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {TaskType} from './interfaces-and-types/common-types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChildren('itemsList') itemsList!: QueryList<CdkDragDrop<any>>;
  public itemFormControl = new FormControl(null, Validators.required);
  public filterFormControl = new FormControl(null);
  public inProgressTasks: Task[] = [];
  public postponedTasks: Task[] = [];
  public completedTasks: Task[] = [];
  public progressBar: number[] = [];
  public isDestroyed = false;
  public readonly TASKS_STATUS = TASKS_STATUS;

  public ngOnInit(): void {
    this.setTasks();
    this.filter();
  }

  public ngOnDestroy(): void {
    this.isDestroyed = true;
  }

  public addItem(): void {
    if (this.itemFormControl.value?.length > 0) {
      const task: Task = {
        id: (new Date()).getTime(),
        text: this.itemFormControl.value,
        status: TASKS_STATUS.IN_PROGRESS.type
      };
      this.itemFormControl.reset();
      const tasks: Task[] = this.getLocalStorageItems();
      const updatedTasks: Task[] = [...tasks, task];
      this.setLocalStorageItems(updatedTasks);
      this.setTasks(updatedTasks);
    }
  }

  public resetItems(): void {
    LocalStorageService.clear();
    this.setTasks();
  }

  public getAction(): void {
    this.setTasks();
  }

  public filter(): void {
    this.filterFormControl.valueChanges
      .pipe(takeWhile(() => !this.isDestroyed))
      .subscribe((val: string) => {
        let tasks: Task[] = this.getLocalStorageItems();
        val?.length > 0 ?
          this.setTasks(tasks.filter(task => task.text.includes(this.filterFormControl.value))) :
          this.setTasks(tasks);
      });
  }


  public drop(event: CdkDragDrop<any>): void {
    const itemId = event.item.element.nativeElement.id;
    if (!!itemId) {
      const droppedContainer = event.container.id as TaskType;
      const tasks: Task[] = this.getLocalStorageItems();
      const droppedItem = tasks.filter(task => task.id === +itemId)[0];
      if (!!droppedItem) {
        droppedItem.status = droppedContainer;
        const updatedItems: Task[] = [...tasks.filter(task => task.id !== +itemId), droppedItem];
        this.setLocalStorageItems(updatedItems);
        this.setTasks(updatedItems);
      }
    }
  }

  private setTasks(_tasks?: Task[]): void {
    const tasks: Task[] = _tasks || this.getLocalStorageItems();
    this.inProgressTasks = tasks.filter(task => task.status === TASKS_STATUS.IN_PROGRESS.type) || [];
    this.postponedTasks = tasks.filter(task => task.status === TASKS_STATUS.POSTPONED.type) || [];
    this.completedTasks = tasks.filter(task => task.status === TASKS_STATUS.COMPLETED.type) || [];

    if (tasks?.length > 0) {
      this.calculateStatusProgress(tasks.length);
    } else {
      this.progressBar = [0, 0, 0];
    }
  }

  private calculateStatusProgress(itemsLength: number): void {
    const calcProgressBar = (itemLength: number) => (itemLength / itemsLength) * 100;
    this.progressBar = [
      calcProgressBar(this.inProgressTasks.length),
      calcProgressBar(this.postponedTasks.length),
      calcProgressBar(this.completedTasks.length)
    ];
  }

  private getLocalStorageItems(): Task[] | [] {
    return LocalStorageService.getItem(ITEMS_LOCALSTORAGE_KEY) || [];
  }

  private setLocalStorageItems(tasks: Task[]): void {
    LocalStorageService.setItem(ITEMS_LOCALSTORAGE_KEY, tasks);
  }
}
