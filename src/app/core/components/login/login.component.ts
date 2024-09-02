import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { catchError, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card'; 
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule} from '@angular/material/input';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ 
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormField,
    MatLabel,
    MatError,
   ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  formLogin?: FormGroup;
  showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm(): void {
    this.formLogin = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login(): void {
    if (this.formLogin?.invalid) {
      return;
    }

    const login: string = this.formLogin?.controls['login'].value;
    const password: string = this.formLogin?.controls['password'].value;

    this.authService.login(login, password).pipe(
      tap((response: any) => {
        this.router.navigate(["/products"])
      }),
      catchError((error: any) => {
        this.errorDialog('Erro', 'Um erro aconteceu ao tentar fazer login. Verifique as credenciais e tente novamente.')
        throw error;
      })
    ).subscribe();
  }

  changeShowPasswordValue(): void {
    this.showPassword = !this.showPassword;
  }

  errorDialog(title: string, message: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonText: 'Ok',
      customClass: {
        container: 'swal-custom', 
        popup: 'swal-custom',
        title: 'swal-custom', 
        content: 'swal-custom', 
        confirmButton: 'swal-custom',
        cancelButton: 'swal-custom'
      }
    });
  }
}
