import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { BrandLogoComponent } from '../../../shared/components/brand-logo/brand-logo.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, BrandLogoComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  // Toggle between login and register
  isRegisterMode = signal(false);
  
  // Login form
  loginEmail = '';
  loginPassword = '';
  
  // Register form
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  registerFirstName = '';
  registerLastName = '';
  
  // State
  loading = signal(false);
  error = signal<string | null>(null);
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  toggleMode() {
    this.isRegisterMode.update(v => !v);
    this.error.set(null);
    this.clearForms();
  }

  clearForms() {
    this.loginEmail = '';
    this.loginPassword = '';
    this.registerEmail = '';
    this.registerPassword = '';
    this.registerConfirmPassword = '';
    this.registerFirstName = '';
    this.registerLastName = '';
  }

  onLoginSubmit() {
    if (!this.loginEmail || !this.loginPassword) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Login failed. Please check your credentials.');
      }
    });
  }

  onRegisterSubmit() {
    // Validation
    if (!this.registerEmail || !this.registerPassword || !this.registerFirstName || !this.registerLastName) {
      this.error.set('Please fill in all required fields');
      return;
    }

    if (this.registerPassword.length < 6) {
      this.error.set('Password must be at least 6 characters long');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.authService.register({
      email: this.registerEmail,
      password: this.registerPassword,
      firstName: this.registerFirstName,
      lastName: this.registerLastName
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Registration failed. Please try again.');
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update(v => !v);
  }

  loginWithGoogle() {
    this.loading.set(true);
    this.error.set(null);

    const clientId = environment.googleClientId;
    const redirectUri = window.location.origin;
    
    // Use OAuth 2.0 popup flow
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=token id_token&` +
      `scope=openid email profile&` +
      `nonce=${Date.now()}`;

    // Open popup window
    const width = 500;
    const height = 600;
    const left = (screen.width / 2) - (width / 2);
    const top = (screen.height / 2) - (height / 2);
    
    const popup = window.open(
      authUrl,
      'Google Sign-In',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
    );

    if (!popup) {
      this.loading.set(false);
      this.error.set('Please allow popups for this site to use Google Sign-In.');
      return;
    }

    // Listen for the OAuth callback
    const checkPopup = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(checkPopup);
          this.loading.set(false);
          return;
        }

        // Check if popup has navigated to our redirect URI
        if (popup.location.href.indexOf(redirectUri) === 0) {
          clearInterval(checkPopup);
          
          // Extract token from URL hash
          const hash = popup.location.hash.substring(1);
          const params = new URLSearchParams(hash);
          const idToken = params.get('id_token');
          
          popup.close();

          if (idToken) {
            this.handleGoogleCallback({ credential: idToken });
          } else {
            this.loading.set(false);
            this.error.set('Failed to get Google authentication token.');
          }
        }
      } catch (e) {
        // Cross-origin error - popup is still on Google's domain
      }
    }, 500);

    // Timeout after 5 minutes
    setTimeout(() => {
      if (!popup.closed) {
        clearInterval(checkPopup);
        popup.close();
        this.loading.set(false);
        this.error.set('Google Sign-In timed out. Please try again.');
      }
    }, 300000);
  }

  private handleGoogleCallback(response: any) {
    try {
      console.log('Google callback received:', response);
      
      // Decode JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      console.log('Google user payload:', payload);
      
      this.authService.externalLogin({
        provider: 'Google',
        providerKey: payload.sub,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name
      }).subscribe({
        next: (res) => {
          console.log('Google login successful:', res);
          this.loading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Google login error:', err);
          this.loading.set(false);
          this.error.set(err.error?.message || 'Google login failed. Please try again.');
        }
      });
    } catch (error) {
      console.error('Failed to process Google response:', error);
      this.loading.set(false);
      this.error.set('Failed to process Google login response.');
    }
  }

  loginWithFacebook() {
    this.loading.set(true);
    this.error.set(null);

    const appId = environment.facebookAppId;

    // Check if Facebook SDK is loaded
    if (typeof (window as any).FB === 'undefined') {
      // Load Facebook SDK
      (window as any).fbAsyncInit = () => {
        (window as any).FB.init({
          appId: appId,
          cookie: true,
          xfbml: true,
          version: 'v18.0'
        });
        this.initiateFacebookLogin();
      };

      // Load the SDK script
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        this.loading.set(false);
        this.error.set('Failed to load Facebook SDK. Please check your internet connection.');
      };
      document.body.appendChild(script);
    } else {
      // SDK already loaded
      this.initiateFacebookLogin();
    }
  }

  private initiateFacebookLogin() {
    (window as any).FB.login((response: any) => {
      console.log('Facebook login response:', response);
      
      if (response.authResponse) {
        console.log('Facebook auth successful, fetching user info...');
        
        // Get user info from Facebook
        (window as any).FB.api('/me', { fields: 'id,email,first_name,last_name' }, (userInfo: any) => {
          console.log('Facebook user info:', userInfo);
          
          if (!userInfo.email) {
            this.loading.set(false);
            this.error.set('Facebook login requires email permission. Please try again and grant email access.');
            return;
          }

          // Call backend with Facebook user info
          this.authService.externalLogin({
            provider: 'Facebook',
            providerKey: userInfo.id,
            email: userInfo.email,
            firstName: userInfo.first_name || '',
            lastName: userInfo.last_name || ''
          }).subscribe({
            next: (res) => {
              console.log('Facebook login successful:', res);
              this.loading.set(false);
              this.router.navigate(['/']);
            },
            error: (err) => {
              console.error('Facebook login error:', err);
              this.loading.set(false);
              this.error.set(err.error?.message || 'Facebook login failed. Please try again.');
            }
          });
        });
      } else {
        console.log('Facebook login cancelled or failed');
        this.loading.set(false);
        // Don't show error if user just cancelled
        if (response.status !== 'unknown') {
          this.error.set('Facebook login was cancelled.');
        }
      }
    }, { 
      scope: 'public_profile,email',
      return_scopes: true
    });
  }
}
