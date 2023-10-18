import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationSettingService, ApplicationState, BaseComponent, CollectionQuery, LoggerService } from '@erp-fe/core';
import { map, pluck, takeUntil } from 'rxjs/operators';
import { ComplainHandlingFacadeService } from '../../facades/complain-handling-facade.service';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { log } from 'util';

@Component({
  selector: 'erp-fe-complain-board',
  templateUrl: './complain-board.component.html'
})
export class ComplainBoardComponent extends BaseComponent implements OnInit {
  viewMode = 'list';
  tableData$: Observable<any[]>;
  escalatedItems$ = this.facade.escalatedItems$;
  investigatorItems$ = this.facade.escalatedItems$;
  selectedComplain$ = this.facade.selectedComplain$;
  totalComplain$ = this.facade.totalComplain$;
  selectedItem;
  escalatedItemsLoading$ = this.facade.escalatedItemsLoading$;
  objectId: string;
  objectType = this.applicationSetting?.setting?.key;
  pageIndex = 1;
  pageSize = 10;
  collectionRequest: CollectionQuery;

  currentRole$ = this.store.select(ApplicationState.currentRole);
  currentUser$ = this.store.select(ApplicationState.previousOrganization);
  currentUser: any;
  investigatorComplaints$ = this.facade.investigatorComplaints$;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly facade: ComplainHandlingFacadeService,
    private readonly router: Router,
    private readonly logger: LoggerService,
    private readonly applicationSetting: ApplicationSettingService,
    private readonly store: Store
  ) {
    super();
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.viewMode = this.activatedRoute.children.length > 0 ? 'detail' : 'list';
    });
  }
  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      if (this.objectType) {
        const collection: CollectionQuery = {
          skip: 0,
          // top: 10,
          filter: [
            [
              {
                field: 'escalationStatus',
                value: 'escalated',
                operator: '='
              }
            ]
          ],
          orderBy: [{ field: 'timestamp', direction: 'desc' }]
        };
        this.facade.listComplainEscalated(collection);
      }
    });

    this.currentUser$.subscribe((res) => {
      this.currentUser = res;

      const data = localStorage.getItem('selectedOrganization');
      const obj = JSON.parse(data);
      const loggedPersonnelId = obj.personnelId;
      console.log();

      this.getInvestigatorComplaint(loggedPersonnelId);
    });

    this.currentRole$.subscribe((currentRole) => {
      if (currentRole?.key === 'complaint-investigator') {
        this.tableData$ = this.investigatorComplaints$;
        this.investigatorComplaints$.subscribe(res => {
          console.log(res);
        })
      } else {
        this.tableData$ = this.escalatedItems$;
      }
    });

  }

  getInvestigatorComplaint(id) {
    const request: CollectionQuery = {
     //top: 10,
      skip: 0
    };
    this.facade.getInvestigatorComplaints(request, id);
  }

  onPageIndexChange(page: number): void {
    const collection = {
      skip: (page - 1) * this.pageSize,
      top: this.pageSize,
      filter: [
        [
          {
            field: 'escalationStatus',
            value: 'escalated',
            operator: '='
          }
        ]
      ]
    };
    this.facade.listComplain(collection);
  }
  onPageSizeChange(page: number): void {
    const collection = {
      skip: 0,
      top: page,
      filter: [
        [
          {
            field: 'escalationStatus',
            value: 'escalated',
            operator: '='
          }
        ]
      ]
    };
    this.facade.listComplain(collection);
    this.escalatedItems$.subscribe(res => {
      console.log(res);

    })
  }
}
