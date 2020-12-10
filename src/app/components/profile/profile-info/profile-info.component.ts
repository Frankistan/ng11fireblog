import { Component, OnInit, Input } from '@angular/core';
import { I18nService } from '@app/services/i18n.service';
import { Observable } from 'rxjs';
import { GeocodingService } from '@app/services/geocoding.service';
import { User } from '@app/models/user';

@Component({
	selector: 'app-profile-info',
	templateUrl: './profile-info.component.html',
	styleUrls: ['./profile-info.component.scss']
})
export class ProfileInfoComponent implements OnInit {
	@Input('user') user: User;
	locale: string = this._i18n.language;
	items: Array<any>;

	address$: Observable<any>;

	constructor(
		private _i18n: I18nService,
		private _geo: GeocodingService,
	) {}

	ngOnInit(): void {
		// this.address$ = this._geo.geocode(this.user.lastSignInLocation);
		this.items = [
			{
				tooltip: 'profile.employeeId',
				icon: 'assignment_ind',
				value: this.user.employeeId
			},
			{
				tooltip: 'profile.workPlace',
				icon: 'work',
				value: this.user.workPlace
			},
			// {
			// 	tooltip: 'profile.campaign',
			// 	icon: 'fas fa-campground',
			// 	value: this.user.campaign
			// },
			{
				tooltip: 'profile.acd',
				icon: 'call',
				value: this.user.acd || "6226"
			},
			{
				tooltip: 'profile.lastLogin',
				icon: 'access_time',
				value: this.user.lastSignInTime
			}
		];
	}

}
