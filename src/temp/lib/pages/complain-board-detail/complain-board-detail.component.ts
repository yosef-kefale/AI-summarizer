import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationSettingService, ApplicationState, BaseComponent, CollectionQuery, Environment, LoggerService, T } from '@erp-fe/core';
import { Store } from '@ngxs/store';
import { NzModalService } from 'ng-zorro-antd';
import { interval, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalFileViewerComponent } from '../../components/modal-file-viewer/modal-file-viewer.component';
import { ModalRemarkComponent } from '../../components/modal-remark/modal-remark.component';
import { ComplainHandlingFacadeService } from '../../facades/complain-handling-facade.service';
import { ModalClarificationFormComponent } from '../../components/modal-clarification-form/modal-clarification-form.component';
import { ComplainResponse } from '../../models/complain-response';
import { ClarificationRequest } from '../../models/clarification';
import { Recommendation } from '../../models/recommendation';
import { ModalInvestigatorAssignmentComponent } from '../../components/modal-investigator-assignment/modal-investigator-assignment.component';
import { Letter } from '../../models/letter';
import { LetterActionEnum } from '../../models/letterActionEnum';
import { RecommendationActionEnum } from '../../models/recommendationActionEnum';

@Component({
  selector: 'erp-fe-complain-board-detail',
  templateUrl: './complain-board-detail.component.html'
})
export class ComplainBoardDetailComponent extends BaseComponent implements OnInit {
  @Input() currentRole;
  @Input() letterDetail;
  @Input() complaint;
  @ViewChild('remarkTemplate', { static: true }) remarkTemplate: TemplateRef<any>;

  currentOrganization$ = this.store.select(ApplicationState.currentOrganization);
  currentRole$ = this.store.select(ApplicationState.currentRole);
  selectedComplain$ = this.facade.selectedComplain$;
  selectedSummary$ = this.facade.selectedSummary$;
  summaryDetailLoading$ = this.facade.summaryDetailLoading$;
  hopResponse$ = this.facade.hopResponse$;
  boardResponse$ = this.facade.boardResponse$;
  secretaryRecommendationSummary$ = this.facade.secretaryRecommendationSummary$;
  assignedInvestigators$ = this.facade.assignedInvestigators$; // list
  assignedInvestigator$ = this.facade.assignedInvestigator$; // single

  activeInvestigator$ = this.facade.activeInvestigator$;

  clarificationResponse$ = this.facade.clarificationResponse$;
  complainDetailLoading$ = this.facade.complainDetailLoading$;
  escalatedIComplainResponse$ = this.facade.complainResponse$;
  investigatorLetter$ = this.facade.investigatorLetter$;
  complainResponse$ = this.facade.complainResponse$;
  complainResponseLoading$ = this.facade.complainResponseLoading$;
  messages$ = this.facade.messages$;
  boards$ = this.facade.boards$;
  messagesLoading$ = this.facade.messagesLoading$;
  url;

  escalatedItem$ = this.facade.selectedComplain$;
  escalatedDetailLoading$ = this.facade.complainDetailLoading$;

  subscription: Subscription;
  source = interval(10000);
  condition = 'live';
  objectId;
  isVisible = false;
  isReason = false;
  complain;
  escalated = false;
  isResponse = false;
  isHoop = false;
  remarkForm: FormGroup;
  blobFile;
  attachmentEndPoint;

  recommendation: Recommendation;
  letter: Letter;
  letterCount: number;
  existingData: any;

  updatedNewLater: any;

  clarificationsList$ = this.facade.clarifications$;
  complainInvestigatorsList$ = this.facade.complainInvestigators$;

  newComplainLetter$ = this.facade.complainLetter$;

  clarifications: any[];
  assignedInvestigator: any;
  investigatorsList: any[];
  allClarificationResponses: any[];
  recommendationActionTaken: string;
  currentlyAssignedInvestigator: any;

  testData: any;

