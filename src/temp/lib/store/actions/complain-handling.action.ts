import { CollectionQuery } from '@erp-fe/core';

export class ListComplain {
  static readonly type = '[CompliantHandlingState] ListComplain';
  constructor(public readonly payload?: CollectionQuery) {}
}
export class GetHopResponse {
  static readonly type = '[CompliantHandlingState] GetHopResponse';
  constructor(public readonly payload?: any, public readonly id?: string) {}
}

export class GetComplainBoardResponse{
  static readonly type = '[CompliantHandlingState] GetComplainBoardResponse';
  constructor(public readonly payload?: any, public readonly id?: string) {}
}

export class GetInvestigatorsInComplain{
  static readonly type = '[CompliantHandlingState] GetInvestigatorComplaints';
  constructor(public readonly payload?: any, public readonly id?: string) {}
}

export class GetActiveInvestigatorsInComplain{
  static readonly type = '[CompliantHandlingState] GetActiveInvestigatorsInComplain';
  constructor(public readonly payload?: any, public readonly id?: string) {}
}

export class GetComplainLetter{
  static readonly type = '[CompliantHandlingState] GetComplainLetter';
  constructor(public readonly payload?: any, public readonly id?: string) {}
}

export class GetClarificationsInComplain{
  static readonly type = '[CompliantHandlingState] GetClarificationsInComplain';
  constructor(public readonly payload?: any, public readonly id?: string) {}
}

export class GetSecretaryRecommendationSummary {
  static readonly type = '[CompliantHandlingState] GetSecretaryRecommendationSummary';
  constructor(public readonly payload?: any, public readonly id?: string) {}
}
export class GetAssignedInvestigator {
  static readonly type = '[CompliantHandlingState] GetAssignedInvestigator';
  constructor(public readonly payload?: any, public readonly id?: string) {}
}
export class GetClarificationResponse {
  static readonly type = '[CompliantHandlingState] GetClarificationResponse';
  constructor(public readonly payload?: any, public readonly id?: string) {}
}

export class createComplainClarification{
  static readonly type = '[CompliantHandlingState] CreateComplainClarification';
  constructor(public readonly payload?: any, public readonly id?: string) {}
}
export class ListBoard {
  static readonly type = '[CompliantHandlingState] ListBoard';
  constructor(public readonly payload?: string) {}
}
export class DetailComplain {
  static readonly type = '[CompliantHandlingState] DetailComplain';
  constructor(public readonly payload?: string) {}
}
export class DetailSecretaryRecommendation{
  static readonly type = '[CompliantHandlingState] DetailSecretaryRecommendation';
  constructor(public readonly payload?: string) {}
}
export class CreateResponse {
  static readonly type = '[CompliantHandlingState] CreateResponse';
  constructor(public readonly payload?: any) {}
}

export class CreateInvestigator{
  static readonly type = '[CompliantHandlingState] CreateInvestigator';
  constructor(public readonly payload?: any) {}
}

export class CreateClarification{
  static readonly type = '[CompliantHandlingState] CreateClarification';
  constructor(public readonly payload?: any) {
  }
}

export class ClarificationResponse{
  static readonly type = '[CompliantHandlingState] ClarificationResponse';
  constructor(public readonly payload?: any) {
  }
}
//Recommendation
export class CreateDraftRecommendation{
  static readonly type = '[CompliantHandlingState] CreateDraftRecommendation';
  constructor(public readonly payload?: any) {
  }
}
export class CreateSubmitRecommendation{
  static readonly type = '[CompliantHandlingState] CreateSubmitRecommendation';
  constructor(public readonly payload?: any) {
  }
}
export class UpdateDraftRecommendation{
  static readonly type = '[CompliantHandlingState] UpdateDraftRecommendation';
  constructor(public readonly payload?: any) {
  }
}
export class UpdateDraftRecommendationAsSubmit{
  static readonly type = '[CompliantHandlingState] UpdateDraftRecommendationAsSubmit';
  constructor(public readonly payload?: any) {
  }
}
export class UpdateSecretaryRecommendationStatusAsAdjust{
  static readonly type = '[CompliantHandlingState] UpdateSecretaryRecommendationStatusAsAdjust';
  constructor(public readonly payload?: any) {
  }
}
export class UpdateRecommendationStatusAsApprove{
  static readonly type = '[CompliantHandlingState] UpdateRecommendationStatusAsApprove';
  constructor(public readonly payload?: any) {
  }
}
//Letter
export class CreateLetter{
  static readonly type = '[CompliantHandlingState] CreateLetter';
  constructor(public readonly payload?: any) {
  }
}
export class CreateDraftLetter{
  static readonly type = '[CompliantHandlingState] CreateDraftLetter';
  constructor(public readonly payload?: any) {
  }
}
export class UpdateDraftLetter{
  static readonly type = '[CompliantHandlingState] UpdateDraftLetter';
  constructor(public readonly payload?: any) {
  }
}

