import { Injectable } from '@angular/core';
import { Collection, CollectionQuery, LoggerService, MessagingService, T } from '@erp-fe/core';
import { Navigate } from '@ngxs/router-plugin';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ComplianHandlingApiService } from '../../api/complain-handling-api.service';
import { Complain } from '../../models/complains';
import {
  ActivateConsenter,
  ChangeStatus,
  CreateResponse,
  CreateClarification,
  ClarificationResponse,
  CreateRecommendation,
  UpdateRecommendation,
  DetailComplain,
  GetClarificationResponse,
  GetComplainEscalated,
  GetComplainEscalatedResponse,
  GetHopResponse,
  GetResponse,
  ListBoard,
  ListComplain,
  ListComplainEscalated,
  ListMessage,
  SendMessage,
  GetRecommendation,
  createComplainClarification,
  GetClarification,
  GetSecretaryRecommendationSummary,
  GetAssignedInvestigator,
  GetInvestigatorLetter,
  UpdateLetter,
  CreateInvestigator,
  GetInvestigator,
  CreateLetter,
  CreateDraftLetter,
  CreateSubmitLetter,
  UpdateDraftLetter,
  UpdateDraftLetterAsSubmit,
  GetLetter,
  UpdateInvestigator,
  UpdateLetterStatusAsAdjust,
  UpdateLetterStatusAsApprove,
  GetClarificationsInComplain,
  CreateDraftRecommendation,
  CreateSubmitRecommendation,
  GetInvestigatorsInComplain,
  GetComplainLetter,
  UpdateDraftRecommendation,
  UpdateDraftRecommendationAsSubmit,
  DetailSecretaryRecommendation,
  UpdateSecretaryRecommendationStatusAsAdjust,
  UpdateRecommendationStatusAsApprove,
  GetComplainBoardResponse,
  GetActiveInvestigatorsInComplain
} from '../actions/complain-handling.action';
import { Recommendation } from '../../models/recommendation';
import { Letter } from '../../models/letter';
export interface ComplainHandlingStateModel {
  collectionQuery: CollectionQuery;
  totalComplain: number;
  selectedItem: any;
  boardResponse: any;
  investigatorComplaints: any;
  clarifications: any;
  complainInvestigators: any;
  complainLetter: any;
  secretaryRecommendationSummary: any;
  assignedInvestigator: any;
  activeInvestigator: any;
  clarificationResponse: any;
  complains: Complain[];
  selectedComplain: Complain;
  selectedSummary: any;
  complainsLoading: boolean;
  summaryDetailLoading: boolean;
  complainDetailLoading: boolean;

  complainResponse: any;
  complainResponseLoading: boolean;

  letter: any;
  items: Letter[];
  investigatorLetter: any;
  investigatorLetterLoading: boolean;

  totalMessage: number;
  messages: any[];
  boards: any[];
  selectedMessage: any;
  messagesLoading: boolean;
  messageDetailLoading: boolean;

  creatingResponse: boolean;
  creatingRecommendation: boolean;
  updatingRecommendation: boolean;

  CreatingInvestigator: boolean;
  UpdatingInvestigator: boolean;

  updatingLetter: boolean;
  updatingDraftLetter: boolean;
  updatingDraftLetterAsSubmit: boolean;
  updatingLetterStatus: boolean;

  creatingDraftRecommendation: boolean;
  updatingDraftRecommendation: boolean;
  creatingSubmitRecommendation: boolean;
  updatingDraftRecommendationAsSubmit: boolean;
  updatingRecommendationStatus: boolean;

  creatingClarification: boolean;
  creatingClarificationResponse: boolean;
  creatingLetter: boolean;
  creatingDraftLetter: boolean;
  creatingSubmitLetter: boolean;
  letterLoading: boolean;
  sendingMessaging: boolean;

