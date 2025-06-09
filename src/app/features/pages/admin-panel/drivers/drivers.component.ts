import { CommonModule, NgIf } from '@angular/common';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
  
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Subscription } from 'rxjs';

import { DriverAcountsModel } from './drivers_data';
import { SessionStore } from 'src/app/core/helpers/session-store/session-store';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListPipesModule } from 'src/app/core/pipes/list-pipes.module';

@Component({
    selector: 'app-team',
    standalone: true,
    imports: [
        CommonModule,
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        RouterLink,
        SharedModule,
        ListPipesModule,
    ],
    templateUrl: './drivers.component.html',
    styleUrl: './drivers.component.scss',
})
export class DriversComponent implements OnDestroy {
    isUploading: boolean = false;

    private sessionStore = inject(SessionStore);

    isCreateTeam: boolean = false;

    clubCreateTeamSubscription!: Subscription;
    error: string | null = null;
    driversList: DriverAcountsModel[] = [];
    accountDetails: any;

   
    constructor(
        private _router: ActivatedRoute,
        private _formBuilder: UntypedFormBuilder
    ) {}


    ngOnInit(): void {
    

   

        this.getClubTeamsResolver();
    }

    ngOnDestroy() {
        if (this.clubCreateTeamSubscription) {
            this.clubCreateTeamSubscription.unsubscribe();
        }
    }

    getClubTeamsResolver(): void {
        this.clubCreateTeamSubscription = this._router.data.subscribe(
            (data: any) => {
                if (data.driversList) {
                    this.driversList = data.driversList;

                } else {
                    this.error = 'Failed to load data';
                }
            }
        );
    }
}
