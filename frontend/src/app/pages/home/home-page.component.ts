import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AuthGuard} from "../../shared/guards/auth.guard";

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
})

export class HomePageComponent implements OnInit, OnChanges {
    _name = 'firstname';

    @Input()
    prop : string;

    constructor(public auth: AuthGuard) {
    }

    ngOnInit() {
        console.info("on init home-page");
        console.info(`name is: ${this._name}`)
    }

    ngOnChanges(changes: SimpleChanges): void {
      console.log(changes.prop);
      this._name = changes.prop.currentValue
    }
}
