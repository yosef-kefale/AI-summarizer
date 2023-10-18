import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationState, BaseComponent, CollectionQuery, LoggerService } from '@erp-fe/core';
import { Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { ComplainHandlingFacadeService } from '../../facades/complain-handling-facade.service';

@Component({
  selector: 'erp-fe-complain-list',
  templateUrl: './complain-list.component.html',
  styleUrls: ['./complain-list.component.scss']
})
export class ComplainListComponent extends BaseComponent implements OnInit {
  viewMode = 'list';
  complains$ = this.facade.complains$;
  selectedComplain$ = this.facade.selectedComplain$;
  totalComplain$ = this.facade.totalComplain$;

  selectedItem;
  complainsLoading$ = this.facade.complainsLoading$;
  objectId: string;
  objectType: string;
  pageIndex = 1;
  pageSize = 10;
  collectionRequest: CollectionQuery;
  currentRole;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly facade: ComplainHandlingFacadeService,
    private readonly router: Router,
    private readonly logger: LoggerService,
    private readonly store: Store
  ) {
    super();

    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.viewMode = this.activatedRoute.children.length > 0 ? 'detail' : 'list';
    });
  }
  ngOnInit(): void {
    if (this.currentRole === 'sec') {
      // mapp and filter
    } else (this.currentRole == "responder")
    this.complains$.subscribe(res => {
      res = res.filter(item => item.investigator?.includes('currentRole'));
    })
    this.store
      .select(ApplicationState.currentRole)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => (this.currentRole = user?.key));
    this.logger.log(this.currentRole);
    this.activatedRoute.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.objectId = params.get('id');
      this.objectType = params.get('key');
      if (this.objectId) {
        const collection: CollectionQuery = {
          skip: 0,
          top: 10,
          filter: [
            [
              {
                field: 'objectId',
                value: this.objectId,
                operator: '='
              }
            ],
            [
              {
                field: 'objectType',
                value: this.objectType,
                operator: '='
              }
            ]
          ],

          orderBy: [{ field: 'timestamp', direction: 'desc' }]
        };
        this.facade.listComplain(collection);
      }
    });
  }
  onPageIndexChange(page: number): void {
    const collection: CollectionQuery = {
      skip: (page - 1) * this.pageSize,
      top: this.pageSize,
      filter: [
        [
          {
            field: 'objectId',
            value: this.objectId,
            operator: '='
          }
        ],
        [
          {
            field: 'objectType',
            value: this.objectType,
            operator: '='
          }
        ]
      ],
      orderBy: [{ field: 'timestamp', direction: 'desc' }]
    };
    this.facade.listComplain(collection);
  }
  onPageSizeChange(page: number): void {
    const collection: CollectionQuery = {
      skip: 0,
      top: page,
      filter: [
        [
          {
            field: 'objectId',
            value: this.objectId,
            operator: '='
          }
        ],
        [
          {
            field: 'objectType',
            value: this.objectType,
            operator: '='
          }
        ]
      ],
      orderBy: [{ field: 'timestamp', direction: 'desc' }]
    };
    this.facade.listComplain(collection);
  }
}