  constructor(
    private readonly logger: LoggerService,
    private readonly fb: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly facade: ComplainHandlingFacadeService,
    private readonly store: Store,
    private readonly router: Router,
    private readonly modalService: NzModalService,
    private readonly applicationSetting: ApplicationSettingService,
    private readonly http: HttpClient,
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
    this.url = this.router.url;
    this.remarkForm = this.fb.group({
      remark: [undefined]
    });

    this.store
      .select(ApplicationState.currentRole)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.currentRole = user?.key;
      });

    this.activatedRoute.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe((params) => {
      this.objectId = params.get('id');
      this.facade.detail(params.get('id'));
      this.facade.secretaryRecommendationSummaryDetail(params.get('id'));
      this.facade.getResponse(params.get('id'));
      this.listMessage();
    });
    this.getInitValues();

  }

  async getInitValues() {
    this.facade.selectedComplain$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      this.complain = data;
      if (this.complain) {
        this.getClarificationsInComplain();
        this.getHopResponse(this.complain);
        this.getActiveInvestigator(this.complain);
      }

    });

    this.facade.secretaryRecommendationSummary$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      this.recommendation = data;
    });

    this.facade.listBoard();
  }

  getClarificationsInComplain() {
    const request: CollectionQuery = {
      top: 10,
      skip: 0
    };
    this.facade.getInvestigatorComplaints(request, this.complain?.id);
    this.complainInvestigatorsList$.subscribe((res) => {
      this.assignedInvestigator = res;
    });
    this.facade.getClarificationsInComplain(request, this.complain?.id);

    this.getLetter();
  }

  getActiveInvestigator(complain) {
    const request: CollectionQuery = {
      top: 10,
      skip: 0
    };
    this.facade.getActiveInvestigator(request, this.complain?.id);
    this.activeInvestigator$.subscribe(res => {
      this.currentlyAssignedInvestigator = res;
    })
  }

  getClarificationResponse(id: string) {
    const filtered = this.allClarificationResponses?.filter((res) => {
      res.clarificationId = id;
    });

    if (filtered?.length > 0) {
      return filtered[0];
    }
  }

  getAssignedInvestigator() {

    if (this.sortData.length > 0) {
      const investigatorData = this.investigatorsList?.filter((res) => res.id === this.sortData[0].investigatorId);
      if (investigatorData?.length > 0) {
        return investigatorData[0];
      }
    }
  }

  get sortData() {
    const filtered = this.assignedInvestigator.filter(item => item.isActive.includes('True'));
    return filtered.sort((a, b) => {
      return <any>new Date(b.createdOn) - <any>new Date(a.createdOn);
    });
  }

  getHopResponse(complain): void {
    const request: CollectionQuery = {
      top: 10,
      skip: 0
    };
    this.facade.getHopResponse(request, complain?.parentComplaintId);
    this.facade.getBoardResponse(request, complain?.id);
  }
  getRecommendation(id): void {

    this.facade.secretaryRecommendationSummaryDetail(id);

  }
  getLetter(): void {
    // const request: CollectionQuery = {
    //   top: 10,
    //   skip: 0
    // };
    // this.facade.getLetter(request);
    const request: CollectionQuery = {
      top: 10,
      skip: 0
    };
    this.facade.getComplainLetter(request, this.complain?.id);
    this.newComplainLetter$?.subscribe(res => {
      this.letter = res?.items;
      this.updatedNewLater = res?.items;
      this.letterCount = res?.total;
    })

  }

  response(_data): void {
    this.isResponse = false;
  }
  updateResponse(_data): void {
    this.url = this.router.url;
    this.facade.createResponse({ data: _data, url: this.url });
    this.back();
  }
  recommendationUpdateData(_data) {
    this.selectedSummary$.subscribe((res) => {
      this.recommendation = res;
    });
    //this.existingData = this.recommendation;
    const updateData: Recommendation = {
      ..._data.data,
      // complaintId: this.complain.id,
      id: this.recommendation.id
    };
    return updateData;
  }

  onRecommendationCreate(_data) {
    this.url = this.router.url;

    const data: Recommendation = {
      ComplaintId: this.complain.id,
      ..._data
    };

    if (_data.recommendationActionTakenPassed === RecommendationActionEnum[0].toString()) {
      this.facade.createDraftRecommendation({ data: _data.data, url: this.url });
      this.back();
    } else if (_data.recommendationActionTakenPassed === RecommendationActionEnum[1].toString()) {
      //update the existing draft data
      // this.recommendationUpdateData(_data)
      this.facade.updateDraftRecommendation({ data: this.recommendationUpdateData(_data), url: this.url });

      this.back();
    } else if (_data.recommendationActionTakenPassed === RecommendationActionEnum[2].toString()) {
      // create the new data as submitted
      this.facade.createSubmitRecommendation({ data: _data.data, url: this.url });
      this.back();
    } else if (_data.recommendationActionTakenPassed === RecommendationActionEnum[3].toString()) {
      //update the existing draft data as sumitted
      this.facade.updateDraftRecommendationAsSubmit({ data: this.recommendationUpdateData(_data), url: this.url });
      this.back();
    }
  }

  onRecommendationResponseSubmit(_data) {
    this.url = this.router.url;

    if (_data.recommendationActionTakenPassed === RecommendationActionEnum[5].toString()) {
      this.facade.updateSecretaryRecommendationStatusAsAdjust({ data: this.recommendationUpdateData(_data), url: this.url });
      this.back();
    } else if (_data.recommendationActionTakenPassed === RecommendationActionEnum[6].toString()) {
      this.facade.updateRecommendationStatusAsApprove({ data: this.recommendationUpdateData(_data), url: this.url });
      this.back();
    }

  }

  onLetterResponseSubmit(_data) {
    this.url = this.router.url;

    if (_data.letterActionTakenPassed === LetterActionEnum[4].toString()) {
      this.facade.updateLetterStatusAsAdjust({ data: _data.data, url: this.url });
      this.back();
    } else if (_data.letterActionTakenPassed === LetterActionEnum[5].toString()) {
      this.facade.updateLetterStatusAsApprove({ data: _data.data, url: this.url });
      this.back();
    }
  }

  onSend(data): void {
    this.facade.sendMessage(data);
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
  changeStatus(data): void {
    const submit = {
      data: { id: data },
      id: this.objectId
    };
    this.facade.changeStatus(submit);
  }
  showReason(_data): void {
    this.modalService.create({
      nzWidth: '50%',
      nzTitle: 'Reason',
      nzContent: ModalRemarkComponent,
      nzClosable: true,
      nzComponentParams: {
        data: _data
      }
    });
  }

  onAgree(data): void {
    const submit = {
      data: {
        id: data.id,
        consenterId: data.consenterId,
        compliantResponseId: data.compliantResponseId,
        consented: 'agreed',
        consenterName: data.consenterName
      },
      id: this.objectId
    };
    this.facade.activateConsenter(submit);
  }
  onDisagree(data): void {
    this.modalService.warning({
      nzTitle: T('Remark'),
      nzClosable: true,
      nzContent: this.remarkTemplate,
      nzAutofocus: 'ok',
      nzOkText: T('Submit'),
      nzOkType: 'danger',
      nzOnOk: () => {
        const submit = {
          data: {
            id: data.id,
            consenterId: data.consenterId,
            compliantResponseId: data.compliantResponseId,
            consented: 'disagreed',
            consenterName: data.consenterName,
            remark: this.remarkForm.get('remark').value
          },
          id: this.objectId
        };
        this.facade.activateConsenter(submit);
        this.remarkForm.reset();
      },
      nzCancelText: T('Cancel')
    });
  }
  listMessage(): void {
    this.isHoop = true;
    const request: CollectionQuery = {
      top: 10,
      skip: 0,
      filter: [
        [
          {
            field: 'receiver',
            value: 'Board',
            operator: '='
          },
          {
            field: 'sender',
            value: 'Board',
            operator: '='
          }
        ]
      ]
    };

    this.facade.listMessage(this.objectId, request);
  }

  createResponse(): void {
    this.isResponse = true;
  }
  back(): void {
    this.isResponse = false;
  }
  openFile(file): void {
    this.http.get(`${this.attachmentEndPoint}/${file?.file_path}`, { responseType: 'blob' }).subscribe(
      (data) => {
        this.blobFile = data;

        this.modalService.create({
          nzWidth: '60%',
          nzTitle: file.file_name,
          nzClosable: false,
          nzOkDisabled: true,
          nzMaskClosable: false,
          nzContent: ModalFileViewerComponent,
          nzComponentParams: {
            // tslint:disable-next-line: object-literal-shorthand
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
  createClarificationFormModal(): void {
    const modal = this.modalService.create({
      nzWidth: '50%',
      nzTitle: T('Clarification'),
      nzContent: ModalClarificationFormComponent,
      nzClosable: true,
      nzMaskClosable: false,
      nzComponentParams: {
        objectId: this.objectId,
        currentRole: this.currentRole,
        compliant: this.complain
        // objectType: this.objetType
      }
    });
    // Return a result when closed
    modal.afterClose.subscribe((result) => {
      if (result) {
        // const payload: ClarificationRequest = {
        //   complaintId: this.complain.id,
        //   title: result?.title,
        //   caseReferenceNumber: result?.caseReferenceNumber,
        //   requestedTo: result?.requestedTo,
        //   attachments: result?.files,
        //   description: result.contentBody
        // };
        this.facade.createClarification({ data: result, url: this.url });
      }
    });
  }

  onValidationFormValuesUpdate(data: any) {
    const formData = new FormData();
    let i = 0;

    formData.append('response', data.reason);
    formData.append('title', 'Complain rejected');
    formData.append('isSaveAndSubmit', true.toString());
    formData.append('compliantId', this.complain.id);
    const newData = {
      form: formData
    };

    this.facade.createResponse({ data: newData, url: this.url });
  }

  addInvestigator(isCreate: boolean): void {
    const modal = this.modalService.create({
      nzWidth: '60%',
      nzTitle: 'Investigator ',
      nzContent: ModalInvestigatorAssignmentComponent,
      nzClosable: true,
      nzMask: true,
      nzMaskClosable: false,
      nzComponentParams: {
        complaintId: this.complain.id
      }
    });
    modal.afterClose.pipe(takeUntil(this.ngUnsubscribe)).subscribe((result: any[]) => {
      if (result) {
        this.logger.log('lpl', result);
        if (isCreate) {
          // Assign a new investigator
          this.facade.createInvestigator({ data: result, url: this.url });
        } else {
          const data = {
            "id": this.currentlyAssignedInvestigator?.id,
            "complaintId": this.currentlyAssignedInvestigator?.complaintId,
            "investigatorFullName": this.currentlyAssignedInvestigator?.fullName,
            "isActive": "False",
            "isApproved": true
          }
          this.facade.createInvestigator({ data: result, url: this.url });
          this.facade.updateInvestigator({ data: data, url: this.url });
        }
      }
    });
  }

  onLetterUpdate(_data) {
    this.url = this.router.url;

    const data: Letter = {
      ..._data,
      complaintId: this.complain.id
    };
    this.facade.createRecommendation({ data: data, url: this.url });
    this.back();
  }

  letterUpdateData(_data) {
    this.existingData = this.updatedNewLater[0];

    const updateData: Letter = {
      ..._data.data,
      complaintId: this.complain.id,
      id: this.existingData?.id
    };
    return updateData;
  }

  onLetterCreate(_data) {
    this.url = this.router.url;
    const data: Letter = {
      ..._data.data,
      complaintId: this.complain.id
    };
    //this.facade.createLetter({ data: data, url: this.url });
    if (_data.letterActionTakenPassed === LetterActionEnum[0].toString()) {
      // create the new data as draft
      this.facade.createDraftLetter({ data: data, url: this.url });
      this.back();
    } else if (_data.letterActionTakenPassed === LetterActionEnum[1].toString()) {
      //update the existing draft data
      this.facade.updateDraftLetter({ data: this.letterUpdateData(_data), url: this.url });
      this.back();
    } else if (_data.letterActionTakenPassed === LetterActionEnum[2].toString()) {
      // create the new data as submitted
      this.facade.createSubmitLetter({ data: data, url: this.url });
      this.back();
    } else if (_data.letterActionTakenPassed === LetterActionEnum[3].toString()) {
      //update the existing draft data as sumitted
      this.facade.updateDraftLetterAsSubmit({ data: this.letterUpdateData(_data), url: this.url });
      this.back();
    }
  }
  splitStringWithNewLine(originalString:any): string {
    const splitArray = originalString.split('#');
    const formattedStrings = splitArray.map(substring =>'<pre>' + '  > ' + substring + '</pre>');
    const stringWithNewLine = formattedStrings.join('\n');
    return stringWithNewLine;
  }
}
