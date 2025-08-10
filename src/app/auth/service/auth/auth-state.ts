// auth-state.ts
import { Injectable, computed, signal } from '@angular/core';
import { Userstorage } from '../storage/userstorage';

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  private userRole = signal<string | null>(Userstorage.getUserRole());
  private userId = signal<string | null>(Userstorage.getUser());

  readonly role = computed(() => this.userRole());
  readonly id = computed(() => this.userId());

  updateRole(): void {
    this.userRole.set(Userstorage.getUserRole());
  }

  updateId(): void {
    this.userId.set(Userstorage.getUser());
  }

  clear(): void {
    this.userRole.set(null);
    this.userId.set(null);
  }
}
