export interface Country {
	id: number;
	capital: string;
	currency: string;
	currency_name: string;
	currency_symbol: string;
	emoji: string;
	emojiU: string;
	iso2: string;
	iso3: string;
	name: string;
	numeric_code: string;
	phone_code: string;
	region: string;
	subregion: string;
}

export interface CountryState {
	id: number;
	country_id: number;
	country_code: string;
	country_name: string;
	name: string;
	state_code: string;
}
