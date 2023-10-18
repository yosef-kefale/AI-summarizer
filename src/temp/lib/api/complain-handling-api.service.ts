import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Collection, CollectionQuery, collectionQueryBuilder, Environment, LoggerService } from '@erp-fe/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Complain } from '../models/complains';
import { Letter } from '../models/letter';

@Injectable()
export class ComplianHandlingApiService {
  compliantHandlingRootEndpoint;
  constructor(
    private readonly http: HttpClient,
    private readonly logger: LoggerService,
    private readonly store: Store,
    @Inject('environment') private readonly environment: Environment
  ) {
    this.compliantHandlingRootEndpoint = {
      getHopResponse: `${environment.urls.api}/complaint/api/complaint-responses/get-complaint-responses-by-compliant-id`,
      getInvestigatorComplaints: `${environment.urls.api}/complaint/api/complaints/get-complaint-by-assigned-investigator`,
      getClarifications: `${environment.urls.api}/complaint/api/clarifications/get-clarification-response-with-clarification-by-compliant-id`,
      getInvestigatorsInComplain: `${environment.urls.api}/complaint/api/complaints/get-investigator-assignments-by-complaint-id`,

      getActiveInvestigatorsInComplain: `${environment.urls.api}/complaint/api/complaints/get-active-investigator-assignment`,

      getAssignedInvestigator: `${environment.urls.api}/complaint/api/complaint-responses/get-complaint-responses-by-compliant-id`,
      getSecretaryRecommendationSummary: `${environment.urls.api}/complaint/api/recommendations/get-recommendations-by-compliant-id`,
      listComplains: `${environment.urls.api}/complaint/api/complaints/get-complaints`,
      listBoard: `${environment.urls.api}/egp-system-administration/api/workgroups/get-workgroup-members-by-workgroup-id`,
      addConsenter: `${environment.urls.api}/complaint/api/complaint-responses/add-consenters-in-complaint-response`,
      changeStatus: `${environment.urls.api}/complaint/api/complaint-responses/submit-complaint-response`,
      activateConsenter: `${environment.urls.api}/complaint/api/complaint-responses/update-consent-in-complaint-response`,
      getWorkgroups: `${environment.urls.api}/egp-system-administration/api/workgroups/get-active-board-members`,
      detailComplain: `${environment.urls.api}/complaint/api/complaints/get-complaint`,
      getComplainAttachment: `${environment.urls.api}/complaint/api/complaints/get-attachment`,

      createInvestigator: `${environment.urls.api}/complaint/api/complaints/add-new-investigator-assignment-in-complaint`,
      updateInvestigator: `${environment.urls.api}/complaint/api/complaints/update-investigator-assignment-in-complaint`,
      listAssignedInvestigators: `${environment.urls.api}/complaint/api/complaints/get-investigator-assignments`,

      createResponse: `${environment.urls.api}/complaint/api/complaint-responses/create-complaint-response`,

      //TODO check the URL
      createRecommendation: `${environment.urls.api}/complaint/api/recommendations/create-recommendation`,
      updateRecommendation: `${environment.urls.api}/complaint/api/recommendation/update-recommendation`,
      updateDraftRecommendation: `${environment.urls.api}/complaint/api/recommendations/update-recommendation`,
      updateDraftRecommendationAsSubmit: `${environment.urls.api}/complaint/api/recommendations/update-submit-recommendation`,
      updateSecretaryRecommendationStatusAsAdjust: `${environment.urls.api}/complaint/api/recommendations/update-secretary-adjustment-recommendation`,
      updateRecommendationStatusAsApprove: `${environment.urls.api}/complaint/api/recommendations/update-approve-recommendation`,

      updateLetter: `${environment.urls.api}/complaint/api/complaints/update-letter`,

      getComplainLetter: `${environment.urls.api}/complaint/api/complaints/get-letter-by-compliant-id`,

      getComplainResponse: `${environment.urls.api}/complaint/api/complaint-responses/get-complaint-responses-by-compliant-id`,
      getComplainResponseAttachment: `${environment.urls.api}/complaint/api/complaint-responses/get-attachment`,

      getClarificationResponse: `${environment.urls.api}/complaint/api/clarifications/get-clarifications-by-compliant-id`,
      createClarification: `${environment.urls.api}/complaint/api/clarifications/create-clarification`,
      createClarificationResponse: `${environment.urls.api}/complaint/api/clarifications/add-clarification-response-in-clarification`,

      //getComplainLetter: `${environment.urls.api}/complaint​/api​/complaints​/get-letters`,
      createLetter: `${environment.urls.api}/complaint/api/complaints/add-letter`,
      createDraftLetter: `${environment.urls.api}/complaint/api/complaints/add-letter-as-draft`,
      createSubmitLetter: `${environment.urls.api}/complaint/api/complaints/submit-letter`,
      updateDraftLetter: `${environment.urls.api}/complaint/api/complaints/update-letter`,
      updateDraftLetterAsSubmit: `${environment.urls.api}/complaint/api/complaints/update-submit-letter`,
      updateLetterStatusAsAdjust: `${environment.urls.api}/complaint/api/complaints/update-adjust-letter-status`,
      updateLetterStatusAsApprove: `${environment.urls.api}/complaint/api/complaints/update-approve-letter-status`,

      //Recommendation
      createDraftRecommendation: `${environment.urls.api}/complaint/api/recommendations/create-recommendation-as-draft`,
      createSubmitRecommendation: `${environment.urls.api}/complaint/api/recommendations/submit-recommendation`,
      detailSecretaryRecommendation:`${environment.urls.api}/complaint/api/recommendations/get-recommendations-by-complaint-id`,

      getComplainEscalated: `${environment.urls.api}/complaint/api/complaints/get-escalated-complaints`,
      getComplainEscalatedResponse: `${environment.urls.api}/complaint/api/complaints/get-escalated-complaints`,

      getAttachmentMessageAttachment: `${environment.urls.api}/complaint-response/api/get-attachment`,

      sendMessage: `${environment.urls.api}/complaint/api/complaints/add-complaint-message`,
      listMessage: `${environment.urls.api}/complaint/api/complaints/get-complaint-messages-by-complaint-id`
    };
  }
  getHopResponse(request: CollectionQuery, id: string): Observable<any> {
    const params = collectionQueryBuilder(request);

    return this.http
      .get<Collection<any>>(`${this.compliantHandlingRootEndpoint.getHopResponse}/${id}`, { params })
      .pipe(
        map((result) => {
          return result.items[0];
        })
      );
  }

