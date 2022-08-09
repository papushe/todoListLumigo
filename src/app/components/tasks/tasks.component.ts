import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {TaskActions} from '../../interfaces-and-types/common-types';
import {MatAccordion} from '@angular/material/expansion';
import {Task} from '../../interfaces-and-types/coomon-interfaces';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnChanges {
  @Input() public title!: string;
  @Input() public tasks: Task[] | undefined;
  @Input() public availableActions!: TaskActions[];
  @Output() public actionEmitter = new EventEmitter<void>();
  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;
  public panelOpenState = false;

  public ngOnChanges(changes: SimpleChanges): void {
    const items: Task[] = changes['tasks']?.currentValue || [];
    items.length === 0 && this.accordion?.closeAll();
  }

  public getActionFromItem(): void {
    this.actionEmitter.next();
  }
}
