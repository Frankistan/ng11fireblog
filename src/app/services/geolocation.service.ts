import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';

// How to Create Google Maps API KEY for Free
// https://www.youtube.com/watch?v=1JNwpp5L4vM

// Cannot find namespace 'google'
// https://stackoverflow.com/questions/42394697/angular2-cannot-find-namespace-google

// FUENTE: https://github.com/robisim74/angular-maps/blob/master/src/app/services/geolocation.service.ts

/**
 * GeolocationService class.
 * https://developers.google.com/maps/documentation/javascript/
 * https://dev.w3.org/geo/api/spec-source.html
 */
@Injectable({
	providedIn: 'root'
})
export class GeolocationService {
	private _position: any;

	constructor() { }

    /**
     * Tries HTML5 geolocation.
     *
     * Wraps the Geolocation API into an observable.
     *
     * @return An observable of Position
     */
	getCurrentPosition(): Observable<Position> {
		return Observable.create((observer: Observer<Position>) => {
			// Invokes getCurrentPosition method of Geolocation API.
			navigator.geolocation.getCurrentPosition(
				(position: Position) => {
					observer.next(position);
					observer.complete();
				},
				(error: PositionError) => {
					switch (error.code) {
						case 1:
							console.log("Permission Denied");
							break;
						case 2:
							console.log("Position Unavailable");
							break;
						case 3:
							console.log("Timeout");
							break;
					}
					console.log("Geolocation service: " + error.message);
					observer.error(error);
				}
			);
		});
	}

	set setPosition(coords) {
		this._position = {
			lat: coords.latitude,
			lng: coords.longitude
		};
	}

	get position(): any {
		return this._position;
	}
}
