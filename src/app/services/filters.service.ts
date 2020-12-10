import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import moment from 'moment';

@Injectable({
	providedIn: 'root'
})
export class FiltersService {

	minimum = null;
	maximum = null;

	constructor(
		private fb: FormBuilder,
	) { }

	get form():FormGroup {
		this.minimum = moment([2014, 1, 3]);
		let now = moment();
		let day = Number(now.format("d"));
		switch (day) {
			case 0:
				now.subtract(2, "day");
				this.maximum = moment([
					Number(now.format("Y")),
					Number(now.format("M")) - 1,
					Number(now.format("D"))
				]);
				break;
			case 6:
				now.subtract(1, "day");
				this.maximum = moment([
					Number(now.format("Y")),
					Number(now.format("M")) - 1,
					Number(now.format("D"))
				]);
				break;
			default:
				this.maximum = moment([
					Number(now.format("Y")),
					Number(now.format("M")) - 1,
					Number(now.format("D"))
				]);
				break;
		}

		return this.fb.group({
			author: new FormControl(""),
			minDate: new FormControl(this.minimum),
			maxDate: new FormControl(this.maximum)
		});
	}

}
