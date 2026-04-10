import '../styles/pages/blog.css';

const posts = [
  {
    slug: 'cuidados-basicos-suculentas',
    title: 'Cuidados básicos para tus suculentas',
    excerpt: 'Aprende todo lo que necesitas saber para mantener tus suculentas sanas: luz, riego, sustrato y más.',
    date: '2026-03-15',
    category: 'Cuidados',
    readTime: '5 min',
  },
  {
    slug: 'mejores-suculentas-interiores',
    title: 'Las 5 mejores suculentas para interiores',
    excerpt: 'No todas las suculentas necesitan luz directa. Descubre las variedades perfectas para espacios con poca luz.',
    date: '2026-03-08',
    category: 'Guías',
    readTime: '4 min',
  },
  {
    slug: 'souvenirs-suculentas-bodas',
    title: 'Souvenirs de suculentas para bodas',
    excerpt: 'Cómo elegir las suculentas perfectas como recuerdos para tus invitados. Ideas de presentación y personalización.',
    date: '2026-02-20',
    category: 'Eventos',
    readTime: '6 min',
  },
  {
    slug: 'propagacion-suculentas',
    title: 'Cómo propagar suculentas en casa',
    excerpt: 'Multiplica tu colección con estas técnicas sencillas de propagación por hojas y esquejes.',
    date: '2026-02-10',
    category: 'Cuidados',
    readTime: '7 min',
  },
];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-DO', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Blog() {
  return (
    <div className="blog">
      <div className="blog__header">
        <p className="blog__eyebrow">Blog</p>
        <h1 className="blog__title">
          Aprende sobre <span className="blog__title-accent">suculentas</span>
        </h1>
        <p className="blog__subtitle">Guías de cuidado, tips y novedades del mundo de las suculentas</p>
      </div>

      <div className="blog__grid">
        {posts.map(post => (
          <article key={post.slug} className="blog-card">
            <div className="blog-card__image">
              <span className="blog-card__category">{post.category}</span>
            </div>
            <div className="blog-card__body">
              <div className="blog-card__meta">
                <span>{formatDate(post.date)}</span>
                <span className="blog-card__dot">·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="blog-card__title">{post.title}</h2>
              <p className="blog-card__excerpt">{post.excerpt}</p>
              <span className="blog-card__link">Leer más →</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
