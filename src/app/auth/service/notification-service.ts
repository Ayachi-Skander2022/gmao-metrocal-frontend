import { Injectable, Signal, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  adminNotification = signal(this.getStoredAdminNotification());

  // ---------------- ADMIN ----------------

  incrementAdmin() {
    const current = this.adminNotification();
    const updated = current + 1;
    this.adminNotification.set(updated);
    sessionStorage.setItem('adminNotification', updated.toString());
  }

  decrementAdmin() {
    const current = this.adminNotification();
    const updated = current > 0 ? current - 1 : 0;
    this.adminNotification.set(updated);
    sessionStorage.setItem('adminNotification', updated.toString());
  }

  resetAdmin() {
    this.adminNotification.set(0);
    sessionStorage.removeItem('adminNotification');
  }

  private getStoredAdminNotification(): number {
    const value = sessionStorage.getItem('adminNotification');
    return value ? +value : 0;
  }

 // Map pour les notifications par technicien
   technicienNotificationMap = new Map<number, WritableSignal<number>>();


getTechnicienSignal(id: number): WritableSignal<number> {
  if (!this.technicienNotificationMap.has(id)) {
    this.technicienNotificationMap.set(id, signal(0));
  }
  return this.technicienNotificationMap.get(id)!;
}


  // Incrémente la notification d’un technicien spécifique
 notifyTechnicien(id: number): void {
  const signal = this.getTechnicienSignal(id);
  signal.update(count => {
    const newCount = count + 1;
    console.log(`Notification for tech ${id} updated from ${count} to ${newCount}`);
    return newCount;
  });
}


  // Décrémente la notification d’un technicien spécifique
  decrementTechnicien(id: number): void {
    this.getTechnicienSignal(id).update(count => Math.max(count - 1, 0));
  }

  // Réinitialise la notification d’un technicien spécifique
  resetTechnicien(id: number): void {
    this.getTechnicienSignal(id).set(0);
  }

  // Optionnel : sauvegarder/restaurer depuis sessionStorage si tu veux persister
  getStoredTechnicienNotification(id: number): number {
    const value = sessionStorage.getItem(`technicienNotification_${id}`);
    return value ? +value : 0;
  }

  persistTechnicienNotification(id: number): void {
    const count = this.getTechnicienSignal(id)();
    sessionStorage.setItem(`technicienNotification_${id}`, count.toString());
  }


  testNotify(id: number): void {
  console.log('Test notify technicien:', id);
  this.notifyTechnicien(id);
}






}
