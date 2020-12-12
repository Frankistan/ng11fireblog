import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { I18nService } from '@app/services/i18n.service';
import { PaginatorService, PageInit } from '@app/services/paginator.service';
import { FiltersService } from '@app/services/filters.service';
import { State } from '@app/store/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { loadPosts, clearPosts } from '@app/store/actions/post.actions';
import moment from 'moment';

@Component({
	selector: 'app-filters',
	templateUrl: './filters.component.html',
	styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
	@Input("filterNavRef") filterNavRef: MatSidenav;
	form: FormGroup;
	minimum = null;
	maximum = null;

	authors = [
		{
			uid: "",
			displayName: "",
			selected: true
		},
		{
			uid: "3rVqxwGyjWZH9yAWTslXf47K1Fv1",
			displayName: "Iban Salgado",
			selected: false
		},
		{
			uid: "D0G8KfvW7gXqjUS4JpsxaFY4so93",
			displayName: "Úrsula Seijas",
			selected: false
		},
		{
			uid: "USpQ4GwiRNN1gPoUl5FEvMCttHw2",
			displayName: "Estefanía Conde",
			selected: false
		},
		{
			uid: "tXWXpHeP3pOf1eyiIqThueRjmqz1",
			displayName: "Alicia Aragón",
			selected: false
		},
		{
			uid: "Sa0LN1o1v0U5v1NW9Tye1kJMowa2",
			displayName: "Aníbal Báez",
			selected: false
		},
		{
			uid: "5doyO55GSTWQetWMhXw0jEJsLe32",
			displayName: "Felicidad Rey",
			selected: false
		}
	];

	myFilter = (d: any): boolean => {
        if(!d) d= moment();
		const day = d.day();
		// Prevent Saturday and Sunday from being selected.
		return day !== 0 && day !== 6;
	};

	constructor(
		private adapter: DateAdapter<any>,
		private i18n: I18nService,
		private store:Store<State>,
		public filtersService: FiltersService
	) {
		this.form = filtersService.form;
	}

	ngOnInit(): void {
		this.adapter.setLocale(this.i18n.language);
	}

	save() {
		let input = this.form.value;

		let f = {
			date: {
				min: input.minDate.unix(),
				max: input.maxDate.unix()
			},
			author: input.author
		};

		// this.filter();

		// this.store.dispatch(clearPosts());

		const init: PageInit = {
			collection: 'posts', orderBy: 'created_at', opts: {
				reverse: true,
				filters: f
			}
		};

		this.store.dispatch(loadPosts({init}));

		this.filterNavRef.close();
	}

	reset() {
		this.form.patchValue({
			author: "",
			minDate: this.filtersService.minimum,
			maxDate: this.filtersService.maximum
		});

		// this.store.dispatch(clearPosts());

		const init: PageInit = {
			collection: 'posts', orderBy: 'created_at', opts: { reverse: true, prepend: false }
		};

		this.store.dispatch(loadPosts({init}));
	}

	filter(opts) {

		// this.store.dispatch(clearPosts());

		const init: PageInit = {
			collection: 'posts', orderBy: 'created_at', opts: opts
		};

		this.store.dispatch(loadPosts({init}));

	}

}
