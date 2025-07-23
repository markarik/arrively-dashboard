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

import { SharedModule } from 'src/app/shared/shared.module';
import { ListPipesModule } from 'src/app/core/pipes/list-pipes.module';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

import { AvatarModule } from 'primeng/avatar';
import { AdminsModel } from './admins_data';

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
        DrawerModule, ButtonModule,AvatarModule,
        SharedModule,
        ListPipesModule,
        NgOptimizedImage,
    ],
    templateUrl: './admins.component.html',
    styleUrl: './admins.component.scss',
})
export class AdminsComponent implements OnDestroy {
    isUploading: boolean = false;
    isDrawerVisible: boolean = false;




    adminsSubscription!: Subscription;
    error: string | null = null;
    adminsList: AdminsModel[] = [];
    selectedAdmin: AdminsModel = {};


   
    constructor(
        private _router: ActivatedRoute,
    ) {}


    ngOnInit(): void {
    

   

        this.getAdminsResolver();
    }

    ngOnDestroy() {
        if (this.adminsSubscription) {
            this.adminsSubscription.unsubscribe();
        }
    }

    getAdminsResolver(): void {
        this.adminsSubscription = this._router.data.subscribe(
            (data: any) => {
                if (data.adminsList) {
                    this.adminsList = data.adminsList;

                } else {
                    this.error = 'Failed to load data';
                }
            }
        );
    }

    selectedDetails(selectedItem:AdminsModel){
        this.isDrawerVisible = true;

        this.selectedAdmin = selectedItem;
    }
}
