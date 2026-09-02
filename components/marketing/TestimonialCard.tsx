import type { Testimonial } from '@/lib/testimonials-content';

function StarRating({ rating = 5 }: { rating?: number }) {
  const value = Math.min(5, Math.max(1, rating));
  return (
    <div className="mk-testimonial-stars" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`mk-testimonial-stars__star${i < value ? ' mk-testimonial-stars__star--filled' : ''}`}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="mk-testimonial-card h-full">
      <StarRating rating={testimonial.rating} />
      <p className="mk-testimonial leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
      <div className="mk-testimonial-card__footer">
        <div>
          <div className="text-sm font-medium">{testimonial.name}</div>
          <div className="text-xs text-[var(--mk-muted)]">
            {testimonial.role} · {testimonial.company}
          </div>
        </div>
      </div>
    </article>
  );
}