export class UpdateInvestigator{
  static readonly type = '[CompliantHandlingState] UpdateInvestigator';
  constructor(public readonly payload?: any) {
  }
}

export class CreateSubmitLetter{
  static readonly type = '[CompliantHandlingState] CreateSubmitLetter';
  constructor(public readonly payload?: any) {
  }
}
export class UpdateDraftLetterAsSubmit{
  static readonly type = '[CompliantHandlingState] UpdateDraftLetterAsSubmit';
  constructor(public readonly payload?: any) {
  }
}

export class UpdateLetterStatusAsAdjust{
  static readonly type = '[CompliantHandlingState] UpdateLetterStatusAsAdjust';
  constructor(public readonly payload?: any) {
  }
}
export class UpdateLetterStatusAsApprove{
  static readonly type = '[CompliantHandlingState] UpdateLetterStatusAsApprove';
  constructor(public readonly payload?: any) {
  }
}

export class CreateRecommendation {
  static readonly type = '[CompliantHandlingState] CreateRecommendation';
  constructor(public readonly payload?: any) {}
}

export class UpdateRecommendation{
  static readonly type = '[CompliantHandlingState] UpdateRecommendation';
  constructor(public readonly payload?: any) {}
}

export class UpdateLetter{
  static readonly type = '[CompliantHandlingState] UpdateLetter';
  constructor(public readonly payload?: any) {}
}
export class ActivateConsenter {
  static readonly type = '[CompliantHandlingState] ActivateConsenter';
  constructor(public readonly payload?: any) {}
}
export class ChangeStatus {
  static readonly type = '[CompliantHandlingState] ChangeStatus';
  constructor(public readonly payload?: any) {}
}
export class GetResponse {
  static readonly type = '[CompliantHandlingState] GetResponse';
  constructor(public readonly payload?: string) {}
}

export class GetInvestigatorLetter{
  static readonly type = '[CompliantHandlingState] GetInvestigatorLetter';
  constructor(public readonly payload?: string) {}
}

export class GetRecommendation {
  static readonly type = '[CompliantHandlingState] GetRecommendation';
  constructor(public readonly payload?: string) {}
}

export class GetAssignedInvestigators {
  static readonly type = '[CompliantHandlingState] GetAssignedInvestigators';
  constructor(public readonly payload?: CollectionQuery) {}
}

export class GetInvestigator {
  static readonly type = '[CompliantHandlingState] GetInvestigator';
  constructor(public readonly payload?: string) {}
}

export class GetClarification{
  static readonly type = '[CompliantHandlingState] GetRecommendation';
  constructor(public readonly payload?: string) {}
}
export class GetLetter{
  static readonly type = '[CompliantHandlingState] GetLetter';
  constructor(public readonly payload?: any) {}
}
export class ListComplainEscalated {
  static readonly type = '[CompliantHandlingState] ListComplainEscalated';
  constructor(public readonly payload?: CollectionQuery) {}
}
export class GetComplainEscalated {
  static readonly type = '[CompliantHandlingState] GetComplainEscalated';
  constructor(public readonly payload?: CollectionQuery, public readonly id?: string) {}
}
export class GetComplainEscalatedResponse {
  static readonly type = '[CompliantHandlingState] GetComplainEscalatedResponse';
  constructor(public readonly payload?: string) {}
}
export class SendMessage {
  static readonly type = '[CompliantHandlingState] SendMessage';
  constructor(public readonly payload?: any) {}
}
export class ListMessage {
  static readonly type = '[CompliantHandlingState] ListMessage';
  constructor(public readonly id: string, public readonly payload: CollectionQuery) {}
}
