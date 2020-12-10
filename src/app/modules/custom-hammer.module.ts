import { NgModule } from '@angular/core';
import { HammerModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

// custom configuration Hammerjs
@Injectable()
export class HammerConfig extends HammerGestureConfig {
    overrides = <any>{
        // I will only use the swap gesture so
        // I will deactivate the others to avoid overlaps
        'pinch': { enable: false },
        'rotate': { enable: false }
    }
}


@NgModule({
    declarations: [],
    imports: [
        HammerModule
    ],
    providers : [
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: HammerConfig
        }
    ]
})
export class CustomHammerModule { }