  getComplainBoardResponse(request: CollectionQuery, id: string): Observable<any> {
    const params = collectionQueryBuilder(request);

    return this.http
      .get<Collection<any>>(`${this.compliantHandlingRootEndpoint.getHopResponse}/${id}`, { params })
      .pipe(
        map((result) => {
          return result.items[0];
        })
      );
  }


  getInvestigatorComplaints(request: CollectionQuery, id: string): Observable<any> {
    const params = collectionQueryBuilder(request);

    return this.http
      .get<Collection<any>>(`${this.compliantHandlingRootEndpoint.getInvestigatorComplaints}/${id}`, { params })
      .pipe(
        map((result) => {
          return result.items.map(item => item.complaint);
        })
      );
  }

  getActiveInvestigatorsInComplain(request: CollectionQuery, id: string): Observable<any> {
    const params = collectionQueryBuilder(request);

    return this.http
      .get<Collection<any>>(`${this.compliantHandlingRootEndpoint.getActiveInvestigatorsInComplain}/${id}`, { params });
  }

  getClarifications(request: CollectionQuery, id: string): Observable<any> {
    const params = collectionQueryBuilder(request);

    return this.http
      .get<Collection<any>>(`${this.compliantHandlingRootEndpoint.getClarifications}/${id}`, { params })
      .pipe(
        map((result) => {
          return result.items;
        })
      );
  }

  getInvestigatorsInComplain(request: CollectionQuery, id: string): Observable<any> {
    const params = collectionQueryBuilder(request);

    return this.http
      .get<Collection<any>>(`${this.compliantHandlingRootEndpoint.getInvestigatorsInComplain}/${id}`, { params })
      .pipe(
        map((result) => {
          return result.items;
        })
      );
  }

  getSecretaryRecommendationSummary(request: CollectionQuery, id: string): Observable<any> {
    const params = collectionQueryBuilder(request);

    return this.http
      .get<Collection<any>>(`${this.compliantHandlingRootEndpoint.getHopResponse}/${id}`, { params })
      .pipe(
        map((result) => {
          return result.items[0];
        })
      );
  }

