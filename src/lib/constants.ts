export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '';

export const SITE_NAME = 'GREENLABS Botanics';
export const SITE_TAGLINE = 'Suculentas que transforman espacios';
export const SITE_LOCATION = 'Santiago de los Caballeros, RD';

export const CURRENCY = 'RD$';

export const ORDER_STATUSES = {
  pending: 'Pendiente',
  confirmed: 'Confirmado',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
} as const;

export const LIGHT_NEEDS = {
  low: 'Poca luz',
  medium: 'Luz indirecta',
  high: 'Luz directa',
} as const;

export const WATER_NEEDS = {
  low: 'Riego mínimo',
  medium: 'Riego moderado',
  high: 'Riego frecuente',
} as const;
