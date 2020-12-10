import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { QueryDocumentSnapshot } from '@angular/fire/firestore/interfaces';

@Injectable({
	providedIn: 'root'
})
export class CoreService {
    viewMode$: BehaviorSubject<boolean> = new BehaviorSubject(true);
	viewMode: Observable<boolean> = this.viewMode$.asObservable();
	loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
	setDrawer: BehaviorSubject<MatSidenav> = new BehaviorSubject(null);
	setSidenavContent: BehaviorSubject<MatSidenavContent> = new BehaviorSubject(null);
	setFilterNavRef: BehaviorSubject<MatSidenav> = new BehaviorSubject(null);
	cursor$: BehaviorSubject<QueryDocumentSnapshot<any>> = new BehaviorSubject(null);
	cursor: QueryDocumentSnapshot<any> = null;
	

	constructor() {
		
	}
}