  getAssignedInvestigator(request: CollectionQuery, id: string): Observable<any> {
    const params = collectionQueryBuilder(request);

    return this.http
      .get<Collection<any>>(`${this.compliantHandlingRootEndpoint.getAssignedInvestigator}/${id}`, { params })
      .pipe(
        map((result) => {
          return result.items[0];
        })
      );
  }

  getClarificationResponse(id: string): Observable<any> {
    return this.http.get<any>(`${this.compliantHandlingRootEndpoint.getClarificationResponse}/${id}`).pipe(
      map((result) => {
        return result;
      })
    );
  }

  listComplain(request: CollectionQuery): Observable<Collection<Complain>> {
    const params = collectionQueryBuilder(request);

    return this.http.get<Collection<Complain>>(`${this.compliantHandlingRootEndpoint.listComplains}`, { params });
  }

  listAssignedInvestigators(request: CollectionQuery): Observable<Collection<any>> {
    const params = collectionQueryBuilder(request);

    return this.http.get<Collection<any>>(`${this.compliantHandlingRootEndpoint.listAssignedInvestigators}`, { params });
  }

  detailComplain(id: string): Observable<any> {
    return this.http.get<any>(`${this.compliantHandlingRootEndpoint.detailComplain}/${id}`);
  }
  detailSecretaryRecommendation(id: string): Observable<any> {
    return this.http.get<any>(`${this.compliantHandlingRootEndpoint.detailSecretaryRecommendation}/${id}`) .pipe(
      map((result) => {
        return result.items[0];
      })
    );
  }
  listBoard(): Observable<any> {
    return this.http.get<any>(`${this.compliantHandlingRootEndpoint.getWorkgroups}`);
  }

  createComplainResponse(response: any): Observable<any> {
    if (response.type === 'false') {
      return this.http.post<any>(`${this.compliantHandlingRootEndpoint.createResponse}`, response.form).pipe(
        mergeMap((result: any) => {
          const data = {
            compliantResponseId: result.id,
            consenterMembers: response.members,
            compliantId: result.compliantId
          };

          return this.http.post<any>(`${this.compliantHandlingRootEndpoint.addConsenter}`, data);
        })
      );
    }

    return this.http.post<any>(`${this.compliantHandlingRootEndpoint.createResponse}`, response.form);
  }

  createComplainRecommendation(recommendation: any): Observable<any> {
    return this.http.post<any>(`${this.compliantHandlingRootEndpoint.createRecommendation}`, recommendation.form);
  }

  createInvestigator(investigator: any): Observable<any> {
    return this.http.post<any>(`${this.compliantHandlingRootEndpoint.createInvestigator}`, investigator);
  }

  updateInvestigator(investigator: any): Observable<any> {
    return this.http.put<any>(`${this.compliantHandlingRootEndpoint.updateInvestigator}/${investigator.id}`, investigator);
  }

  updateComplainRecommendation(recommendation: any): Observable<any> {
    return this.http.put<any>(`${this.compliantHandlingRootEndpoint.updateRecommendation}`, recommendation);
  }

  updateLetter(letter: any): Observable<any> {
    return this.http.put<any>(`${this.compliantHandlingRootEndpoint.updateLetter}/${letter.id}`, letter);
  }

  createClarification(clarification: any): Observable<any> {
    return this.http.post<any>(`${this.compliantHandlingRootEndpoint.createClarification}`, clarification.form);
  }

  createClarificationResponse(clarificationResponse: any): Observable<any> {
    return this.http.post<any>(`${this.compliantHandlingRootEndpoint.createClarificationResponse}`, clarificationResponse.form);
  }
//Recommendation
createDraftRecommendation(recommendation: any): Observable<any> {
  return this.http.post<any>(`${this.compliantHandlingRootEndpoint.createDraftRecommendation}`, recommendation.form);
}

createSubmitRecommendation(recommendation: any): Observable<any> {
  return this.http.post<any>(`${this.compliantHandlingRootEndpoint.createSubmitRecommendation}`, recommendation.form);
}

updateDraftRecommendation(recommendation: any): Observable<any> {
  return this.http.put<any>(`${this.compliantHandlingRootEndpoint.updateDraftRecommendation}/${recommendation.id}`, recommendation.form);
}
updateDraftRecommendationAsSubmit(recommendation: any): Observable<any> {
  return this.http.put<AnalyserNode>(`${this.compliantHandlingRootEndpoint.updateDraftRecommendationAsSubmit}/${recommendation.id}`, recommendation.form);
}
updateSecretaryRecommendationStatusAsAdjust(recommendation: any): Observable<any> {
  return this.http.put<any>(`${this.compliantHandlingRootEndpoint.updateSecretaryRecommendationStatusAsAdjust}/${recommendation.id}`, recommendation.form);
}
updateRecommendationStatusAsApprove(recommendation: any): Observable<any> {
  return this.http.put<any>(`${this.compliantHandlingRootEndpoint.updateRecommendationStatusAsApprove}/${recommendation.id}`, recommendation.form);
}
// Letter
  createLetter(letter: any): Observable<any> {
    return this.http.post<any>(`${this.compliantHandlingRootEndpoint.createLetter}`, letter);
  }

