import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { EnvService } from './env.service';

@Injectable({
  providedIn: 'root',
})
export class EvaluationService {
  constructor(
    private http: HttpClient,
    private env: EnvService,
    private translateService: TranslateService,
  ) {}
  private getHeaders() {
    return { 'app-language': this.translateService.currentLang };
  }
  evaluateStandardWithArtifact(
    experiment_id: number,
    standard_name: string,
    artifact_id?: number,
  ) {
    const headers = this.getHeaders();
    return this.http.post(
      this.env.API_URL + 'evaluation/evaluate_with_artifact/' + experiment_id,
      { standard_name, artifact_id },
      { headers },
    );
  }
  getStatusFromStandardEvaluation(experiment_id: number, standard_name: string) {
    const headers = this.getHeaders();
    return this.http.post(
      this.env.API_URL + 'evaluation/standard_status/' + experiment_id,
      { standard_name },
      { headers },
    );
  }
  generateArtifactInventoryPDF(experiment_id: number) {
    const headers = this.getHeaders();
    return this.http.get(
      this.env.API_URL + 'evaluation/inventario_artefacto/' + experiment_id,
      { headers, responseType: 'blob' },
    );
  }
  generateReadmeFile(experiment_id: number, experimenter_id: number) {
    const headers = this.getHeaders();
    return this.http.post(
      this.env.API_URL + 'evaluation/archivo_readme/' + experiment_id,
      { experimenter_id },
      { headers, responseType: 'blob' },
    );
  }
  getNonAccessibleArtifacts(experiment_id: number, standard_name: string) {
    const headers = this.getHeaders();
    return this.http.post(
      this.env.API_URL + 'evaluation/accesibilidad_archivos_datos/' + experiment_id,
      { standard_name },
      { headers },
    );
  }
  setExecutionScriptOrSoftwareStatus(experiment_id: number, standard_name: string, status: boolean) {
    const headers = this.getHeaders();
    return this.http.put(
      this.env.API_URL + 'evaluation/ejecucion_software_resultados/' + experiment_id,
      { standard_name, status },
      { headers },
    );
  }
  setDataManipulationStatus(experiment_id: number, standard_name: string, status: boolean) {
    const headers = this.getHeaders();
    return this.http.put(
      this.env.API_URL + 'evaluation/manipulacion_datos/' + experiment_id,
      { standard_name, status },
      { headers },
    );
  }
  evaluateTimesCompleteShortExecution(experiment_id: number) {
    const headers = this.getHeaders();
    return this.http.post(
      this.env.API_URL + 'evaluation/tiempos_ejecucion_short_and_completa/' + experiment_id,
      {},
      { headers, responseType: 'blob' },
    );
  }

  get(params = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.env.API_URL_NODE + 'evaluations', { params});
  }

  createEvaluation(evaluation) {
    const headers = this.getHeaders();
    return this.http.post(this.env.API_URL + 'evaluations',evaluation);
  }

  delete(_id = null): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(this.env.API_URL_NODE + 'evaluations', {
      params: { _id }
    });
  }

}