  escalatedItems: any[];
  escalatedItemsLoading: boolean;
  escalatedItem: any;
  escalatedDetailLoading: boolean;
  escalatedItemResponse: any;
  escalatedResponseDetailLoading: boolean;
}
@State<ComplainHandlingStateModel>({
  name: 'ComplainHandlingStateModel',
  defaults: {
    collectionQuery: undefined,
    selectedItem: undefined,
    boardResponse: undefined,
    investigatorComplaints: undefined,
    activeInvestigator: undefined,
    clarifications: undefined,
    complainInvestigators: undefined,
    secretaryRecommendationSummary: undefined,
    updatingRecommendation: undefined,
    CreatingInvestigator: undefined,
    UpdatingInvestigator: undefined,
    assignedInvestigator: undefined,
    clarificationResponse: undefined,
    creatingClarification: false,
    creatingClarificationResponse: false,
    creatingLetter: false,
    creatingDraftLetter: false,
    creatingSubmitLetter: false,
    letterLoading: false,
    totalComplain: 0,
    complains: [],
    boards: [],
    selectedComplain: undefined,
    selectedSummary: undefined,
    complainsLoading: false,
    complainDetailLoading: false,
    summaryDetailLoading: false,

    complainLetter: undefined,

    updatingLetter: false,
    updatingDraftLetter: false,
    updatingDraftLetterAsSubmit: false,
    updatingLetterStatus: false,

    creatingDraftRecommendation: false,
    updatingDraftRecommendation: false,
    creatingSubmitRecommendation: false,
    updatingDraftRecommendationAsSubmit: false,
    updatingRecommendationStatus: false,

    complainResponse: undefined,
    complainResponseLoading: false,

    letter: undefined,
    items: [],
    investigatorLetter: undefined,
    investigatorLetterLoading: false,

    totalMessage: 0,
    messages: [],
    selectedMessage: undefined,
    messagesLoading: false,
    messageDetailLoading: false,

    creatingResponse: false,
    creatingRecommendation: false,
    sendingMessaging: undefined,

    escalatedItems: [],
    escalatedItemsLoading: false,
    escalatedItem: undefined,
    escalatedDetailLoading: undefined,
    escalatedItemResponse: undefined,
    escalatedResponseDetailLoading: false
  }
})
@Injectable()
export class ComplainHandlingState {
  url = '/complaint/board';
  @Selector() public static selectedItem(state: ComplainHandlingStateModel): any {
    return state.selectedItem;
  }

  @Selector() public static boardResponse(state: ComplainHandlingStateModel): any {
    return state.boardResponse;
  }
  @Selector() public static investigatorComplaints(state: ComplainHandlingStateModel): any {
    return state.investigatorComplaints;
  }
  @Selector() public static clarifications(state: ComplainHandlingStateModel): any {
    return state.clarifications;
  }

  @Selector() public static complainInvestigators(state: ComplainHandlingStateModel): any {
    return state.complainInvestigators;
  }

  @Selector() public static complainLetter(state: ComplainHandlingStateModel): any {
    return state.complainLetter;
  }

  @Selector() public static secretaryRecommendationSummary(state: ComplainHandlingStateModel): any {
    return state.secretaryRecommendationSummary;
  }
  @Selector() public static assignedInvestigator(state: ComplainHandlingStateModel): any {
    return state.assignedInvestigator;
  }
  @Selector() public static activeInvestigator(state: ComplainHandlingStateModel): any {
    return state.activeInvestigator;
  }

  @Selector() public static clarificationResponse(state: ComplainHandlingStateModel): any {
    return state.clarificationResponse;
  }
  @Selector() public static collectionQuery(state: ComplainHandlingStateModel): CollectionQuery {
    return state.collectionQuery;
  }
  @Selector() public static complains(state: ComplainHandlingStateModel): Complain[] {
    return state.complains;
  }
  @Selector() public static boards(state: ComplainHandlingStateModel): any[] {
    return state.boards;
  }
  @Selector() public static selectedComplain(state: ComplainHandlingStateModel): Complain {
    return state.selectedComplain;
  }

  @Selector() public static selectedSummary(state: ComplainHandlingStateModel): any {
    return state.selectedSummary;
  }

  @Selector() public static totalComplain(state: ComplainHandlingStateModel): number {
    return state.totalComplain;
  }

  @Selector() public static complainsLoading(state: ComplainHandlingStateModel): boolean {
    return state.complainsLoading;
  }
  @Selector() public static complainDetailLoading(state: ComplainHandlingStateModel): boolean {
    return state.complainDetailLoading;
  }

  @Selector() public static summaryDetailLoading(state: ComplainHandlingStateModel): boolean {
    return state.summaryDetailLoading;
  }

  @Selector() public static complainResponse(state: ComplainHandlingStateModel): any {
    return state.complainResponse;
  }
  @Selector() public static complainResponseLoading(state: ComplainHandlingStateModel): boolean {
    return state.complainResponseLoading;
  }
  @Selector() public static investigatorLetter(state: ComplainHandlingStateModel): any {
    return state.investigatorLetter;
  }

  @Selector() public static investigatorLetterLoading(state: ComplainHandlingStateModel): boolean {
    return state.investigatorLetterLoading;
  }

  @Selector() public static creatingResponse(state: ComplainHandlingStateModel): boolean {
    return state.creatingResponse;
  }

  @Selector() public static creatingRecommendation(state: ComplainHandlingStateModel): boolean {
    return state.creatingRecommendation;
  }

  @Selector() public static creatingClarification(state: ComplainHandlingStateModel): boolean {
    return state.creatingClarification;
  }

  @Selector() public static creatingLetter(state: ComplainHandlingStateModel): boolean {
    return state.creatingLetter;
  }

  @Selector() public static creatingDraftLetter(state: ComplainHandlingStateModel): boolean {
    return state.creatingDraftLetter;
  }
  @Selector() public static updatingDraftLetter(state: ComplainHandlingStateModel): boolean {
    return state.updatingDraftLetter;
  }

