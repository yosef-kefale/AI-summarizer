import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent, editMode, LoggerService, T } from '@erp-fe/core';
import { LocalePipe } from '@erp-fe/shared';
import { NzModalService } from 'ng-zorro-antd';
import { takeUntil } from 'rxjs/operators';
import { ModalInvestigatorAssignmentComponent } from '../modal-investigator-assignment/modal-investigator-assignment.component';

@Component({
  selector: 'erp-fe-investigator-assignment-form',
  templateUrl: './investigator-assignment-form.component.html'
})
export class InvestigatorAssignmentFormComponent extends BaseComponent implements OnInit, OnChanges {
  @Input() locale;
  @Input() languages;
  @Input() id;
  @Input() editMode: editMode = 'new';
  // @Input() category: any;
  @Input() investigators: any;
  @Input() selectedItems: any;
  @Input() Investigators: any[] = [];
  @Input() creating = false;
  @Output() readonly create = new EventEmitter<any>();
  // @Output() readonly assignUnit = new EventEmitter();
  @Output() readonly delete = new EventEmitter<any>();
  @Output() readonly update = new EventEmitter<any>();
  InvestigatorForm: FormGroup;
  selectedAssignment;
  hasRequiredLocale = false;
  hasOptionalLocale = false;
  showOptionalLocale = false;
  Investigator: any[] = [];
  changes = false;

  constructor(
    private readonly logger: LoggerService,
    private readonly cd: ChangeDetectorRef,
    private readonly fb: FormBuilder,
    private readonly modalService: NzModalService,
    private readonly localePipe: LocalePipe
  ) {
    super();
  }

  ngOnInit(): void {
    this.Investigator = JSON.parse(JSON.stringify(this.Investigators));
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.Investigator = JSON.parse(JSON.stringify(this.Investigators));
  }
  onCreate(result): void {
    this.create.emit(result);
  }
  onUpdate(result): void {
    this.update.emit(result);
  }
  addInvestigator(): void {
    const modal = this.modalService.create({
      nzWidth: '60%',
      nzTitle: 'Investigator ',
      nzContent: ModalInvestigatorAssignmentComponent,
      nzClosable: true,
      nzMask: true,
      nzMaskClosable: false,
      nzComponentParams: {
        selectedAssignment: this.investigators
      }
    });
    modal.afterClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any[]) => {
      if (result) {
        this.logger.log('lpl', result);
        this.onCreate(result);
        this.investigators = result;
        this.cd.markForCheck();
        this.cd.detectChanges();
        // console.log(result);
        console.log('Api Call');
        // this.selectedItems = result
      }
    });
  }

  display(data, i): void {
    const updateModal = this.modalService.create({
      nzWidth: '50%',
      nzTitle: 'Investigator Detail',
      nzContent: ModalInvestigatorAssignmentComponent,
      nzClosable: true,
      nzMask: true,
      nzMaskClosable: false,
      nzComponentParams: {
        // InvestigatorUpdate: true,
        // Investigator: data,
        // categoryId: this.category.id,
        // id: data.id
      }
    });
    updateModal.afterClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any) => {
      if (result) {
        this.onUpdate(result);
      }
    });
  }
  onDelete(data, index): void {
    this.changes = true;
    this.logger.log('data', index, data);
    this.modalService.confirm({
      nzTitle: T('Are you sure delete this Investigator?'),
      nzContent: `${T('Investigator Name')} :  ${this.localePipe.transform(data.Investigators)}`,
      nzOkText: T('Yes'),
      nzOkType: 'danger',
      nzOnOk: () => {
        this.delete.emit(data);
      },
      nzCancelText: 'No'
    });
  }

  trackBy(index): number {
    return index;
  }
}
