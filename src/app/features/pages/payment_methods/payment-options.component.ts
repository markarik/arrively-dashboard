import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CheckboxModule } from 'primeng/checkbox';
import { DrawerModule } from 'primeng/drawer';
import { FileUpload, FileUploadHandlerEvent } from 'primeng/fileupload';
import { ListboxModule } from 'primeng/listbox';
import { ListPipesModule } from 'src/app/core/pipes/list-pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminPaymentOptionsModel, PlartfomsUsed } from './payment-options-data';
import { PaymentOptionsService } from './payment-options.service';
import { DialogModule } from 'primeng/dialog';
import { AdminsModel } from '../admins/admins_data';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-payment-options',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgOptimizedImage,
    SharedModule,
    ListPipesModule,
    DrawerModule,
    MatProgressBarModule,
    CheckboxModule,
    ListboxModule,
    FileUpload,
    DialogModule,
    ConfirmPopupModule
  ],
  templateUrl: './payment-options.component.html',
  styleUrl: './payment-options.component.scss',
  providers: [ConfirmationService]
})
export class PaymentOptionsComponent implements OnDestroy {
  showAddPaymentModeDrawer: boolean = false;
  formSubmitted: boolean = false;
  visibleCreater: boolean = false;
  showEditPaymentModeDrawer: boolean = false;

  clubCreateTeamSubscription!: Subscription;
  error: string | null = null;
  paymentOptions: AdminPaymentOptionsModel[] = [];
  accountDetails: any;
  isLoading: boolean = false;
  successMessage: string | null = null;

  private formBuilder = inject(FormBuilder);
  private paymentOptionsService = inject(PaymentOptionsService);
  private confirmationService = inject(ConfirmationService);

  isUploading: boolean = false;
  imageUrl: string = '';

  selectedFile: any;
  uploadProgress = 0;
  myForm!: FormGroup;

  myFormEdit!: FormGroup;

  isFormSubmitted: boolean = false;
  isFormValidToSubmitted: boolean = false;

  usedPlartforms!: PlartfomsUsed[];

  usedPlartformsEdit!: PlartfomsUsed[];

  selectedCity!: PlartfomsUsed;

  selectedFileName: string | null = 'No file chosen';

  adminDetails!: AdminsModel;

  selectedItemToEdit!: AdminPaymentOptionsModel;

  constructor(private _router: ActivatedRoute) {
    this.usedPlartforms = [
      { name: 'ANDROID', code: 'android' },
      { name: 'IOS', code: 'ios' }
    ];
    this.myForm = this.formBuilder.group({
      paymode: ['', [Validators.required]],
      redirect_url: ['', [this.slashPrefixValidator()]],
      require_redirect: [false],
      supported_platforms: [this.usedPlartforms, [Validators.required]],
      uploadedFile: [null, [Validators.required]]
    });
  }

  protected get registerFormControl() {
    return this.myForm.controls;
  }

  ngOnInit(): void {
    this.getvehicleTypeResolver();
    this.subscribeToServiceUpdates();

    this.myForm.get('require_redirect')?.valueChanges.subscribe((value) => {
      const redirectUrlControl = this.myForm.get('redirect_url');
      if (value) {
        redirectUrlControl?.setValidators([Validators.required]);
      } else {
        redirectUrlControl?.clearValidators();
      }
      redirectUrlControl?.updateValueAndValidity();
    });

    // Automatically prepend slash if missing
    this.myForm.get('redirect_url')?.valueChanges.subscribe((value) => {
      if (value && !value.startsWith('/')) {
        this.myForm.get('redirect_url')?.setValue(`/${value}`, { emitEvent: false });
      }
    });
  }

  ngOnDestroy() {
    if (this.clubCreateTeamSubscription) {
      this.clubCreateTeamSubscription.unsubscribe();
    }
  }

  getvehicleTypeResolver(): void {
    this.isLoading = true;
    this.clubCreateTeamSubscription = this._router.data.subscribe((data: any) => {
      if (data.paymentOptions) {
        this.paymentOptions = data.paymentOptions;
        this.isLoading = false;
      } else {
        this.error = 'Failed to load data';
        this.isLoading = false;
      }
    });
  }

  // Subscribe to service updates for real-time data
  subscribeToServiceUpdates(): void {
    this.clubCreateTeamSubscription = this.paymentOptionsService.plans$.subscribe({
      next: (data) => {
        this.paymentOptions = data;
        this.error = null;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load payment options';
        this.isLoading = false;
        console.error('Error loading payment options:', error);
      }
    });
  }

  // Manual refresh method (can be called from UI if needed)
  refreshPaymentOptions(): void {
    this.isLoading = true;
    this.error = null;
    this.paymentOptionsService.refreshPaymentOptions();
  }