  @Selector() public static creatingSubmitLetter(state: ComplainHandlingStateModel): boolean {
    return state.creatingSubmitLetter;
  }
  @Selector() public static updatingDraftLetterAsSubmit(state: ComplainHandlingStateModel): boolean {
    return state.updatingDraftLetterAsSubmit;
  }
  @Selector() public static updatingLetterStatus(state: ComplainHandlingStateModel): boolean {
    return state.updatingLetterStatus;
  }

  @Selector() public static creatingDraftRecommendation(state: ComplainHandlingStateModel): boolean {
    return state.creatingDraftRecommendation;
  }
  @Selector() public static updatingDraftRecommendation(state: ComplainHandlingStateModel): boolean {
    return state.updatingDraftRecommendation;
  }

  @Selector() public static creatingSubmitRecommendation(state: ComplainHandlingStateModel): boolean {
    return state.creatingSubmitRecommendation;
  }
  @Selector() public static updatingDraftRecommendationAsSubmit(state: ComplainHandlingStateModel): boolean {
    return state.updatingDraftRecommendationAsSubmit;
  }
  @Selector() public static updatingRecommendationStatus(state: ComplainHandlingStateModel): boolean {
    return state.updatingRecommendationStatus;
  }

  @Selector() public static letterLoading(state: ComplainHandlingStateModel): boolean {
    return state.letterLoading;
  }

  @Selector() public static messages(state: ComplainHandlingStateModel): any[] {
    return state.messages;
  }
  @Selector() public static selectedMessage(state: ComplainHandlingStateModel): any {
    return state.selectedMessage;
  }
  @Selector() public static totalMessage(state: ComplainHandlingStateModel): number {
    return state.totalMessage;
  }

