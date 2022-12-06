import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { EnvService } from "./env.service";

@Injectable({
	providedIn: "root"
})
export class ConvertersService {
	constructor(
    private http: HttpClient, 
    private env: EnvService,
    private translateService: TranslateService,
  ) {}
  private getHeaders() {
    return { 'app-language': this.translateService.currentLang };
  }

	markdownToPDF(content: string) {
		const headers = this.getHeaders();
		return this.http.post(this.env.API_URL + 'converters/markdown_to_pdf', { content }, { headers, responseType: 'blob' });
	}
}