  editPaymentMode(selectedItem: AdminPaymentOptionsModel, event: Event): void {
    this.selectedItemToEdit = selectedItem;

    this.usedPlartformsEdit = selectedItem.supported_platforms!.map((platformCode: string) => {
      const platform = this.usedPlartforms.find((p) => p.code === platformCode);
      return {
        name: platform?.name || platformCode.toUpperCase(),
        code: platform?.code || platformCode
      };
    });


    this.myFormEdit = this.formBuilder.group({
      paymode: [selectedItem.pay_method, [Validators.required]],
      redirect_url: [selectedItem.redirect_url, [this.slashPrefixValidator()]],
      require_redirect: [selectedItem.require_redirect],
      supported_platforms: [this.usedPlartformsEdit, [Validators.required]]
    });

    this.myFormEdit.get('require_redirect')?.valueChanges.subscribe((value) => {
      const redirectUrlControl = this.myFormEdit.get('redirect_url');
      if (value) {
        redirectUrlControl?.setValidators([Validators.required]);
      } else {
        redirectUrlControl?.clearValidators();
      }
      redirectUrlControl?.updateValueAndValidity();
    });

    // Automatically prepend slash if missing
    this.myFormEdit.get('redirect_url')?.valueChanges.subscribe((value) => {
      if (value && !value.startsWith('/')) {
        this.myFormEdit.get('redirect_url')?.setValue(`/${value}`, { emitEvent: false });
      }
    });
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: `Do you want to  edit this record?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Edit',
        severity: 'success'
      },
      accept: () => {
        this.showEditPaymentModeDrawer = true;
      },
      reject: () => {}
    });
  }

  changeItemStateConfirm(selectedItem: AdminPaymentOptionsModel, event: Event): void {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      message: `Do you want to ${selectedItem.is_active ? 'delete' : 'activate'} this record?`,
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: selectedItem.is_active ? 'Delete' : 'Activate',
        severity: selectedItem.is_active ? 'danger' : 'success'
      },
      accept: () => {
        this.changeItemState(selectedItem.id!);
      },
      reject: () => {}
    });
  }

  addPaymentMode(): void {
    this.showAddPaymentModeDrawer = true;
  }

  onFormSubmit(): void {
    this.isFormSubmitted = true;
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      const formData = new FormData();
      formData.append('paymode', this.myForm.get('paymode')?.value);
      formData.append('redirect_url', this.myForm.get('redirect_url')?.value);
      formData.append('require_redirect', this.myForm.get('require_redirect')?.value);

      const platforms = this.myForm.get('supported_platforms')?.value || [];
      const platformCodes = platforms.map((p: any) => p.code);
      formData.append('supported_platforms', JSON.stringify(platformCodes));

      formData.append('file', this.myForm.get('uploadedFile')?.value);

      this.isFormValidToSubmitted = true;

      this.paymentOptionsService.addPaymentOption(formData).subscribe({
        next: (res: any) => {
          this.showAddPaymentModeDrawer = false; // Close drawer
          this.myForm.reset({ require_redirect: false, supported_platforms: this.usedPlartforms });
          this.selectedFileName = 'No file chosen';
          this.isFormValidToSubmitted = false;
          this.isFormSubmitted = false;
          this.successMessage = 'Payment option added successfully!';
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error: any) => {
          console.error('Error adding payment option:', error);
          this.isFormSubmitted = false;
          this.isFormValidToSubmitted = false;
        }
      });
    }
  }




  onFormSubmitEdit(): void {
    this.isFormSubmitted = true;
    this.myFormEdit.markAllAsTouched();
    if (this.myFormEdit.valid) {
      const formData = new FormData();
      formData.append('paymode', this.myFormEdit.get('paymode')?.value);
      formData.append('redirect_url', this.myFormEdit.get('redirect_url')?.value);
      formData.append('require_redirect', this.myFormEdit.get('require_redirect')?.value);

      formData.append('pay_mode_id', this.selectedItemToEdit.id!.toString());


      const platforms = this.myFormEdit.get('supported_platforms')?.value || [];
      const platformCodes = platforms.map((p: any) => p.code);
      formData.append('supported_platforms', JSON.stringify(platformCodes));


      this.isFormValidToSubmitted = true;

      this.paymentOptionsService.editPaymentOption(formData).subscribe({
        next: (res: any) => {
          this.showAddPaymentModeDrawer = false; // Close drawer
          this.myForm.reset({ require_redirect: false, supported_platforms: this.usedPlartforms });
          this.isFormValidToSubmitted = false;
          this.isFormSubmitted = false;
          this.successMessage = 'Payment option updated successfully!';
          // Clear success message after 3 seconds
          setTimeout(() => {
            this.successMessage = null;
          }, 3000);
        },
        error: (error: any) => {
          console.error('Error updating payment option:', error);
          this.isFormSubmitted = false;
          this.isFormValidToSubmitted = false;
        }
      });
    }
  }

  changeItemState(selctedItemId: number): void {
    this.paymentOptionsService.changePaymentOptionState(selctedItemId).subscribe({
      next: (res: any) => {
        this.successMessage = 'Payment option state changed successfully!';
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error: any) => {
        console.error('Error changing payment option state:', error);
      }
    });
  }

  isInvalid(controlName: string) {
    const control = this.myForm.get(controlName);
    return control?.invalid && this.formSubmitted;
  }

  onUpload(event: FileUploadHandlerEvent) {
    const file = event.files[0];
    this.myForm.get('uploadedFile')?.setValue(file);
    this.selectedFileName = file ? file.name : 'No file chosen';
    console.log('Uploaded file:', file);
  }

  slashPrefixValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value && !value.startsWith('/')) {
        return { slashPrefix: true };
      }
      return null;
    };
  }

  showWhoCreatedMode(selctedItem: AdminPaymentOptionsModel): void {
    this.visibleCreater = true;
    this.adminDetails = selctedItem.admin!;
  }
}

// am having an issue with supported_platforms, the user has a list of strings, which should appear as selcted on the UI, also we need to see all the items
