import { Injectable } from '@angular/core';
import { BaseComponent, CollectionQuery, LoggerService } from '@erp-fe/core';
import { Store } from '@ngxs/store';
import {
  ActivateConsenter,
  ChangeStatus,
  CreateResponse,
  DetailComplain,
  GetComplainEscalated,
  GetComplainEscalatedResponse,
  GetHopResponse,
  GetClarificationResponse,
  GetResponse,
  ListBoard,
  ListComplain,
  ListComplainEscalated,
  GetAssignedInvestigators,
  ListMessage,
  SendMessage,
  CreateRecommendation,
  CreateClarification,
  UpdateRecommendation,
  UpdateLetter,
  CreateInvestigator,
  CreateLetter,
  GetLetter,
  ClarificationResponse,
  UpdateInvestigator,
  CreateDraftLetter,
  CreateSubmitLetter,
  UpdateDraftLetter,
  UpdateDraftLetterAsSubmit,
  UpdateLetterStatusAsAdjust,
  UpdateLetterStatusAsApprove,

  GetClarificationsInComplain,
  CreateDraftRecommendation,
  CreateSubmitRecommendation,
  GetInvestigatorsInComplain,
  GetComplainLetter,
  UpdateSecretaryRecommendationStatusAsAdjust,
  UpdateRecommendationStatusAsApprove,
  DetailSecretaryRecommendation,
  UpdateDraftRecommendation,
  UpdateDraftRecommendationAsSubmit,
  GetComplainBoardResponse,
  GetActiveInvestigatorsInComplain
} from '../store/actions/complain-handling.action';
import { ComplainHandlingState } from '../store/states/complain-handling.state';

@Injectable()
export class ComplainHandlingFacadeService extends BaseComponent {
  [x: string]: any;
  locale = 'en';
  collectionQuery$ = this.store.select(ComplainHandlingState.collectionQuery);
  totalComplain$ = this.store.select(ComplainHandlingState.totalComplain);
  complains$ = this.store.select(ComplainHandlingState.complains);
  hopResponse$ = this.store.select(ComplainHandlingState.selectedItem);
  boardResponse$ = this.store.select(ComplainHandlingState.boardResponse);
  investigatorComplaints$ = this.store.select(ComplainHandlingState.investigatorComplaints);
  clarifications$ = this.store.select(ComplainHandlingState.clarifications);
  complainInvestigators$ = this.store.select(ComplainHandlingState.complainInvestigators);

  complainLetter$ = this.store.select(ComplainHandlingState.complainLetter);

  secretaryRecommendationSummary$ = this.store.select(ComplainHandlingState.secretaryRecommendationSummary);
  assignedInvestigator$ = this.store.select(ComplainHandlingState.assignedInvestigator);

  activeInvestigator$ = this.store.select(ComplainHandlingState.activeInvestigator);

  clarificationResponse$ = this.store.select(ComplainHandlingState.clarificationResponse);
  boards$ = this.store.select(ComplainHandlingState.boards);
  selectedComplain$ = this.store.select(ComplainHandlingState.selectedComplain);
  selectedSummary$ = this.store.select(ComplainHandlingState.selectedSummary);
  complainsLoading$ = this.store.select(ComplainHandlingState.complainsLoading);
  complainDetailLoading$ = this.store.select(ComplainHandlingState.complainDetailLoading);
  summaryDetailLoading$ = this.store.select(ComplainHandlingState.summaryDetailLoading);

  complainResponse$ = this.store.select(ComplainHandlingState.complainResponse);
  complainResponseLoading$ = this.store.select(ComplainHandlingState.complainResponseLoading);

  investigatorLetter$ = this.store.select(ComplainHandlingState.investigatorLetter);

  totalMessage$ = this.store.select(ComplainHandlingState.totalMessage);
  messages$ = this.store.select(ComplainHandlingState.messages);
  selectedMessage$ = this.store.select(ComplainHandlingState.selectedMessage);
  messagesLoading$ = this.store.select(ComplainHandlingState.messagesLoading);
  messageDetailLoading$ = this.store.select(ComplainHandlingState.messageDetailLoading);

