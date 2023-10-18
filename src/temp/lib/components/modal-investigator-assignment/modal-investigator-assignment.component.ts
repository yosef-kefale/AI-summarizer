import { Component, Inject, Input, OnInit } from '@angular/core';
import { ApplicationState, Environment, LoggerService, T } from '@erp-fe/core';
import { CollectionSelectorConfig } from '@erp-fe/features/collection-selector';
import { Store } from '@ngxs/store';
import { NzModalRef } from 'ng-zorro-antd';

@Component({
  selector: 'erp-fe-modal-investigator-assignment',
  templateUrl: './modal-investigator-assignment.component.html'
})
export class ModalInvestigatorAssignmentComponent implements OnInit {
  selectedAssignment;
  organizationId = this.store.selectSnapshot(ApplicationState.currentOrganization).id;
  config: CollectionSelectorConfig;
  selectedRow;
  selectedTab: any;
  temporary: any[] = [];
  isRoleCollapsed = true;
  collectionEndpoint;
  isVisible = false;
  isConfirmLoading = false;
  InvestigatorUpdate = false;
  investigator;

  complaintId;

  constructor(
    @Inject('environment') private readonly environment: Environment,
    private readonly logger: LoggerService,
    private readonly store: Store,
    private readonly modal: NzModalRef
  ) {
    // this.collectionEndpoint = {
    //   personnel: `${this.environment.urls.api}/registration/api/personnel/get-all`
    // };
    this.collectionEndpoint = {
      personnel: `${this.environment.urls.api}/registration/api/personnel/get-personnel-by-roles?applicationKey=tendering&roleKeys=complaint-investigator`
    };
  }

  ngOnInit(): void {
    this.temporary = this.selectedAssignment;
    const visibleColumns = [];
    let primaryKey;
    primaryKey = 'id';
    visibleColumns.push(
      {
        name: T('First Name'),
        key: 'firstName',
        hasLocale: true
      },
      {
        name: T('Email'),
        key: 'email',
        hasLocale: false
      }
    );

    this.config = {
      multiple: false,
      title: 'personnel',
      identity: primaryKey,
      collectionQuery: {
        skip: 0,
        top: 10,
        filter: [
          [
            {
              field: 'organizationId',
              value: this.organizationId,
              operator: '='
            }
          ]
        ],
        searchFrom: ['firstName', 'lastName']
      },
      visibleColumn: visibleColumns,
      endpoint: this.collectionEndpoint.personnel
    };
  }

  selectedItems(data): void {
    this.selectedRow = data;
  }
  pageChange(data): void {
    this.logger.log(data);
    if (this.temporary.length > 0) {
      data.forEach((singleData) => {
        const arr = this.temporary.every((single) => single.id !== singleData.id);
        if (arr) {
          this.temporary = [...this.temporary, singleData];
        }
      });
    } else {
      data.forEach((singleData) => {
        this.temporary = [...this.temporary, singleData];
      });
    }
  }
  onDone(): void {
    if (this.selectedRow) {
      const data = {
        complaintId: this.complaintId,
        investigatorId: this.selectedRow.id,
        investigatorFullName: this.selectedRow.fullName
      };
      this.modal.destroy(data);
    }
  }
  destroyModal():void{
    this.modal.destroy();
  }
}
