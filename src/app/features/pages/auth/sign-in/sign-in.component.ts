// angular import
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Notify } from 'notiflix';
import { AuthService } from 'src/app/core/services/auth/auth.service';

// project import
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule,  
    ReactiveFormsModule,],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent {

  private formBuilder= inject(FormBuilder);
  private authService= inject(AuthService);
  private _router= inject(Router);
      currentRoute: string = '/analytics';

  myForm!: FormGroup;
  
  isFormSubmitted: boolean = false;
  isFormValidToSubmitted: boolean = false;

  showPassword: boolean = false;


  constructor(
  

  ) {}

  ngOnInit(): void {
  
      this.myForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, ]],
      });
  
  }

  protected get registerFormControl() {
    return this.myForm.controls;
  }

  ngOnDestroy() {
      // this.getBusinessTypesSubscription.unsubscribe();
    
  }



  onFormSubmit() {
    this.isFormSubmitted = true;
   

    if (!this.myForm.valid) {
      this.isFormSubmitted = false;

    }

      if (this.myForm.valid) {
        this.isFormValidToSubmitted = true;
        const email = this.myForm?.value.email;

        const password = this.myForm?.value.password;

        // vahyzuw@mailinator.com
        this.loginMethod(email, password);
      
    } 
  }
  loginMethod(email: string, password: string) {
    this.authService
      .signIn(email, password)
      .then((res: any) => {

        console.log('Login successful:', res);

        if (res.status === 'success') {
          this.isFormSubmitted = false;
          this.isFormValidToSubmitted = true;

       
                this.getUserProfile();


          
        }

     


      })
      .catch((error) => {
        this.isFormSubmitted = false;
        this.isFormValidToSubmitted = false;


      });
  }



    getUserProfile() {
    this.authService
      .getProfileDetails()
      .then((res: any) => {

        console.log('Login successful data:', res);

    
            Notify.success('Logged In Successfully'),
                    setTimeout(() => {
                        this._router.navigate([this.currentRoute]);
                    }, 1000);

           
          
        




      })
      .catch((error) => {
        this.isFormSubmitted = false;
        this.isFormValidToSubmitted = false;


      });
  }




}