  creatingResponse$ = this.store.select(ComplainHandlingState.creatingResponse);
  sendingMessaging$ = this.store.select(ComplainHandlingState.sendingMessaging);

  creatingClarification$ = this.store.select(ComplainHandlingState.creatingClarification);
  sendingRecommendation$ = this.store.select(ComplainHandlingState.creatingRecommendation);

  creatingLetter$ = this.store.select(ComplainHandlingState.creatingLetter);
  letterDetailLoading$ = this.store.select(ComplainHandlingState.letterLoading);
  creatingDraftLetter$ = this.store.select(ComplainHandlingState.creatingDraftLetter);
  updatingDraftLetter$ = this.store.select(ComplainHandlingState.updatingDraftLetter);
  creatingSubmitLetter$ = this.store.select(ComplainHandlingState.creatingSubmitLetter);
  updatingDraftLetterAsSubmit$ = this.store.select(ComplainHandlingState.updatingDraftLetterAsSubmit);
  updatingLetterStatus$ = this.store.select(ComplainHandlingState.updatingLetterStatus);

  creatingDraftRecommendation$ = this.store.select(ComplainHandlingState.creatingDraftRecommendation);
  updatingDraftRecommendation$ = this.store.select(ComplainHandlingState.updatingDraftRecommendation);
  creatingSubmitRecommendation$ = this.store.select(ComplainHandlingState.creatingSubmitRecommendation);
  updatingDraftRecommendationAsSubmit$ = this.store.select(ComplainHandlingState.updatingDraftRecommendationAsSubmit);

  escalatedItems$ = this.store.select(ComplainHandlingState.escalatedItems);
  escalatedItemsLoading$ = this.store.select(ComplainHandlingState.escalatedItemsLoading);
  escalatedItem$ = this.store.select(ComplainHandlingState.escalatedItem);
  escalatedDetailLoading$ = this.store.select(ComplainHandlingState.escalatedDetailLoading);
  escalatedItemResponse$ = this.store.select(ComplainHandlingState.escalatedItemResponse);
  escalatedResponseDetailLoading$ = this.store.select(ComplainHandlingState.escalatedResponseDetailLoading);
  constructor(private readonly logger: LoggerService, private readonly store: Store) {
    super();
  }

  listComplain(collectionQuery: CollectionQuery): void {
    this.store.dispatch(new ListComplain(collectionQuery));
  }
  getHopResponse(collectionQuery: CollectionQuery, id: string): void {
    this.store.dispatch(new GetHopResponse(collectionQuery, id));
  }

  getBoardResponse(collectionQuery: CollectionQuery, id: string): void {
    this.store.dispatch(new GetComplainBoardResponse(collectionQuery, id));
  }

  getInvestigatorComplaints(collectionQuery: CollectionQuery, id: string): void {
    this.store.dispatch(new GetInvestigatorsInComplain(collectionQuery, id));
  }

  getActiveInvestigator(collectionQuery: CollectionQuery, id: string): void {
    this.store.dispatch(new GetActiveInvestigatorsInComplain(collectionQuery, id));
  }

  getComplainLetter(collectionQuery: CollectionQuery, id: string): void {
    this.store.dispatch(new GetComplainLetter(collectionQuery, id));
  }

  getClarificationsInComplain(collectionQuery: CollectionQuery, id: string): void {
    this.store.dispatch(new GetClarificationsInComplain(collectionQuery, id));
  }
  getClarificationResponse(collectionQuery: CollectionQuery, id: string): void {
    this.store.dispatch(new GetClarificationResponse(collectionQuery, id));
  }
  listBoard(): void {
    this.store.dispatch(new ListBoard());
  }

  detail(id: string): void {
    this.store.dispatch(new DetailComplain(id));
  }

  secretaryRecommendationSummaryDetail(id: string): void {
    this.store.dispatch(new DetailSecretaryRecommendation(id));
  }

