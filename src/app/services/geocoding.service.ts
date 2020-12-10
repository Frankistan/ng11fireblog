import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';


// How to Create Google Maps API KEY for Free
// https://www.youtube.com/watch?v=1JNwpp5L4vM

// Cannot find namespace 'google'
// https://stackoverflow.com/questions/42394697/angular2-cannot-find-namespace-google

// FUENTE: https://github.com/robisim74/angular-maps/blob/master/src/app/services/geocoding.service.ts

/**
 * GeocodingService class.
 * https://developers.google.com/maps/documentation/javascript/
 */
@Injectable({
	providedIn: 'root'
})
export class GeocodingService {
	geocoder: google.maps.Geocoder;

	constructor() {
		// this.geocoder = new google.maps.Geocoder();
	}

    /**
     * Reverse geocoding by location.
     *
     * Wraps the Google Maps API geocoding service into an observable.
     *
     * @param latLng Location
     * @return An observable of GeocoderResult
     */
	geocode(
		latLng: google.maps.LatLng
		// ): Observable<google.maps.GeocoderResult[]> {
	): Observable<string> {
		return Observable.create(
			// (observer: Observer<google.maps.GeocoderResult[]>) => {
			(observer: Observer<string>) => {
				// Invokes geocode method of Google Maps API geocoding.
				observer.next("rua brasil, 58");
				observer.complete();
				// this.geocoder.geocode(
				// 	{ location: latLng },
				// 	(
				// 		results: google.maps.GeocoderResult[],
				// 		status: google.maps.GeocoderStatus
				// 	) => {
				// 		if (status === google.maps.GeocoderStatus.OK) {
				// 			let address: string = results[1].formatted_address;
				// 			observer.next(address);
				// 			observer.complete();
				// 		} else {
				// 			console.log(
				// 				"Geocoding service: geocoder failed due to: " +
				// 				status
				// 			);
				// 			observer.error(status);
				// 		}
				// 	}
				// );
			}
		);
	}

    /**
     * Geocoding service.
     *
     * Wraps the Google Maps API geocoding service into an observable.
     *
     * @param address The address to be searched
     * @return An observable of GeocoderResult
     */
	codeAddress(address: string): Observable<google.maps.GeocoderResult[]> {
		return Observable.create(
			(observer: Observer<google.maps.GeocoderResult[]>) => {
				// Invokes geocode method of Google Maps API geocoding.
				this.geocoder.geocode(
					{ address: address },
					(
						results: google.maps.GeocoderResult[],
						status: google.maps.GeocoderStatus
					) => {
						if (status === google.maps.GeocoderStatus.OK) {
							observer.next(results);
							observer.complete();
						} else {
							console.log(
								"Geocoding service: geocode was not successful for the following reason: " +
								status
							);
							observer.error(status);
						}
					}
				);
			}
		);
	}
}
