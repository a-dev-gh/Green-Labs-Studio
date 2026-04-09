import { CURRENCY } from './constants';

export function formatPrice(price: number): string {
  return `${CURRENCY} ${price.toFixed(2)}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-DO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
