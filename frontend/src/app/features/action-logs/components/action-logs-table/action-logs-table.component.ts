import { Component, input } from '@angular/core';
import { ActionLog } from '../../interfaces/action-log.interface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-action-logs-table',
  imports: [DatePipe],
  templateUrl: './action-logs-table.component.html',
})
export class ActionLogsTableComponent {
  readonly actionLogs = input.required<ActionLog[]>();

  getActionLabel(action: string): string {
    const labels: Record<string, string> = {
      product_created: 'Producto creado',
      product_updated: 'Producto actualizado',
      product_deleted: 'Producto eliminado',
      product_toggled: 'Producto activado/desactivado',
      stock_added: 'Stock añadido',
      stock_removed: 'Stock retirado',
      favourited: 'Añadido a favoritos',
      unfavourited: 'Quitado de favoritos',
      user_created: 'Usuario creado',
      user_login: 'Inicio de sesión',
      user_logout: 'Cierre de sesión',
      user_updated: 'Usuario actualizado',
      user_deactivated: 'Usuario desactivado',
      password_changed: 'Contraseña cambiada',
      transaction_created: 'Transacción creada',
      transaction_deleted: 'Transacción eliminada',
      cart_item_added: 'Producto añadido al carrito',
      cart_item_removed: 'Producto quitado del carrito',
      transaction_status_changed: 'Estado de transacción cambiado',
      registration_approved: 'Solicitud aprobada',
      registration_rejected: 'Solicitud rechazada',
    };

    return labels[action] || action.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  getActionBadgeClass(action: string): string {
    if (action.includes('created') || action.includes('added')) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
    if (
      action.includes('deleted') ||
      action.includes('removed') ||
      action.includes('deactivated')
    ) {
      return 'bg-red-50 text-red-700 border border-red-200';
    }
    if (action.includes('updated') || action.includes('changed') || action.includes('toggled')) {
      return 'bg-amber-50 text-amber-700 border border-amber-200';
    }
    if (action.includes('login') || action.includes('logout')) {
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    }
    if (action.includes('favourite')) {
      return 'bg-rose-50 text-rose-700 border border-rose-200';
    }
    if (action.includes('approved') || action.includes('stock_added')) {
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
    if (action.includes('rejected') || action.includes('stock_removed')) {
      return 'bg-red-50 text-red-700 border border-red-200';
    }
    return 'bg-stone-50 text-stone-600 border border-stone-200';
  }
}
