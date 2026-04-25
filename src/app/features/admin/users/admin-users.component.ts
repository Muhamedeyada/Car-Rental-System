import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, debounceTime } from 'rxjs';
import { IUser } from '../../../core/models/i-user.model';
import { IPagination } from '../../../core/models/i-pagination.model';
import { AdminUserService } from '../../../core/services/admin-user.service';
import { ToastService } from '../../../core/services/toast.service';
import { AdminLayoutComponent } from '../../../shared/components/admin-layout/admin-layout.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { mapApiValidationErrorsToForm } from '../../../shared/utils/form-error-mapper';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [ReactiveFormsModule, AdminLayoutComponent, ConfirmDialogComponent, TranslatePipe],
  templateUrl: './admin-users.component.html',
})
export class AdminUsersComponent implements OnInit, OnDestroy {
  userList: IPagination<IUser> | null = null;
  isLoading = false;
  currentPage = 1;
  searchControl = new FormControl('');
  roleFilter = new FormControl('');
  modalMode: 'none' | 'create' | 'edit' = 'none';
  selectedUser: IUser | null = null;
  isFormSubmitting = false;
  showDeleteConfirm = false;
  userToDelete: IUser | null = null;
  userForm: FormGroup;
  private subscriptions = new Subscription();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly adminUserService: AdminUserService,
    private readonly toastService: ToastService
  ) {
    this.userForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        role: ['customer', [Validators.required]],
        phone: [''],
        country: [''],
        password: [''],
        password_confirmation: [''],
      },
      { validators: passwordMatchValidator('password', 'password_confirmation') }
    );
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.subscriptions.add(
      this.searchControl.valueChanges.pipe(debounceTime(400)).subscribe(() => {
        this.currentPage = 1;
        this.fetchUsers();
      })
    );
    this.subscriptions.add(
      this.roleFilter.valueChanges.subscribe(() => {
        this.currentPage = 1;
        this.fetchUsers();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.adminUserService
      .listUsers(this.currentPage, this.searchControl.value ?? '', this.roleFilter.value ?? '')
      .subscribe({
        next: result => {
          this.userList = result;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  openCreateModal(): void {
    this.userForm.reset({ role: 'customer' });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.userForm.get('password_confirmation')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('password_confirmation')?.updateValueAndValidity();
    this.selectedUser = null;
    this.modalMode = 'create';
  }

  openEditModal(user: IUser): void {
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password_confirmation')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.userForm.get('password_confirmation')?.updateValueAndValidity();
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone ?? '',
      country: user.country ?? '',
      password: '',
      password_confirmation: '',
    });
    this.selectedUser = user;
    this.modalMode = 'edit';
  }

  closeModal(): void {
    this.modalMode = 'none';
    this.selectedUser = null;
  }

  submitUserForm(): void {
    if (this.userForm.invalid || this.isFormSubmitting) return;
    this.isFormSubmitting = true;
    const formValue = { ...this.userForm.value };
    if (!formValue.password) {
      delete formValue.password;
      delete formValue.password_confirmation;
    }

    const request$ =
      this.modalMode === 'create'
        ? this.adminUserService.createUser(formValue)
        : this.adminUserService.updateUser(this.selectedUser!.id, formValue);

    request$.subscribe({
      next: () => {
        this.isFormSubmitting = false;
        this.toastService.showSuccess(
          this.modalMode === 'create' ? 'user_created_success' : 'user_updated_success'
        );
        this.closeModal();
        this.fetchUsers();
      },
      error: (error: HttpErrorResponse) => {
        this.isFormSubmitting = false;
        mapApiValidationErrorsToForm(this.userForm, error);
      },
    });
  }

  openDeleteConfirm(user: IUser): void {
    this.userToDelete = user;
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (!this.userToDelete) return;
    this.adminUserService.deleteUser(this.userToDelete.id).subscribe({
      next: () => {
        this.toastService.showSuccess('user_deleted_success');
        this.showDeleteConfirm = false;
        this.userToDelete = null;
        this.fetchUsers();
      },
      error: () => {
        this.showDeleteConfirm = false;
        this.userToDelete = null;
      },
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.fetchUsers();
  }

  get nameControl() { return this.userForm.get('name'); }
  get emailControl() { return this.userForm.get('email'); }
  get passwordControl() { return this.userForm.get('password'); }
  get passwordConfirmationControl() { return this.userForm.get('password_confirmation'); }
}
