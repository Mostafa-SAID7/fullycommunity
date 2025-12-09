/**
 * Form utility functions
 */

/**
 * Mark all form controls as touched
 */
export function markFormGroupTouched(formGroup: any): void {
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    control?.markAsTouched();

    if (control && typeof control === 'object' && 'controls' in control) {
      markFormGroupTouched(control);
    }
  });
}

/**
 * Get all form errors
 */
export function getFormErrors(formGroup: any): { [key: string]: any } {
  const errors: { [key: string]: any } = {};

  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    if (control?.errors) {
      errors[key] = control.errors;
    }

    if (control && typeof control === 'object' && 'controls' in control) {
      const nestedErrors = getFormErrors(control);
      if (Object.keys(nestedErrors).length > 0) {
        errors[key] = nestedErrors;
      }
    }
  });

  return errors;
}

/**
 * Get first error message from form
 */
export function getFirstErrorMessage(formGroup: any): string | null {
  const errors = getFormErrors(formGroup);
  const firstKey = Object.keys(errors)[0];
  
  if (!firstKey) return null;
  
  const error = errors[firstKey];
  return getErrorMessage(firstKey, error);
}

/**
 * Convert form error to user-friendly message
 */
export function getErrorMessage(fieldName: string, error: any): string {
  const field = fieldName.replace(/([A-Z])/g, ' $1').toLowerCase();
  
  if (error.required) return `${field} is required`;
  if (error.email) return `${field} must be a valid email`;
  if (error.minlength) return `${field} must be at least ${error.minlength.requiredLength} characters`;
  if (error.maxlength) return `${field} must be no more than ${error.maxlength.requiredLength} characters`;
  if (error.min) return `${field} must be at least ${error.min.min}`;
  if (error.max) return `${field} must be no more than ${error.max.max}`;
  if (error.pattern) return `${field} format is invalid`;
  if (error.passwordMismatch) return 'Passwords do not match';
  
  return `${field} is invalid`;
}

/**
 * Reset form to initial state
 */
export function resetForm(formGroup: any, initialValue?: any): void {
  formGroup.reset(initialValue);
  formGroup.markAsPristine();
  formGroup.markAsUntouched();
}

/**
 * Check if form field has error and is touched
 */
export function hasFieldError(formGroup: any, fieldName: string): boolean {
  const control = formGroup.get(fieldName);
  return !!(control && control.invalid && (control.dirty || control.touched));
}

/**
 * Get field error message
 */
export function getFieldErrorMessage(formGroup: any, fieldName: string): string | null {
  const control = formGroup.get(fieldName);
  if (!control || !control.errors || (!control.dirty && !control.touched)) {
    return null;
  }
  
  return getErrorMessage(fieldName, control.errors);
}

/**
 * Trim all string values in form
 */
export function trimFormValues(formGroup: any): void {
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    
    if (control?.value && typeof control.value === 'string') {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
    
    if (control && typeof control === 'object' && 'controls' in control) {
      trimFormValues(control);
    }
  });
}

/**
 * Convert form value to FormData for file uploads
 */
export function formValueToFormData(value: any, formData = new FormData(), parentKey = ''): FormData {
  Object.keys(value).forEach(key => {
    const formKey = parentKey ? `${parentKey}[${key}]` : key;
    const val = value[key];
    
    if (val instanceof File) {
      formData.append(formKey, val);
    } else if (val instanceof FileList) {
      Array.from(val).forEach((file, index) => {
        formData.append(`${formKey}[${index}]`, file);
      });
    } else if (Array.isArray(val)) {
      val.forEach((item, index) => {
        if (typeof item === 'object' && !(item instanceof File)) {
          formValueToFormData(item, formData, `${formKey}[${index}]`);
        } else {
          formData.append(`${formKey}[${index}]`, item);
        }
      });
    } else if (typeof val === 'object' && val !== null) {
      formValueToFormData(val, formData, formKey);
    } else if (val !== null && val !== undefined) {
      formData.append(formKey, val.toString());
    }
  });
  
  return formData;
}

/**
 * Disable all form controls
 */
export function disableForm(formGroup: any): void {
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    control?.disable();
    
    if (control && typeof control === 'object' && 'controls' in control) {
      disableForm(control);
    }
  });
}

/**
 * Enable all form controls
 */
export function enableForm(formGroup: any): void {
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    control?.enable();
    
    if (control && typeof control === 'object' && 'controls' in control) {
      enableForm(control);
    }
  });
}
