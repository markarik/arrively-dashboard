import { CommonModule, NgIf, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
  
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Subscription } from 'rxjs';

import { SessionStore } from 'src/app/core/helpers/session-store/session-store';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListPipesModule } from 'src/app/core/pipes/list-pipes.module';
import { VehicleStyleModel } from './vehicle_types_data';

@Component({
    selector: 'app-vehicle-types',
    standalone: true,
    imports: [
        CommonModule,
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NgOptimizedImage,
        SharedModule,
        ListPipesModule,
    ],
    templateUrl: './vehicle_types.component.html',
    styleUrl: './vehicle_types.component.scss',
})
export class VehicleTypesComponent implements OnDestroy {
    // isUploading: boolean = false;

    // private sessionStore = inject(SessionStore);

    // isCreateTeam: boolean = false;

    clubCreateTeamSubscription!: Subscription;
    error: string | null = null;
    vehicleTypes: VehicleStyleModel[] = [];
    accountDetails: any;

   
    constructor(
        private _router: ActivatedRoute,
    ) {}


    ngOnInit(): void {
    

   

        this.getvehicleTypeResolver();
    }

    ngOnDestroy() {
        if (this.clubCreateTeamSubscription) {
            this.clubCreateTeamSubscription.unsubscribe();
        }
    }

    getvehicleTypeResolver(): void {
        this.clubCreateTeamSubscription = this._router.data.subscribe(
            (data: any) => {
                if (data.vehicleTypes) {
                    this.vehicleTypes = data.vehicleTypes;

                } else {
                    this.error = 'Failed to load data';
                }
            }
        );
    }

    editVehicleType(id: number): void {
        // Navigate to the edit page for the vehicle type
        // this._router.router.navigate(['/admin', 'vehicle-type', id, 'edit']);
        console.log(`Edit vehicle type with ID: ${id}`);
    }

    deleteVehicleType(id: number): void {
        // Implement the logic to delete the vehicle type
        // This could involve calling a service method to delete the item from the backend
        console.log(`Delete vehicle type with ID: ${id}`);
        // After deletion, you might want to refresh the list or navigate away
    }
}
