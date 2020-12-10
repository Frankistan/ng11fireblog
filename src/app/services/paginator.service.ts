import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection, CollectionReference } from '@angular/fire/firestore';
import { scan, tap, take, takeUntil } from 'rxjs/operators';

import moment from 'moment';

// FUENTE: https://fireship.io/lessons/infinite-scroll-firestore-angular/

interface QueryConfig {
	collection: string, //  path to collection
	filters: any, // set of filters
	limit: number, // limit per query
	orderBy: string, // field to orderBy
	prepend: boolean, // prepend to source?
	reverse: boolean, // reverse order?  |  false = created_at asc = más antiguo
	search: string, // filter when searching
}

export interface PageInit {
	collection: string;
	orderBy: string;
	opts?: any
}

@Injectable({
	providedIn: 'root'
})
export class PaginatorService implements OnDestroy {
	private destroy = new Subject<any>();
	private CURSOR: any = null;

	// Source data
	private _done = new BehaviorSubject(false);
	private _loading = new BehaviorSubject(false);
	private _data = new BehaviorSubject([]);

	private query: QueryConfig;
	private ref: any;

	// Observable data
	data: Observable<any>;
	done: Observable<boolean> = this._done.asObservable();
	loading: Observable<boolean> = this._loading.asObservable();

	constructor(private db: AngularFirestore) { }

	// Initial query sets options and defines the Observable
	// passing opts will override the defaults
	init(custom: PageInit) {
		this.data = null;
		this.done = null;

		
		this.query = {
			collection: custom.collection,
			orderBy: custom.orderBy,
			limit: 10,
			filters: null,
			search: null,
			reverse: false, // false = created_at asc = más antiguo
			prepend: false,
			...custom.opts
		}

		const first = this.db.collection(this.query.collection, (ref: CollectionReference) => {

			switch (true) {
				case custom.opts.search && custom.opts.search != "":

					return this.ref = ref
						.orderBy('title', 'asc')
						.orderBy(this.query.orderBy, this.query.reverse ? 'desc' : 'asc')
						.limit(this.query.limit)
						.startAt(this.query.search)
						.endAt(this.query.search + '\uf8ff');

				case custom.opts.filters && custom.opts.filters.author != "":

					return this.ref = ref
						.where("created_at", ">=", this.query.filters.date ? this.query.filters.date.min : moment([2014, 0, 1]).unix())
						.where("created_at", "<=", this.query.filters.date ? this.query.filters.date.max : moment.now())
						.where("author", "==", this.query.filters.author)
						.orderBy(this.query.orderBy, this.query.reverse ? 'desc' : 'asc')
						.limit(this.query.limit);

				default:

					return this.ref = ref
						.orderBy(this.query.orderBy, this.query.reverse ? 'desc' : 'asc')
						.limit(this.query.limit);

			}
		});

		this.mapAndUpdate(first);

		// Create the observable array for consumption in components
		this.data = this._data.asObservable()
			.pipe(
				scan((acc, val) => {
					return this.query.prepend ? val.concat(acc) : acc.concat(val)
				}),
				takeUntil(this.destroy)
			);

	}

	// Reset the page
	reset() {
		// this._data.next([]);
		// this._done.next(false);
		this.data = null;
		this.done = null;
	}

	// Retrieves additional data from firestore
	more() {
		// const cursor = this.getCursor();

		const cursor = this.CURSOR;

		const more = this.db.collection(this.query.collection, ref => this.ref.startAfter(cursor));

		this.mapAndUpdate(more);
	}


	// Determines the doc snapshot to paginate query 
	private getCursor() {
		const current = this._data.value;
		if (current.length) {
			return this.query.prepend ? current[0].doc : current[current.length - 1].doc
		}
		return null
	}


	// Maps the snapshot to usable format the updates source
	private mapAndUpdate(col: AngularFirestoreCollection<any>) {

		if (this._done.value || this._loading.value) { return };

		// loading
		this._loading.next(true);

		// Map snapshot with doc ref (needed for cursor)
		return col.snapshotChanges()
			.pipe(
				tap(arr => {
					let values = arr.map(snap => {
						const id = snap.payload.doc.id;
						const data = snap.payload.doc.data();
						this.CURSOR = snap.payload.doc;
						return { id, ...data }
					})

					// If prepending, reverse the batch order
					values = this.query.prepend ? values.reverse() : values

					// update source with new values, done loading
					this._data.next(values);
					this._loading.next(false);

					// no more values, mark done
					if (!values.length) {
						this._done.next(true);
					}
				}),
				take(1),
				takeUntil(this.destroy)
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}

}