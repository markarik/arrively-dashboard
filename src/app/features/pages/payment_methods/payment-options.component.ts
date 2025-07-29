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
    FileUpload
  ],
  templateUrl: './payment-options.component.html',
  styleUrl: './payment-options.component.scss'
})
export class PaymentOptionsComponent implements OnDestroy {
  visible2: boolean = false;
  formSubmitted: boolean = false;

  clubCreateTeamSubscription!: Subscription;
  error: string | null = null;
  paymentOptions: AdminPaymentOptionsModel[] = [];
  accountDetails: any;
  isLoading: boolean = false;
  successMessage: string | null = null;

  private formBuilder = inject(FormBuilder);
  private paymentOptionsService = inject(PaymentOptionsService);

  isUploading: boolean = false;
  imageUrl: string = '';

  selectedFile: any;
  uploadProgress = 0;
  myForm!: FormGroup;
  isFormSubmitted: boolean = false;
  isFormValidToSubmitted: boolean = false;

  usedPlartforms!: PlartfomsUsed[];

  selectedCity!: PlartfomsUsed;

  selectedFileName: string | null = 'No file chosen'; // Track selected file name

  constructor(private _router: ActivatedRoute) {
    this.usedPlartforms = [
      { name: 'Android', code: 'android' },
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

  addPaymentMode(): void {
    // Implement the logic to add a new payment mode
    console.log('Add new payment mode');
    this.visible2 = true;
    // This could involve opening a dialog or navigating to a form page
  }

  onFormSubmit(): void {
    // Implement the logic to handle form submission
    console.log('Form submitted');
    // This could involve calling a service to save the data

    this.isFormSubmitted = true;
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      console.log('Form Value:', this.myForm.value);
      const formData = new FormData();
      formData.append('paymode', this.myForm.get('paymode')?.value);
      formData.append('redirect_url', this.myForm.get('redirect_url')?.value);
      formData.append('require_redirect', this.myForm.get('require_redirect')?.value);
    //   formData.append('supported_platforms', JSON.stringify(this.myForm.get('supported_platforms')?.value));

      const platforms = this.myForm.get('supported_platforms')?.value || [];
      const platformCodes = platforms.map((p: any) => p.code);
      formData.append('supported_platforms', JSON.stringify(platformCodes));

      formData.append('file', this.myForm.get('uploadedFile')?.value);

      // console.log('FormData for server:', formData);

      // for (const pair of (formData as any).entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      this.isFormValidToSubmitted = true;

      this.paymentOptionsService.addPaymentOption(formData).subscribe({
        next: (res: any) => {
          console.log('Payment option added successfully:', res);
          this.visible2 = false; // Close drawer
          this.myForm.reset({ require_redirect: false, supported_platforms: [] });
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
}
