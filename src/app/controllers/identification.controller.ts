import { Injectable } from '@angular/core';
import * as dniChecker from 'better-dni';

@Injectable({
  providedIn: 'root',
})
export class IdentificationController {
	constructor(){}
	isValidDNI(identification: string) {
		return dniChecker.isNIE(identification) ||
			dniChecker.isNIF(identification) ||
			dniChecker.isValid(identification);
	}
	isValidDNIEC(identification: string) {
		const nProvinces = 24;
		if (!identification || !(identification.length == 10))
			return false;
		// Check if identification has letters
		if (identification.match(/[a-zA-Z]/))
			return false;

		const province = parseInt(identification.slice(0, 2));
		if (province < 1 || (province > nProvinces))
			return false;

		return true;
	}
}
