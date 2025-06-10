import { PhoneNumber } from './../../../../../../../node_modules/libphonenumber-js/custom.d';
import { CommonModule, NgIf } from '@angular/common';
import { Component, OnDestroy, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Subscription } from 'rxjs';

import { SharedModule } from 'src/app/shared/shared.module';
import { ListPipesModule } from 'src/app/core/pipes/list-pipes.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AdminsService } from '../admins.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AngularPhoneNumberInput } from 'angular-phone-number-input';
import { Notify } from 'notiflix';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SharedModule,
    ListPipesModule,
    MatProgressBarModule,
    AngularPhoneNumberInput,
  ],
  templateUrl: './create_admin.component.html',
  styleUrl: './create_admin.component.scss'
})
export class CreateAdminComponent implements OnDestroy {
  private formBuilder = inject(FormBuilder);
  private adminsService = inject(AdminsService);

  isUploading: boolean = false;
  imageUrl: string = '';

  isCreateTeam: boolean = false;

  clubCreateTeamSubscription!: Subscription;
  error: string | null = null;
  accountDetails: any;
  selectedFile: any;
  uploadProgress = 0;
  myForm!: FormGroup;
  isFormSubmitted: boolean = false;
  isFormValidToSubmitted: boolean = false;

  constructor(
    private _router: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder
  ) {}

  protected get registerFormControl() {
    return this.myForm.controls;
  }

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
          phoneNumber: ['', Validators.required],

    });

 
  }

  ngOnDestroy() {
    if (this.clubCreateTeamSubscription) {
      this.clubCreateTeamSubscription.unsubscribe();
    }
  }

  uploadImagetoStorage(event: any) {
    this.isUploading = true;

    this.selectedFile = (event.target as HTMLInputElement).files![0];

    let data = new FormData();
    data.append('file', this.selectedFile);

    this.adminsService.uploadFile(data).subscribe((res: any) => {
      if (res.type === HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round((100 * res.loaded) / res.total);
        if (this.uploadProgress == 100) {
          this.uploadProgress = 0;
        }
      } else if (res instanceof HttpResponse) {
        console.log('res.. dadad', res);

        Notify.success(res.body.message);

        console.log('res.body.', res.body);
        console.log('res.body.status', res.body.status);
        if (res.body.status == 'success') {
          this.imageUrl = res.body.url;
          this.isUploading = false;
        }
      }
    });
  }

  onFormSubmit() {
    if (this.imageUrl == '') {
      Notify.failure('Upload Profile image to proceed');
    } else {
      this.isFormSubmitted = true;

      if (!this.myForm.valid) {
        this.isFormSubmitted = false;
      }

      if (this.myForm.valid) {
        this.isFormValidToSubmitted = true;
        const email = this.myForm?.value.email;

        const fname = this.myForm?.value.first_name;
        const lname = this.myForm?.value.last_name;
        const imageUrl = this.imageUrl;
const phone_number= this.myForm?.value.phoneNumber;

   

        var data = {
          first_name: fname,
          last_name: lname,
          email: email,
          city_id: 0,
          image_url: imageUrl,
          password:'',
          phone_number:phone_number,
        };

        this.adminsService
          .createAdmin(data)
          .then((res: any) => {
            console.log(res);

            this.imageUrl = "";
            this.myForm.reset();
          })
          .catch((error) => {
            this.isFormSubmitted = false;
            this.isFormValidToSubmitted = false;
          });
      }
    }
  }
}
