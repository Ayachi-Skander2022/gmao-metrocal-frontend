import { Injectable, signal } from '@angular/core';

const TOKEN = 'token';
const USER = 'user';

@Injectable({
  providedIn: 'root'
})
export class Userstorage {
  // ✅ Signal pour le rôle utilisateur
  static userRoleSignal = signal<string | null>(Userstorage.getUserRole());

  static saveToken(token: string): void {
    localStorage.setItem(TOKEN, token);
  }

  static saveUser(user: any): void {
    localStorage.setItem(USER, JSON.stringify(user));
    // ✅ Met à jour le signal avec le nouveau rôle
    this.userRoleSignal.set(user?.role || null);
  }

  static getToken(): string | null {
    return localStorage.getItem(TOKEN);
  }



  static getUser(): any | null{

    const userJson = localStorage.getItem('user');
  if (!userJson) {
    return null;
  }

    try {
    return JSON.parse(userJson);
  } catch (e) {
    console.error('Invalid JSON in localStorage for key "user"', e);
    return null;
  }
   
  }


  static getTechniciens(): any[] {
  const usersJson = localStorage.getItem('users');
  if (!usersJson) {
    return [];
  }

  try {
    const users = JSON.parse(usersJson);
    return users.filter((u: any) => u.userRole === 'TECHNICIEN');
  } catch (e) {
    console.error('Invalid JSON in localStorage for key "users"', e);
    return [];
  }
}





  static getUserId(): string{
    const user = this.getUser();
    if(user==null){
      return '';
    }
    return user.id;
  }


  static geTechId(): string | any[] | undefined {
  const user = this.getUser();
  if (user == null) {
    try {
      const usersJson = localStorage.getItem('users'); // je suppose que c’est là que tu as le JSON
      if (!usersJson) return; // pas de données dans localStorage

      const users = JSON.parse(usersJson);
      // filtre les utilisateurs de rôle 'TECHNICIEN' et retourne le tableau
      return users.filter((u: any) => u.userRole === 'TECHNICIEN');
    } catch (e) {
      console.error('Invalid JSON in localStorage for key "users"', e);
      return;
    }
  }
  return user.id;
}





  static getUserRole(): string | null {
    const user = this.getUser();
    return user?.role || null;
  }

  static isAdminLoggedIn(): boolean {
    if (this.getToken() == null) return false;
    return this.getUserRole() === 'ADMIN';
  }

  static isClientLoggedIn(): boolean {
    if (this.getToken() == null) return false;
    return this.getUserRole() === 'CLIENT';
  }

  static isIntervenantLoggedIn(): boolean {
    if (this.getToken() == null) return false;
    return this.getUserRole() === 'TECHNICIEN';
  }

  

  static sigOut(): void {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
    // ✅ Vide le signal
    this.userRoleSignal.set(null);
  }
}
