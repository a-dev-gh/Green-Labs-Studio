import { WHATSAPP_NUMBER, CURRENCY } from './constants';
import type { CartItem } from './types';

export function generateWhatsAppLink(items: CartItem[], total: number, notes?: string): string {
  const lines = items.map(item => {
    const name = item.product?.name || 'Producto';
    const price = item.product?.price || 0;
    return `- ${name} x${item.quantity} — ${CURRENCY} ${(price * item.quantity).toFixed(2)}`;
  });

  let message = `¡Hola! Quiero hacer un pedido en GREENLABS:\n\n${lines.join('\n')}\n\nTotal: ${CURRENCY} ${total.toFixed(2)}`;

  if (notes) {
    message += `\n\nNotas: ${notes}`;
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function generateServiceInquiryLink(serviceName: string): string {
  const message = `¡Hola! Me interesa el servicio de "${serviceName}" en GREENLABS. ¿Me pueden dar más información?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
