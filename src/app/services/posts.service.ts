import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'ngx-custom-validators';
import { empty as observableEmpty, Observable, of, BehaviorSubject } from 'rxjs';
import { Post } from '@app/models/post';
import { map, catchError, scan, tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QueryDocumentSnapshot, CollectionReference } from '@angular/fire/firestore';
import { NotificationService } from './notification.service';
import firebase from "firebase/app";
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { PaginatorService } from './paginator.service';
import moment from 'moment';
import { CoreService } from './core.service';

// FUENTE: https://medium.com/angular-chile/angular-6-y-firestore-b7f270adcc96
export interface Tag {
	id: number;
	name: string;
}

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
export class PostsService {
	collection: AngularFirestoreCollection<Post>;
	id: string;

	// Source data
	private _done = new BehaviorSubject(false);
	private _loading = new BehaviorSubject(false);

	done: Observable<boolean> = this._done.asObservable();
	loading: Observable<boolean> = this._loading.asObservable();

	CURSOR: QueryDocumentSnapshot<any>;
	private query: QueryConfig;
	private ref: any;


	constructor(
		private gb: FormBuilder,
		private db: AngularFirestore,
		private notify: NotificationService,
		private storage: AngularFireStorage,
		private core: CoreService,
	) {
		this.collection = this.db.collection('posts');
	}

	get form(): FormGroup {
		return this.gb.group({
			id: [""],
			title: ["", [Validators.required]],
			content: ["", Validators.required],
			featured_image: ["", [CustomValidators.url]],
			tags: this.gb.array([])
		});
	}

	init(config: PageInit) {
		this.query = {
			collection: config.collection,
			orderBy: config.orderBy,
			limit: 10,
			filters: null,
			search: null,
			reverse: false, // false = created_at asc = más antiguo
			prepend: false,
			...config.opts
		}

		return this.firstSlice(config);
	}

	list(col: AngularFirestoreCollection<any>): Observable<Post[]> {

		return col.snapshotChanges().pipe(
			map(changes => {
				let values = changes.map(a => {
					const data = a.payload.doc.data() as Post;
					data.id = a.payload.doc.id;
					this.CURSOR = a.payload.doc;

					return data;
				});

				values = this.query.prepend ? values.reverse() : values

				// update source with new values, done loading
				// this._data.next(values);
				this._loading.next(false);
				console.log('paso por LIST');
				// no more values, mark done
				if (!values.length) {
					this._done.next(true);
				}
				return values;
			}),
			scan((acc, val) => {
				return this.query.prepend ? val.concat(acc) : acc.concat(val)
			})
		);
	}

	// Retrieves additional data from firestore
	more(cursor: QueryDocumentSnapshot<any>) {

		return this.db.collection(this.query.collection, ref => this.ref.startAfter(cursor));

	}


	private firstSlice(config: PageInit): AngularFirestoreCollection<any> {
		return this.db.collection(this.query.collection, (ref: CollectionReference) => {

			switch (true) {
				case config.opts.search && config.opts.search != "":

					return this.ref = ref
						.orderBy('title', 'asc')
						.orderBy(this.query.orderBy, this.query.reverse ? 'desc' : 'asc')
						.limit(this.query.limit)
						.startAt(this.query.search)
						.endAt(this.query.search + '\uf8ff');

				case config.opts.filters && config.opts.filters.author != "":

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
	}

	getCursor(id: string): Observable<QueryDocumentSnapshot<any>> {
		return this.collection.doc(id)
			.snapshotChanges()
			.pipe(
				map((snap: any) => {
					if (!snap.payload.exists) return;
					return snap.payload;
				}),
			);
	}

	async create(post: Post) {
		let Post: any = null;
		let id: any = null;
		const createdAt = this.timestamp;

		post = {
			...post,
			... { createdAt }
		};

		Post = await this.collection.add(post)
			.then(async (docRef: DocumentReference) => {

				const doc = await docRef.get();
				id = docRef.id;
				return doc.data() as Post;

			});


		Post.id = id;
		Post.created_at = Post.createdAt.seconds;

		await this.collection.doc(id).set(Post, { merge: true });
		return Post;

	}

	read(id: string): Observable<Post> {
		return this.collection.doc(id)
			.valueChanges()
			.pipe(
				map((snap: any) => {
					if (!snap) return;
					return snap
					if (!snap.payload.exists) return;

					// return {
					// 	id: snap.payload.id,
					// 	doc: snap.payload,
					// 	...(snap.payload.data() as Post)
					// };

					const data = snap.payload.data() as Post;
					const id = snap.payload.id;
					return { id, ...data };
				}),
			);
	}

	async update(post: Post) {

		// try {
		return await this.collection.doc(post.id).set(post, { merge: true });

		// this.notify.open("toast.post.updated", "toast.close");
		// } catch (error) {
		// this.errorHandler(error);
		// }

	}

	async delete(post: Post): Promise<void> {


		if (post.featured_image.search("https://firebasestorage.googleapis.com") == 0)
			await this.storage.storage.refFromURL(post.featured_image).delete();
		await this.collection.doc(post.id).delete();

		// TODO: // ACCION EN CADENA, reinicio los post list
		// this.page.reset();

		// const init: PageInit = {
		// 	collection: 'posts', orderBy: 'created_at', opts: { reverse: true, prepend: false }
		// };

		// this.page.init(init);


	}

	private get timestamp() {
		return firebase.firestore.FieldValue.serverTimestamp();
	}

	private errorHandler(error: any) {
		console.log("error: ", error);
		this.notify.open("toast.firebase." + error.code, "toast.close");
		return of(null);
		// return observableEmpty();
	}
}
