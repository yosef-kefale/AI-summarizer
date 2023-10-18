import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationSettingService, ApplicationState, BaseComponent, CollectionQuery, Environment, LoggerService, T } from '@erp-fe/core';
import { Store } from '@ngxs/store';
import { NzModalService } from 'ng-zorro-antd';
import { interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalFileViewerComponent } from '../../components/modal-file-viewer/modal-file-viewer.component';
import { ComplainHandlingFacadeService } from '../../facades/complain-handling-facade.service';
import { ModalClarificationFormComponent } from '../../components/modal-clarification-form/modal-clarification-form.component';
import { ClarificationResponse } from '../../models/clarification';

@Component({
  selector: 'erp-fe-complain-detail',
  templateUrl: './complain-detail.component.html'
})
export class ComplainDetailComponent extends BaseComponent implements OnInit {
  selectedComplain$ = this.facade.selectedComplain$;
  complainResponse$ = this.facade.complainResponse$;
  complainDetailLoading$ = this.facade.complainDetailLoading$;
  complainResponseLoading$ = this.facade.complainResponseLoading$;
  messages$ = this.facade.messages$;
  messagesLoading$ = this.facade.messagesLoading$;
  url;

  escalatedItem$ = this.facade.escalatedItem$;
  escalatedDetailLoading$ = this.facade.escalatedDetailLoading$;

  clarificationRequest: any[];
  clarificationResponse: any[];

  clarificationsList$ = this.facade.clarifications$;

  newComplainLetter$ = this.facade.complainLetter$;

  subscription: Subscription;
  source = interval(10000);
  condition = 'live';
  objectId;
  complain;
  escalated = false;
  isResponse = false;
  currentRole;
  isReplay = false;
  selectedMessage;

  sender;
  receiver;
  selectedData;
  blobFile;
  attachmentEndPoint;
  constructor(
    private readonly logger: LoggerService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly facade: ComplainHandlingFacadeService,
    private readonly store: Store,
    private readonly router: Router,
    private readonly applicationSetting: ApplicationSettingService,
    private readonly http: HttpClient,
    private readonly modalService: NzModalService,
    @Inject('environment') private readonly environment: Environment
  ) {
    super();

    this.subscription = this.source.pipe(takeUntil(this.ngUnsubscribe)).subscribe((val) => {
      if (this.condition === 'live') {
        this.listMessage();
      }
    });
    this.attachmentEndPoint = `${environment.urls.api}/complaint/api/complaints/get-attachment`;
  }

  ngOnInit(): void {
    this.store
      .select(ApplicationState.currentRole)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.currentRole = user?.key;
        if (this.currentRole === 'technical-expert') {
          this.sender = 'PTT';
          this.receiver = ['HOPE'];
        } else if (this.currentRole === 'procurement-unit-head') {
          this.sender = 'PUH';
          this.receiver = ['HOPE'];
        } else if (this.currentRole === 'head-of-procuring-entity') {
          this.sender = 'HOPE';
          this.receiver = ['Supplier', 'PTT', 'PUH'];
        }
      });
    this.logger.log('......', this.currentRole);
    this.selectedComplain$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      this.selectedData = data;
    });
    this.logger.log('...aa...', this.selectedData);

    this.activatedRoute.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.objectId = params.get('id');
      this.facade.detail(params.get('id'));
      this.facade.getResponse(params.get('id'));
      this.listMessage();
    });

    this.facade.selectedComplain$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      this.complain = data;
      this.getClarificationsInComplain();
      this.getLetter();
    });
  }

  getClarificationsInComplain() {
    const request: CollectionQuery = {
      top: 10,
      skip: 0
    };
    const parentId = this.complain?.escalated?.id;
    console.log('*****', parentId)
    if (parentId) {
      this.facade.getClarificationsInComplain(request, parentId);
    }
  }

  response(_data): void {
    this.facade.createResponse({ data: _data, url: this.url });
    this.isResponse = false;
  }
  updateResponse(_data): void {
    this.url = this.router.url;
    this.facade.createResponse({ data: _data, url: this.url });
    this.isResponse = false;
  }
  onSend(data): void {
    this.facade.sendMessage(data);
    this.isReplay = !this.isReplay;
  }
  listMessage(): void {
    const request: CollectionQuery = {
      top: 10,
      skip: 0,
      filter: [
        [
          {
            field: 'receiver',
            value: 'HOPE',
            operator: '='
          },
          {
            field: 'sender',
            value: 'HOPE',
            operator: '='
          },
          {
            field: 'receiver',
            value: 'PTT',
            operator: '='
          },
          {
            field: 'sender',
            value: 'PTT',
            operator: '='
          },
          {
            field: 'receiver',
            value: 'PUH',
            operator: '='
          },
          {
            field: 'sender',
            value: 'PUH',
            operator: '='
          }
        ]
      ]
    };
    if (!this.escalated) {
      this.facade.listMessage(this.objectId, request);
    }
  }
  complains(): void {
    this.escalated = false;
    this.facade.getResponse(this.objectId);
    this.listMessage();
  }
  listEscalated(): void {
    this.escalated = true;
    const request: CollectionQuery = {
      filter: [
        [
          {
            field: 'parentComplaintId',
            value: this.objectId,
            operator: '='
          }
        ],
        [
          {
            field: 'escalationStatus',
            value: 'escalated',
            operator: '='
          }
        ]
      ]
    };
    this.facade.getComplainEscalated(request, this.objectId);
  }
  createResponse(): void {
    this.isResponse = true;
  }
  back(): void {
    this.isResponse = false;
  }

  replay(item): void {
    this.isReplay = !this.isReplay;
    this.selectedMessage = item.id;
  }
  openFile(file): void {
    this.logger.log('file', file);
    this.http.get(`${this.attachmentEndPoint}/${file?.file_path}`, { responseType: 'blob' }).subscribe(
      (data) => {
        this.blobFile = data;

        this.modalService.create({
          nzWidth: '60%',
          nzTitle: file.file_name,
          nzClosable: false,
          nzOkDisabled: true,
          nzContent: ModalFileViewerComponent,
          nzComponentParams: {
            // tslint:disable-next-line:object-literal-shorthand
            file: this.blobFile,
            fileType: file.file_type
          }
        });
      },
      (error) => {
        this.logger.log(error);
      }
    );
  }
  createClarificationFormModal(clarificationId: string): void {
    const modal = this.modalService.create({
      nzWidth: '50%',
      nzTitle: T('Clarification'),
      nzContent: ModalClarificationFormComponent,
      nzClosable: true,
      nzMaskClosable: false,
      nzComponentParams: {
        objectId: this.objectId,
        currentRole: this.currentRole,
        clarificationId: clarificationId
        // objectType: this.objetType
      }
    });
    // Return a result when closed
    modal.afterClose.subscribe((result) => {
      if (result) {
        const parentId = this.complain?.escalated?.id;
      console.log(parentId)
        this.facade.createClarificationResponse({ data: result, url: this.url, complainId: parentId });
      }
    });
  }

  getLetter(): void {
    const request: CollectionQuery = {
      top: 10,
      skip: 0
    };
    const parentId = this.complain?.escalated?.id
    this.facade.getComplainLetter(request, parentId);
  }
}