  activateConsenter(data: any): void {
    this.store.dispatch(new ActivateConsenter(data));
  }

  changeStatus(data: any): void {
    this.store.dispatch(new ChangeStatus(data));
  }

  createResponse(response: any): void {
    this.store.dispatch(new CreateResponse(response));
  }

  createInvestigator(response: any): void {
    this.store.dispatch(new CreateInvestigator(response));
  }

  updateInvestigator(letter: any): void {
    this.store.dispatch(new UpdateInvestigator(letter));
  }

  createClarification(clarification: any): void {
    this.store.dispatch(new CreateClarification(clarification));
  }

  createClarificationResponse(clarificationResponse: any): void {
    this.store.dispatch(new ClarificationResponse(clarificationResponse));
  }
  // recommendation
  createDraftRecommendation(recommendation: any): void {
    this.store.dispatch(new CreateDraftRecommendation(recommendation));
  }
  createSubmitRecommendation(recommendation: any): void {
    this.store.dispatch(new CreateSubmitRecommendation(recommendation));
  }
  updateDraftRecommendation(recommendation: any): void {
    this.store.dispatch(new UpdateDraftRecommendation(recommendation));
    this.store.dispatch(new DetailSecretaryRecommendation(recommendation.data.id));
  }
  updateDraftRecommendationAsSubmit(recommendation: any): void {
    this.store.dispatch(new UpdateDraftRecommendationAsSubmit(recommendation));
  }
  updateSecretaryRecommendationStatusAsAdjust(recommendation: any): void {
    this.store.dispatch(new UpdateSecretaryRecommendationStatusAsAdjust(recommendation));
  }
  updateRecommendationStatusAsApprove(recommendation: any): void {
    this.store.dispatch(new UpdateRecommendationStatusAsApprove(recommendation));
  }
  // letter
  createLetter(letter: any): void {
    this.store.dispatch(new CreateLetter(letter));
  }
  createDraftLetter(letter: any): void {
    this.store.dispatch(new CreateDraftLetter(letter));
  }
  updateDraftLetter(letter: any): void {
    this.store.dispatch(new UpdateDraftLetter(letter));
  }
  createSubmitLetter(letter: any): void {
    this.store.dispatch(new CreateSubmitLetter(letter));
  }
  updateDraftLetterAsSubmit(letter: any): void {
    this.store.dispatch(new UpdateDraftLetterAsSubmit(letter));
  }
  updateLetterStatusAsAdjust(letter: any): void {
    this.store.dispatch(new UpdateLetterStatusAsAdjust(letter));
  }
  updateLetterStatusAsApprove(letter: any): void {
    this.store.dispatch(new UpdateLetterStatusAsApprove(letter));
  }

  getLetter(collectionQuery: CollectionQuery): void {
    this.store.dispatch(new GetLetter(collectionQuery));
  }

  createRecommendation(recommendation: any): void {
    this.store.dispatch(new CreateRecommendation(recommendation));
  }

  updateRecommendation(recommendation: any): void {
    this.store.dispatch(new UpdateRecommendation(recommendation));
  }

  updateLetter(letter: any): void {
    this.store.dispatch(new UpdateLetter(letter));
  }

  getResponse(id: string): void {
    this.store.dispatch(new GetResponse(id));
  }
  sendMessage(response: any): void {
    this.store.dispatch(new SendMessage(response));
  }

  listMessage(id: string, request: CollectionQuery): void {
    this.store.dispatch(new ListMessage(id, request));
  }
  getComplainEscalated(collectionQuery: CollectionQuery, id: string): void {
    this.store.dispatch(new GetComplainEscalated(collectionQuery, id));
  }

  listComplainEscalated(collectionQuery: CollectionQuery): void {
    this.store.dispatch(new ListComplainEscalated(collectionQuery));
  }
  getComplainEscalatedResponse(id: string): void {
    this.store.dispatch(new GetComplainEscalatedResponse(id));
  }
}
