import { useParams } from 'react-router-dom';
import '../styles/pages/auth.css';

const policies = {
  ventas: {
    title: 'Términos y Condiciones de Venta',
    sections: [
      { heading: '1. Generalidades del Producto', text: 'Nuestros productos consisten en plantas suculentas vivas, presentadas en maceteros de vivero envueltos y decorados según nos indica el cliente. Cada suculenta es un ser vivo y, como tal, puede presentar variaciones naturales en tamaño, forma y color respecto a las imágenes de referencia. Nos comprometemos a seleccionar ejemplares sanos y de la mejor calidad disponible.' },
      { heading: '2. Precios y Pagos', text: 'Los precios de los productos y los costos de envío se detallarán en la cotización proporcionada al cliente. Se requerirá un pago inicial (depósito) del 50% del total del pedido para confirmar la orden. El balance restante deberá ser saldado antes del envío o la entrega.' },
      { heading: '3. Pedidos y Cancelaciones', text: 'Los pedidos deben realizarse con un mínimo de 30 días de antelación para garantizar la disponibilidad. Las cancelaciones con menos de 15 días de antelación podrían incurrir en la pérdida del depósito inicial.' },
      { heading: '5. Devoluciones y Reembolsos', text: 'Debido a la naturaleza perecedera de las plantas vivas, no se aceptan devoluciones ni se realizan reembolsos una vez que el pedido ha sido entregado y aceptado. Si tiene alguna preocupación sobre la calidad, comuníquese dentro de las 24 horas siguientes a la entrega con evidencia fotográfica.' },
      { heading: '6. Limitación de Responsabilidad', text: 'Nuestra responsabilidad se limita al costo de los productos pedidos. No seremos responsables por pérdidas indirectas, incidentales o consecuentes.' },
    ],
  },
  envios: {
    title: 'Política de Envío',
    sections: [
      { heading: '1. Naturaleza del Producto', text: 'Dado que se trata de plantas vivas, el envío se realizará a través de servicios de transporte terrestre especializados (Caribe Pack, Metro Pac u otros acordados) que ofrezcan un manejo adecuado y tiempos de entrega eficientes.' },
      { heading: '2. Embalaje', text: 'Los souvenires serán embalados cuidadosamente en cajas de cartón resistentes, utilizando materiales de protección (papel burbuja, relleno) para minimizar el movimiento y proteger las plantas durante el tránsito. Se etiquetarán las cajas con indicaciones de "FRÁGIL" y "ESTE LADO HACIA ARRIBA".' },
      { heading: '3. Responsabilidad del Transporte', text: 'Una vez que el pedido es entregado a la empresa de transporte, la responsabilidad recae en dicha empresa. Proporcionaremos al cliente el número de guía o rastreo para seguimiento.' },
      { heading: '4. Condiciones de Recepción', text: 'Es responsabilidad del cliente inspeccionar el paquete al momento de la entrega. Cualquier daño visible en el embalaje debe ser notificado al transportista de inmediato y documentado con fotos.' },
      { heading: '5. Daños durante el Transporte', text: 'En caso de daños significativos debido a manejo inadecuado por parte del transportista, se evaluará cada caso individualmente. No nos hacemos responsables por daños menores o estrés de la planta inherentes al transporte de seres vivos.' },
      { heading: '6. Fuerza Mayor', text: 'No seremos responsables por retrasos causados por eventos fuera de nuestro control, incluyendo desastres naturales, interrupciones en el transporte, huelgas o actos de autoridad.' },
    ],
  },
};

export default function Policies() {
  const { type } = useParams<{ type: string }>();
  const policy = policies[type as keyof typeof policies];

  if (!policy) return <div className="auth"><h1>Política no encontrada</h1></div>;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 'calc(var(--navbar-height) + 48px) 24px 80px' }}>
      <h1 style={{ fontFamily: 'var(--font-editorial)', color: 'var(--color-forest)', fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', marginBottom: 32 }}>
        {policy.title}
      </h1>
      {policy.sections.map((s, i) => (
        <div key={i} style={{ marginBottom: 28 }}>
          <h3 style={{ fontFamily: 'var(--font-editorial)', color: 'var(--color-forest)', fontSize: '1.1rem', marginBottom: 8 }}>{s.heading}</h3>
          <p style={{ color: 'var(--color-gray-500)', fontSize: '0.9rem', lineHeight: 1.7 }}>{s.text}</p>
        </div>
      ))}
      <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-400)', marginTop: 40, borderTop: '1px solid rgba(27,67,50,0.08)', paddingTop: 16 }}>
        GREENLABS Botanics — Santiago de los Caballeros, República Dominicana
      </p>
    </div>
  );
}
