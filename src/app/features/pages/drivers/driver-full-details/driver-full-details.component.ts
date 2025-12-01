import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DriverFullDetailsModel } from './driver_details';
import { SessionStore } from 'src/app/core/helpers/session-store/session-store';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ListPipesModule } from 'src/app/core/pipes/list-pipes.module';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DriverFullDetailsService } from './driver-full-details.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ListPipesModule, ConfirmPopupModule, ButtonModule, DialogModule],
  templateUrl: './driver-full-details.component.html',
  styleUrl: './driver-full-details.component.scss',
  providers: [ConfirmationService]
})
export class DriversFullDetailsComponent implements OnInit, OnDestroy {
  private sessionStore = inject(SessionStore);
  private _router = inject(ActivatedRoute);
  private confirmationService = inject(ConfirmationService);
  private breadcrumbService = inject(BreadcrumbService);
  private driverFullDetailsService = inject(DriverFullDetailsService);
  private formBuilder = inject(FormBuilder);

  myForm!: FormGroup;

  driverDetails: DriverFullDetailsModel | undefined;
  clubCreateTeamSubscription!: Subscription;
  teamMembersSubscription!: Subscription;

  error: string | null = null;

  visible: boolean = false;
  isFormSubmitted: boolean = false;

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      reason: ['', [Validators.required]]
    });

    this.getClubTeamdetailsResolver();
  }


  protected get registerFormControl() {
    return this.myForm.controls;
  }

  ngOnDestroy() {
    if (this.clubCreateTeamSubscription) {
      this.clubCreateTeamSubscription.unsubscribe();
    }
  }
  getClubTeamdetailsResolver(): void {
    this.clubCreateTeamSubscription = this._router.data.subscribe((data: any) => {
      if (data.driverDetails) {
        this.driverDetails = data.driverDetails;

        this.breadcrumbService.set('@mentorName', `${this.driverDetails!.profile!.first_name}`);

        //   this.isLoading = false;
      } else {
        this.error = 'Failed to load data';
      }
    });
  }

  // Helper to format languages as a string
  getLanguages(languages: string[] | null): string {
    return languages?.join(', ') || 'N/A';
  }

  confirm1(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Make Sure You Have had a look at the vehicle documents',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
       
      },
      acceptButtonProps: {
        label: 'Approve',
         severity: 'secondary',
        outlined: true
      },
      accept: () => {
        this.acceptVehicle();
      },
      reject: () => {
      }
    });
  }


    rejectUser(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Be Very Sure you have a good reason to burn this vehicle',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Cancel',
     
      },
      acceptButtonProps: {
      label: 'Proceed',
        severity: 'danger',
        outlined: true      },
     

            accept: () => {
        this.showDialog();
      },
      reject: () => {
      }
    });
  }


 

  showDialog() {
    this.visible = true;
  }

  acceptVehicle() {
    var data = {
      is_verified: true

      };

    this.verify(data, this.driverDetails?.vehicle?.id);
  }

  onFormSubmit() {
        this.isFormSubmitted = true;


    if (!this.myForm.valid) {
      this.isFormSubmitted = false;

    }

    if (this.myForm.valid) {
      const reason = this.myForm?.value.reason;

      var data = {
        is_verified: false,
        disapproval_reason: reason
      };
    this.visible = false;

      this.verify(data, this.driverDetails?.vehicle?.id);
    }
  }

  verify(data: any, vehicleId: any) {
    this.driverFullDetailsService
      .verifyVehicle(data, vehicleId)
      .then((res: any) => {
    this.isFormSubmitted = false;

        window.location.reload();
      })
      .catch((error) => {});
  }
}