  createDraftLetter(letter: any): Observable<any> {
    return this.http.post<any>(`${this.compliantHandlingRootEndpoint.createDraftLetter}`, letter);
  }

  createSubmitLetter(letter: any): Observable<any> {
    return this.http.post<any>(`${this.compliantHandlingRootEndpoint.createSubmitLetter}`, letter);
  }
  updateDraftLetter(letter: Letter): Observable<Letter> {
    return this.http.put<Letter>(`${this.compliantHandlingRootEndpoint.updateDraftLetter}/${letter.id}`, letter);
  }
  updateDraftLetterAsSubmit(letter: Letter): Observable<Letter> {
    return this.http.put<Letter>(`${this.compliantHandlingRootEndpoint.updateDraftLetterAsSubmit}/${letter.id}`, letter);
  }
  updateLetterStatusAsAdjust(letter: Letter): Observable<Letter> {
    return this.http.put<Letter>(`${this.compliantHandlingRootEndpoint.updateLetterStatusAsAdjust}/${letter.id}`, letter);
  }
  updateLetterStatusAsApprove(letter: Letter): Observable<Letter> {
    return this.http.put<Letter>(`${this.compliantHandlingRootEndpoint.updateLetterStatusAsApprove}/${letter.id}`, letter);
  }
  activateConsenter(data: any): Observable<any> {
    return this.http.put<any>(`${this.compliantHandlingRootEndpoint.activateConsenter}/${data.compliantResponseId}`, data);
  }
  changeStatus(data: any): Observable<any> {
    return this.http.post<any>(`${this.compliantHandlingRootEndpoint.changeStatus}`, data);
  }
  getComplainResponse(id: string): Observable<any> {
    return this.http.get<any>(`${this.compliantHandlingRootEndpoint.getComplainResponse}/${id}`).pipe(
      map((result) => {
        return result;
      })
    );
  }

  getComplainLetter(request: CollectionQuery, id: string): Observable<any> {
    const params = collectionQueryBuilder(request);

    return this.http
      .get<Collection<any>>(`${this.compliantHandlingRootEndpoint.getComplainLetter}/${id}`, { params })
      .pipe(
        map((result) => {
          return result;
        })
      );
  }
  listComplainEscalated(request: CollectionQuery): Observable<Collection<any>> {
    const params = collectionQueryBuilder(request);

    return this.http.get<Collection<any>>(`${this.compliantHandlingRootEndpoint.getComplainEscalated}`, { params });
  }

  getAssignedInvestigators(request: CollectionQuery): Observable<Collection<any>> {
    const params = collectionQueryBuilder(request);

    return this.http.get<Collection<any>>(`${this.compliantHandlingRootEndpoint.getComplainEscalated}`, { params });
  }

  getComplainEscalated(request: CollectionQuery, id: string): Observable<any> {
    const params = collectionQueryBuilder(request);

    return this.http
      .get<any>(`${this.compliantHandlingRootEndpoint.getComplainEscalated}`, { params })
      .pipe(
        map((result) => {
          return result.items[0];
        })
      );
  }
  // tslint:disable-next-line: no-identical-functions
  getComplainEscalatedResponse(id: string): Observable<any> {
    return this.http.get<any>(`${this.compliantHandlingRootEndpoint.getComplainResponse}/${id}`).pipe(
      map((result) => {
        return result.items[0];
      })
    );
  }
  sendMessage(response: any): Observable<any> {
    return this.http.post<any>(`${this.compliantHandlingRootEndpoint.sendMessage}`, response);
  }
  listMessage(id: string, request: CollectionQuery): Observable<any> {
    const params = collectionQueryBuilder(request);

    return this.http.get<any>(`${this.compliantHandlingRootEndpoint.listMessage}/${id}`, { params });
  }
}
