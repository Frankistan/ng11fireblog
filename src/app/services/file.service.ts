import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, tap } from 'rxjs/operators';
import { NotificationService } from './notification.service';


// fuente: https://www.softwarequery.com/2019/11/angular-multiple-images-uploads-to-firebase.html
// https://medium.com/angular-chile/subir-archivos-a-firebase-cloud-storage-con-angular-7-d735d5dbfa53


@Injectable({
	providedIn: 'root'
})
export class FileService {
	uploads = [];
	allPercentage: Observable<any>;
	downloadURL: Promise<string>;
	
	// _collection: string = "uploads/featured_images";
	private _collection: string = "avatar";

	constructor(
		public afs: AngularFirestore,
		public storage: AngularFireStorage,
		private _ntf: NotificationService,
	){}	

	upload(filelist: File[], path?: string) {
		
		// reset the array
		this.uploads = [];
		const allPercentage: Observable<number>[] = [];

		for (const file of filelist) {

			// The storage path
			path = path || `${this._collection}/${new Date().getTime()}_${file.name}`;

			const ref = this.storage.ref(path);
			const task = this.storage.upload(path, file);
			const _percentage$ = task.percentageChanges();
			allPercentage.push(_percentage$);

			// create composed objects with different information. ADAPT THIS ACCORDING to YOUR NEED
			const uploadTrack = {
				fileName: file.name,
				percentage: _percentage$
			}

			// push each upload into the array
			this.uploads.push(uploadTrack);

			this.downloadURL = task.then(async (f) => {
				let url = await f.ref.getDownloadURL();
				return url;
			});

		}

		this.allPercentage = combineLatest(allPercentage).pipe(
				map((percentages) => {
					let result = 0;
					for (const percentage of percentages) {
						result = result + percentage;
					}
					return result / percentages.length;
				})
			);
	}

	async delete(downloadUrl: string):Promise<void> {
		
		try {
			await this.storage.storage.refFromURL(downloadUrl).delete();
			// this._ntf.open("imagen borrada del Storage", "toast.close");
		} catch (error) {
			this.errorHandler(error);
		}

	}

	private errorHandler(error: any) {
		this._ntf.open("toast.firebase." + error, "toast.close");
		console.log('error: ', error);
	}
}