  @Selector() public static messagesLoading(state: ComplainHandlingStateModel): boolean {
    return state.messagesLoading;
  }
  @Selector() public static messageDetailLoading(state: ComplainHandlingStateModel): boolean {
    return state.messageDetailLoading;
  }
  @Selector() public static sendingMessaging(state: ComplainHandlingStateModel): boolean {
    return state.sendingMessaging;
  }
  @Selector() public static escalatedItems(state: ComplainHandlingStateModel): any[] {
    return state.escalatedItems;
  }
  @Selector() public static escalatedItemsLoading(state: ComplainHandlingStateModel): boolean {
    return state.escalatedItemsLoading;
  }
  @Selector() public static escalatedItem(state: ComplainHandlingStateModel): any {
    return state.escalatedItem;
  }
  @Selector() public static escalatedDetailLoading(state: ComplainHandlingStateModel): boolean {
    return state.escalatedDetailLoading;
  }
  @Selector() public static escalatedItemResponse(state: ComplainHandlingStateModel): any {
    return state.escalatedItemResponse;
  }
  @Selector() public static escalatedResponseDetailLoading(state: ComplainHandlingStateModel): boolean {
    return state.escalatedResponseDetailLoading;
  }
  constructor(
    private readonly logger: LoggerService,
    private readonly notification: MessagingService,
    private readonly store: Store,
    private readonly aggregateRootApi: ComplianHandlingApiService
  ) {}
  @Action(ListComplain) listComplains(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload }: ListComplain
  ): Observable<Collection<any>> {
    patchState({
      collectionQuery: payload,
      complainsLoading: true
    });

    return this.aggregateRootApi.listComplain(payload).pipe(
      tap((collection: any) => {
        patchState({
          complainsLoading: false,
          complains: collection.items,
          totalComplain: collection.total
        });
      }),
      catchError((error) =>
        of(
          patchState({
            complainsLoading: false
          })
        )
      )
    );
  }
  @Action(GetInvestigatorsInComplain) getInvestigatorComplaints(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload, id }: GetInvestigatorsInComplain
  ): Observable<Collection<any>> {
    patchState({});

    return this.aggregateRootApi.getInvestigatorComplaints(payload, id).pipe(
      tap((item: any) => {
        patchState({
          investigatorComplaints: item
        });
      }),
      catchError((error) => of(patchState({})))
    );
  }

  @Action(GetActiveInvestigatorsInComplain) GetActiveInvestigatorsInComplain(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload, id }: GetActiveInvestigatorsInComplain
  ): Observable<Collection<any>> {
    patchState({});

    return this.aggregateRootApi.getActiveInvestigatorsInComplain(payload, id).pipe(
      tap((item: any) => {
        patchState({
          activeInvestigator: item
        });
      }),
      catchError((error) => of(patchState({})))
    );
  }

  @Action(GetClarificationsInComplain) getClarificationsInComplain(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload, id }: GetClarificationsInComplain
  ): Observable<Complain | ComplainHandlingStateModel> {
    patchState({});

    return this.aggregateRootApi.getClarifications(payload, id).pipe(
      tap((item: Complain) => {
        patchState({
          clarifications: item
        });
      }),
      catchError((error) => of(patchState({})))
    );
  }

  @Action(GetInvestigatorsInComplain) getInvestigatorsInComplain(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload, id }: GetInvestigatorsInComplain
  ): Observable<Complain | ComplainHandlingStateModel> {
    patchState({});

    return this.aggregateRootApi.getInvestigatorsInComplain(payload, id).pipe(
      tap((item: Complain) => {
        patchState({
          complainInvestigators: item
        });
      }),
      catchError((error) => of(patchState({})))
    );
  }

  @Action(GetComplainLetter) getComplainLetter(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload, id }: GetComplainLetter
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({});

    return this.aggregateRootApi.getComplainLetter(payload, id).pipe(
      tap((item: any) => {
        patchState({
          complainLetter: item
        });
      }),
      catchError((error) => of(patchState({})))
    );
  }


  @Action(GetHopResponse) getComplain(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload, id }: GetHopResponse
  ): Observable<Complain | ComplainHandlingStateModel> {
    patchState({});

    return this.aggregateRootApi.getHopResponse(payload, id).pipe(
      tap((item: Complain) => {
        patchState({
          selectedItem: item
        });
      }),
      catchError((error) => of(patchState({})))
    );
  }

  @Action(GetComplainBoardResponse) getComplainBoardResponse(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload, id }: GetComplainBoardResponse
  ): Observable<Complain | ComplainHandlingStateModel> {
    patchState({});

    return this.aggregateRootApi.getComplainBoardResponse(payload, id).pipe(
      tap((item: Complain) => {
        patchState({
          boardResponse: item
        });
      }),
      catchError((error) => of(patchState({})))
    );
  }

  @Action(GetSecretaryRecommendationSummary) GetSecretaryRecommendationSummary(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload, id }: GetSecretaryRecommendationSummary
  ): Observable<Recommendation | ComplainHandlingStateModel> {
    patchState({});

    return this.aggregateRootApi.getSecretaryRecommendationSummary(payload, id).pipe(
      tap((item: Recommendation) => {
        patchState({
          secretaryRecommendationSummary: item
        });
      }),
      catchError((error) => of(patchState({})))
    );
  }

  @Action(GetAssignedInvestigator) GetAssignedInvestigator(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload, id }: GetAssignedInvestigator
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({});

    return this.aggregateRootApi.getAssignedInvestigator(payload, id).pipe(
      tap((item: Recommendation) => {
        patchState({
          assignedInvestigator: item
        });
      }),
      catchError((error) => of(patchState({})))
    );
  }

  @Action(GetClarificationResponse) getClarificationResponse(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload }: GetClarificationResponse
  ): Observable<Collection<any>> {
    patchState({});

    return this.aggregateRootApi.getClarificationResponse(payload).pipe(
      tap((item: any) => {
        patchState({
          clarificationResponse: item
        });
      }),
      catchError((error) => of(patchState({})))
    );
  }

  @Action(CreateClarification) CreateClarification(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: CreateClarification
  ): Observable<Collection<any>> {
    patchState({
      creatingClarification: true
    });
    return this.aggregateRootApi.createClarification(payload.data).pipe(
      tap((clarification: any) => {
        patchState({
          creatingClarification: false
        });
        const request: CollectionQuery = {
          top: 10,
          skip: 0
        };
        this.store.dispatch(new Navigate([payload.url]));
        this.store.dispatch(new GetClarificationsInComplain(request, clarification.compliantId))
        this.notification.success(T('Complain clarification request submitted successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            creatingClarification: false
          })
        )
      )
    );
  }

  @Action(ClarificationResponse) ClarificationResponse(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: ClarificationResponse
  ): Observable<Collection<any>> {
    patchState({
      creatingClarificationResponse: true
    });
    return this.aggregateRootApi.createClarificationResponse(payload.data).pipe(
      tap((clarification: any) => {
        patchState({
          creatingClarificationResponse: false
        });

        const request: CollectionQuery = {
          top: 10,
          skip: 0
        };
        this.store.dispatch(new GetClarificationsInComplain(request, payload.complainId))
        this.store.dispatch(new Navigate([payload.url]));

        this.notification.success(T('Clarification response submitted successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            creatingClarificationResponse: false
          })
        )
      )
    );
  }

  // Recommendation
  @Action(CreateDraftRecommendation) CreateDraftRecommendation(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: CreateDraftRecommendation
  ): Observable<Collection<any>> {
    patchState({
      creatingDraftRecommendation: true
    });
    return this.aggregateRootApi.createDraftRecommendation(payload.data).pipe(
      tap((item: any) => {
        patchState({
          creatingDraftRecommendation: false,
          selectedSummary: item
        });
        this.store.dispatch(new Navigate([payload.url]));
        // this.store.dispatch(new GetClarification(clarification.compliantId));

        this.notification.success(T('Recommendation submitted successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            creatingDraftRecommendation: false
          })
        )
      )
    );
  }
  @Action(CreateSubmitRecommendation) CreateSubmitRecommendation(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: CreateSubmitRecommendation
  ): Observable<Collection<any>> {
    patchState({
      creatingSubmitRecommendation: true
    });
    return this.aggregateRootApi.createSubmitRecommendation(payload.data).pipe(
      tap((item: any) => {
        patchState({
          creatingSubmitRecommendation: false,
          selectedSummary: item
        });
        this.store.dispatch(new Navigate([payload.url]));
        // this.store.dispatch(new GetClarification(item.compliantId));

        this.notification.success(T('Recommendation submitted successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            creatingSubmitRecommendation: false
          })
        )
      )
    );
  }
  @Action(UpdateDraftRecommendation) UpdateDraftRecommendation(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: UpdateDraftRecommendation
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      updatingDraftRecommendation: true
    });

    return this.aggregateRootApi.updateDraftRecommendation(payload.data).pipe(

      tap((item: any) => {
        patchState({
          items: getState().items.map((i) => {
            let singleRecommendation = i;
            if (i.id === item.id) {
              singleRecommendation = item;
            }

            return singleRecommendation;
          }),

          updatingDraftRecommendation: false,
          selectedSummary: item
        });

        this.store.dispatch(new Navigate([payload.url]));
        this.notification.success(T('Recommendation updated successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            updatingDraftRecommendation: false
          })
        )
      )
    );
  }
  @Action(UpdateDraftRecommendationAsSubmit) UpdateDraftRecommendationAsSubmit(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: UpdateDraftRecommendationAsSubmit
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      updatingDraftRecommendationAsSubmit: true
    });

    return this.aggregateRootApi.updateDraftRecommendationAsSubmit(payload.data).pipe(
      tap((item: any) => {
        patchState({
          items: getState().items.map((i) => {
            let singleRecommendation = i;
            if (i.id === item.id) {
              singleRecommendation = item;
            }
            return singleRecommendation;
          }),
          updatingDraftRecommendationAsSubmit: false,
          selectedSummary: item
        });
        this.store.dispatch(new Navigate([payload.url]));
        this.notification.success(T('Recommendation updated successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            updatingDraftRecommendationAsSubmit: false
          })
        )
      )
    );
  }
  @Action(UpdateSecretaryRecommendationStatusAsAdjust) UpdateSecretaryRecommendationStatusAsAdjust(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: UpdateSecretaryRecommendationStatusAsAdjust
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      updatingRecommendationStatus: true
    });

    return this.aggregateRootApi.updateSecretaryRecommendationStatusAsAdjust(payload.data).pipe(
      tap((item: any) => {
        patchState({
          items: getState().items.map((i) => {
            let singleRecommendation = i;
            if (i.id === item.id) {
              singleRecommendation = item;
            }
            return singleRecommendation;
          }),

          updatingRecommendationStatus: false,
          selectedSummary: item
        });

        this.store.dispatch(new Navigate([payload.url]));
        this.notification.success(T('Recommendation updated successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            updatingRecommendationStatus: false
          })
        )
      )
    );
  }
  @Action(UpdateRecommendationStatusAsApprove) UpdateRecommendationStatusAsApprove(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: UpdateRecommendationStatusAsApprove
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      updatingRecommendationStatus: true
    });

    return this.aggregateRootApi.updateRecommendationStatusAsApprove(payload.data).pipe(
      tap((item: any) => {
        patchState({
          items: getState().items.map((i) => {
            let singleRecommendation = i;
            if (i.id === item.id) {
              singleRecommendation = item;
            }
            return singleRecommendation;
          }),

          updatingRecommendationStatus: false,
          selectedSummary: item
        });

        this.store.dispatch(new Navigate([payload.url]));
        this.notification.success(T('Recommendation updated successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            updatingRecommendationStatus: false
          })
        )
      )
    );
  }
  // Letter
  @Action(CreateLetter) CreateLetter(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: CreateLetter
  ): Observable<Collection<any>> {
    patchState({
      creatingLetter: true
    });
    return this.aggregateRootApi.createLetter(payload.data).pipe(
      tap((letter: any) => {
        patchState({
          creatingLetter: false
        });
        const request: CollectionQuery = {
          top: 10,
          skip: 0
        };
        this.store.dispatch(new GetComplainLetter(request, letter.complaintId));

        this.store.dispatch(new Navigate([payload.url]));

        this.notification.success(T('Letter request submitted successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            creatingLetter: false
          })
        )
      )
    );
  }

  @Action(CreateDraftLetter) CreateDraftLetter(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: CreateDraftLetter
  ): Observable<Collection<any>> {
    patchState({
      creatingDraftLetter: true
    });
    return this.aggregateRootApi.createDraftLetter(payload.data).pipe(
      tap((letter: any) => {
        patchState({
          creatingDraftLetter: false
        });
        const request: CollectionQuery = {
          top: 10,
          skip: 0
        };
        this.store.dispatch(new GetComplainLetter(request, letter.complaintId));


        this.store.dispatch(new Navigate([payload.url]));
        this.store.dispatch(new GetLetter(letter.complaintId));

        this.notification.success(T('Letter request submitted as draft successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            creatingDraftLetter: false
          })
        )
      )
    );
  }

  @Action(CreateSubmitLetter) CreateSubmitLetter(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: CreateSubmitLetter
  ): Observable<Collection<any>> {
    patchState({
      creatingSubmitLetter: true
    });
    return this.aggregateRootApi.createSubmitLetter(payload.data).pipe(
      tap((letter: any) => {
        patchState({
          creatingSubmitLetter: false
        });
        const request: CollectionQuery = {
          top: 10,
          skip: 0
        };
        this.store.dispatch(new GetComplainLetter(request, letter.complaintId));

        this.store.dispatch(new Navigate([payload.url]));

        this.notification.success(T('Letter request submitted successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            creatingSubmitLetter: false
          })
        )
      )
    );
  }
  @Action(UpdateDraftLetter) UpdateDraftLetter(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: UpdateDraftLetter
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      updatingDraftLetter: true
    });

    return this.aggregateRootApi.updateDraftLetter(payload.data).pipe(
      tap((item: any) => {
        patchState({
          items: getState().items.map((i) => {
            let singleLetter = i;
            if (i.id === item.id) {
              singleLetter = item;
            }

            return singleLetter;
          }),
          updatingDraftLetter: false,
          selectedItem: item
        });
        const request: CollectionQuery = {
          top: 10,
          skip: 0
        };
        this.store.dispatch(new GetComplainLetter(request, item.complaintId));

        this.store.dispatch(new Navigate([payload.url]));
        this.notification.success(T('Letter updated successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            updatingDraftLetter: false
          })
        )
      )
    );
  }
  @Action(UpdateDraftLetterAsSubmit) UpdateDraftLetterAsSubmit(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: UpdateDraftLetterAsSubmit
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      updatingDraftLetter: true
    });

    return this.aggregateRootApi.updateDraftLetterAsSubmit(payload.data).pipe(
      tap((item: any) => {
        patchState({
          items: getState().items.map((i) => {
            let singleLetter = i;
            if (i.id === item.id) {
              singleLetter = item;
            }

            return singleLetter;
          }),
          updatingDraftLetter: false,
          selectedItem: item
        });
        const request: CollectionQuery = {
          top: 10,
          skip: 0
        };
        this.store.dispatch(new GetComplainLetter(request, item.complaintId));

        this.store.dispatch(new Navigate([payload.url]));
        this.notification.success(T('Letter updated successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            updatingDraftLetter: false
          })
        )
      )
    );
  }
  @Action(UpdateLetterStatusAsAdjust) UpdateLetterStatusAsAdjust(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: UpdateLetterStatusAsAdjust
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      updatingLetterStatus: true
    });

    return this.aggregateRootApi.updateLetterStatusAsAdjust(payload.data).pipe(
      tap((item: any) => {
        patchState({
          items: getState().items.map((i) => {
            let singleLetter = i;
            if (i.id === item.id) {
              singleLetter = item;
            }

            return singleLetter;
          }),
          updatingLetterStatus: false,
          selectedItem: item
        });
        const request: CollectionQuery = {
          top: 10,
          skip: 0
        };
        this.store.dispatch(new GetComplainLetter(request, item.complaintId));

        // this.store.dispatch(new Navigate([payload.url, item.id]));
        this.store.dispatch(new Navigate([payload.url]));
        this.notification.success(T('Letter updated successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            updatingLetterStatus: false
          })
        )
      )
    );
  }
  @Action(UpdateLetterStatusAsApprove) UpdateLetterStatusAsApprove(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: UpdateLetterStatusAsApprove
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      updatingLetterStatus: true
    });

    return this.aggregateRootApi.updateLetterStatusAsApprove(payload.data).pipe(
      tap((item: any) => {
        patchState({
          items: getState().items.map((i) => {
            let singleLetter = i;
            if (i.id === item.id) {
              singleLetter = item;
            }

            return singleLetter;
          }),
          updatingLetterStatus: false,
          selectedItem: item
        });
        const request: CollectionQuery = {
          top: 10,
          skip: 0
        };
        this.store.dispatch(new GetComplainLetter(request, item.complaintId));

        this.store.dispatch(new Navigate([payload.url]));
        this.notification.success(T('Letter updated successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            updatingLetterStatus: false
          })
        )
      )
    );
  }

  @Action(ListBoard) ListBoards(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload }: ListBoard
  ): Observable<Collection<any>> {
    patchState({});

    return this.aggregateRootApi.listBoard().pipe(
      tap((result: any) => {
        patchState({
          boards: result
        });
      }),
      catchError((error) => of(patchState({})))
    );
  }

  @Action(DetailComplain) detailComplain(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: DetailComplain
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      complainDetailLoading: true
    });

    return this.aggregateRootApi.detailComplain(payload).pipe(
      tap((item) => {
        patchState({
          complainDetailLoading: false,
          selectedComplain: item
        });
        this.store.dispatch(
          new GetHopResponse(
            {
              top: 10,
              skip: 0
            },
            item.parentComplaintId
          )
        );
      }),
      catchError((error) =>
        of(
          patchState({
            complainDetailLoading: false
          })
        )
      )
    );
  }
  @Action(DetailSecretaryRecommendation) detailSecretaryRecommendation(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: DetailSecretaryRecommendation
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      summaryDetailLoading: true
    });

    return this.aggregateRootApi.detailSecretaryRecommendation(payload).pipe(
      tap((item) => {
        patchState({
          summaryDetailLoading: false,
          selectedSummary: item
        });
      }),
      catchError((error) =>
        of(
          patchState({
            summaryDetailLoading: false
          })
        )
      )
    );
  }

  @Action(CreateResponse) createResponse(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: CreateResponse
  ): Observable<Collection<any>> {
    patchState({
      creatingResponse: true
    });

    return this.aggregateRootApi.createComplainResponse(payload.data).pipe(
      tap((response: any) => {
        patchState({
          creatingResponse: false
        });
        this.store.dispatch(new Navigate([payload.url]));
        this.store.dispatch(new GetResponse(response.compliantId));

        this.notification.success(T('Complain response submitted successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            creatingResponse: false
          })
        )
      )
    );
  }

  @Action(CreateRecommendation) createRecommendation(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: CreateRecommendation
  ): Observable<Collection<any>> {
    patchState({
      creatingRecommendation: true
    });

    return this.aggregateRootApi.createComplainRecommendation(payload.data).pipe(
      tap((response: any) => {
        patchState({
          creatingRecommendation: false
        });
        this.store.dispatch(new Navigate([payload.url]));
        this.store.dispatch(new GetRecommendation(response.compliantId));

        this.notification.success(T('Complain recommendation request submitted successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            creatingRecommendation: false
          })
        )
      )
    );
  }

  @Action(CreateInvestigator) CreateInvestigator(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: CreateInvestigator
  ): Observable<Collection<any>> {
    patchState({
      CreatingInvestigator: true
    });

    return this.aggregateRootApi.createInvestigator(payload.data).pipe(
      tap((item: any) => {
        patchState({
          CreatingInvestigator: false
        });
        const request: CollectionQuery = {
          top: 10,
          skip: 0
        };

        this.store.dispatch(new Navigate([payload.url]));
        this.store.dispatch(new GetActiveInvestigatorsInComplain(request, payload.data.complaintId))

        this.notification.success(T('Investigator assigned successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            CreatingInvestigator: false
          })
        )
      )
    );
  }

  @Action(UpdateInvestigator) UpdateInvestigator(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: UpdateInvestigator
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      UpdatingInvestigator: true
    });

    return this.aggregateRootApi.updateInvestigator(payload.data).pipe(
      tap((item: any) => {
        patchState({
          UpdatingInvestigator: false,
        });
        this.store.dispatch(new Navigate([payload.url]));
        this.notification.success(T('Investigator updated successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            UpdatingInvestigator: false
          })
        )
      )
    );
  }

  @Action(UpdateRecommendation) updateRecommendation(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: UpdateRecommendation
  ): Observable<Collection<any>> {
    patchState({
      updatingRecommendation: true
    });
    return this.aggregateRootApi.updateComplainRecommendation(payload.data).pipe(
      tap((response: any) => {
        patchState({
          updatingRecommendation: false
        });
        this.store.dispatch(new Navigate([payload.url]));
        this.store.dispatch(new GetRecommendation(response.compliantId));

        this.notification.success(T('Complain recommendation request submitted successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            updatingRecommendation: false
          })
        )
      )
    );
  }

  @Action(UpdateLetter) updateLetter(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: UpdateLetter
  ): Observable<Collection<any>> {
    patchState({
      updatingLetter: true
    });
    return this.aggregateRootApi.updateLetter(payload.data).pipe(
      tap((response: any) => {
        patchState({
          updatingLetter: false
        });
        this.store.dispatch(new Navigate([payload.url]));
        this.store.dispatch(new GetLetter(response.compliantId));

        this.notification.success(T('Letter updated successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            updatingLetter: false
          })
        )
      )
    );
  }

  @Action(ActivateConsenter) ActivateConsenter(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: ActivateConsenter
  ): Observable<Collection<any>> {
    patchState({
      creatingResponse: true
    });

    return this.aggregateRootApi.activateConsenter(payload.data).pipe(
      tap((result: any) => {
        patchState({});
        this.store.dispatch(new GetResponse(payload.id));
        this.store.dispatch(new Navigate([this.url, payload.id]));
        this.notification.success(T('Consenter voted successfully'));
      }),
      catchError((error) =>
        of(
          patchState({
            creatingResponse: false
          })
        )
      )
    );
  }
  @Action(ChangeStatus) ChangeStatus(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: ChangeStatus
  ): Observable<Collection<any>> {
    patchState({});

    return this.aggregateRootApi.changeStatus(payload.data).pipe(
      tap((response: any) => {
        patchState({});
        this.store.dispatch(new GetResponse(payload.id));
        this.store.dispatch(new DetailComplain(payload.id));
        this.logger.log(payload.id);
        this.store.dispatch(new Navigate([this.url, payload.id]));
        this.notification.success(T('Complain submitted successfully'));
      }),
      catchError((error) => of(patchState({})))
    );
  }
  @Action(GetResponse) getResponse(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload }: GetResponse
  ): Observable<Collection<any>> {
    patchState({
      complainResponseLoading: true
    });

    return this.aggregateRootApi.getComplainResponse(payload).pipe(
      tap((item: any) => {
        patchState({
          complainResponseLoading: false,
          complainResponse: item
        });
      }),
      catchError((error) =>
        of(
          patchState({
            complainResponseLoading: false
          })
        )
      )
    );
  }

  @Action(GetInvestigatorLetter) getInvestigatorLetter(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload }: GetInvestigatorLetter
  ): Observable<Collection<any>> {
    patchState({
      investigatorLetterLoading: true
    });

    return this.aggregateRootApi.getComplainResponse(payload).pipe(
      tap((item: any) => {
        patchState({
          investigatorLetterLoading: false,
          investigatorLetter: item
        });
      }),
      catchError((error) =>
        of(
          patchState({
            investigatorLetterLoading: false
          })
        )
      )
    );
  }

  @Action(ListComplainEscalated) listComplainEscalated(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload }: ListComplainEscalated
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      escalatedItemsLoading: true
    });

    return this.aggregateRootApi.listComplainEscalated(payload).pipe(
      tap((collection: Collection<any>) => {
        patchState({
          escalatedItemsLoading: false,
          escalatedItems: collection.items
        });
      }),
      catchError((error) =>
        of(
          patchState({
            escalatedItemsLoading: false
          })
        )
      )
    );
  }
  @Action(GetComplainEscalated) getComplainEscalated(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload, id }: GetComplainEscalated
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      escalatedDetailLoading: true
    });

    return this.aggregateRootApi.getComplainEscalated(payload, id).pipe(
      tap((item: any) => {
        patchState({
          escalatedDetailLoading: false,
          escalatedItem: item
        });
      }),
      catchError((error) =>
        of(
          patchState({
            escalatedDetailLoading: false
          })
        )
      )
    );
  }
  @Action(GetComplainEscalatedResponse) getComplainEscalatedResponse(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { payload }: GetComplainEscalatedResponse
  ): Observable<any | ComplainHandlingStateModel> {
    patchState({
      escalatedResponseDetailLoading: true
    });

    return this.aggregateRootApi.getComplainEscalatedResponse(payload).pipe(
      tap((item: any) => {
        patchState({
          escalatedResponseDetailLoading: false,
          escalatedItemResponse: item
        });
      }),
      catchError((error) =>
        of(
          patchState({
            escalatedResponseDetailLoading: false
          })
        )
      )
    );
  }
  @Action(SendMessage) sendMessage(
    { patchState, getState }: StateContext<ComplainHandlingStateModel>,
    { payload }: SendMessage
  ): Observable<Collection<any>> {
    patchState({
      sendingMessaging: true
    });

    return this.aggregateRootApi.sendMessage(payload).pipe(
      tap((message: any) => {
        const items = [...getState().messages, message];
        items.sort((a, b) => {
          return new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime() ? 1 : -1;
        });
        patchState({
          sendingMessaging: false,
          messages: items
        });
        this.notification.success(T('Message sent'));
      }),
      catchError((error) =>
        of(
          patchState({
            sendingMessaging: false
          })
        )
      )
    );
  }
  @Action(ListMessage) listMessage(
    { patchState }: StateContext<ComplainHandlingStateModel>,
    { id, payload }: ListMessage
  ): Observable<Collection<any>> {
    patchState({
      messagesLoading: true
    });

    return this.aggregateRootApi.listMessage(id, payload).pipe(
      tap((collection: any) => {
        patchState({
          messagesLoading: false,
          messages: collection.items.sort((a, b) => {
            return new Date(a.timestamp).getTime() > new Date(b.timestamp).getTime() ? 1 : -1;
          }),
          totalMessage: collection.total
        });
      }),
      catchError((error) =>
        of(
          patchState({
            messagesLoading: false
          })
        )
      )
    );
  }
  // tslint:disable-next-line: max-file-line-count
}
