import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from '@app/services/core.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PaginatorService, PageInit } from '@app/services/paginator.service';

@Component({
	selector: 'app-search-box',
	templateUrl: './search-box.component.html',
	styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent implements OnInit, OnDestroy, AfterViewInit {
	private destroy = new Subject<any>();

	@ViewChild("form", { static: false }) formEl: ElementRef;
	searching: boolean = false;
	searchForm: FormGroup;
	searchInput: AbstractControl;
	visible: boolean = true;


	constructor(
		private router: Router,
		private _fb: FormBuilder,
		public core: CoreService,
		private page: PaginatorService,
	) {
		this.searchForm = this._fb.group({
			searchInput: ["", Validators.minLength(3)]
		});

		this.searchInput = this.searchForm.get("searchInput");
	}

	ngOnInit(): void {
		this.activeRTS(); // REAL TIME SEARCH
	}

	activeRTS(): void {
		this.searchInput.valueChanges
			.pipe(
				debounceTime(400),
				distinctUntilChanged(),
				map((term: string) => {
					term = term.trim().toUpperCase();

					if (term.length < 3) return;

					this.page.reset();

					const init: PageInit = {
						collection: 'posts', orderBy: 'created_at',
						opts: {
							reverse: true, prepend: false, search: term
						}
					};

					this.page.init(init);


					// this.page.init('posts', 'created_at',
					// 	{
					// 		reverse: true,
					// 		prepend: false,
					// 		search: term
					// 	});

				}),
				takeUntil(this.destroy))
			.subscribe();
	}

	clear() {
		this.searchForm.controls['searchInput'].setValue('');
	}

	closeX(event: Event) {

		if (this.searchForm.controls['searchInput'].value != '') {
			// TODO: RESET FILTERS
			this.clear();
		} else {
			this.formEl.nativeElement.className = "gb_Ue aSVJYc-G0jgYd-ZMv3u";
			this.router.navigate(['/posts']);
		}

	}

	closeA(event: Event) {
		this.formEl.nativeElement.className = this.formEl.nativeElement.className.replace(" gb_N gb_Ve", "");
	}

	goSearch() {
		this.formEl.nativeElement.className += ' gb_N gb_Ve';
		this.router.navigate(['/search']);
	}

	ngAfterViewInit(): void {
		if (this.router.url == "/search") this.formEl.nativeElement.className += ' gb_N gb_Ve';
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}
}
