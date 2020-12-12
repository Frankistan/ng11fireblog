import { Injectable } from '@angular/core';
import { getUser } from '@app/store/actions/auth.actions';
import { getAuthUser } from '@app/store/reducers/auth.reducer';
import { Store } from '@ngrx/store';
import { State } from '@store/reducers/app.reducer';
import { Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AppConfig {
    defaults: any = { "language": "es-ES", "darkTheme": false };
    darkTheme$: Observable<boolean>;

    constructor(private store: Store<State>,) {
        this.store.dispatch(getUser());
    }

    load() {
        this.store.select(getAuthUser)
            .pipe(
                filter(user => !!user),
                map(user => user.settings),
                tap(userSettings => {
                    let settings = { ...this.defaults, ...userSettings };

                    this.darkTheme$ = of(settings.darkTheme);
                }),
                tap(user => console.log('Ajustes de la APP cargados')),
            ).toPromise();



        return new Promise((resolve, reject) => {
            setTimeout(() => {


                resolve();
            }, 3000);
        });
    }
}

export function LoadConfig(params: AppConfig) {
    return () => params.load();
}
