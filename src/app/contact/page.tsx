import { availability } from '@/lib/availability';

export const metadata = {
  title: 'Contact | Antony O\'Neill',
  description: 'Get in touch for project enquiries and collaborations.',
};

export default function ContactPage() {
  const { status, responseTime, nextStart, headline, description } = availability;

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-5">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            Contact
          </h1>
          <p className="text-lg" style={{ color: 'var(--foreground-muted)' }}>
            Let's discuss your project.
          </p>
        </header>

        {/* Availability Card */}
        <div
          className="rounded-2xl border p-6 mb-10"
          style={{
            background: 'var(--card)',
            borderColor: 'var(--card-border)',
            boxShadow: '0 4px 20px var(--card-shadow)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: 'var(--foreground-subtle)' }}
            >
              Current Status
            </span>
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold"
              style={{
                background:
                  status === 'available'
                    ? 'var(--accent-green-light)'
                    : status === 'limited'
                    ? 'rgba(245, 158, 11, 0.15)'
                    : 'rgba(239, 68, 68, 0.15)',
                color:
                  status === 'available'
                    ? 'var(--accent-green)'
                    : status === 'limited'
                    ? '#f59e0b'
                    : '#ef4444',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  background:
                    status === 'available'
                      ? 'var(--accent-green)'
                      : status === 'limited'
                      ? '#f59e0b'
                      : '#ef4444',
                }}
              />
              {status === 'available'
                ? 'Available'
                : status === 'limited'
                ? 'Limited'
                : 'Unavailable'}
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            {headline}
          </h2>
          <p className="mb-6" style={{ color: 'var(--foreground-muted)' }}>
            {description}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'var(--card-border)' }}>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--foreground-subtle)' }}>
                Response Time
              </p>
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                {responseTime}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--foreground-subtle)' }}>
                Next Available
              </p>
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                {nextStart}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              style={{
                background: 'var(--background)',
                borderColor: 'var(--card-border)',
                color: 'var(--foreground)',
              }}
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              style={{
                background: 'var(--background)',
                borderColor: 'var(--card-border)',
                color: 'var(--foreground)',
              }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold mb-2"
              style={{ color: 'var(--foreground)' }}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              style={{
                background: 'var(--background)',
                borderColor: 'var(--card-border)',
                color: 'var(--foreground)',
              }}
              placeholder="Tell me about your project..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all hover:-translate-y-0.5"
            style={{ background: 'var(--primary)' }}
          >
            Send Message
          </button>
        </form>

        {/* Direct Contact */}
        <div className="mt-10 text-center">
          <p className="text-sm mb-2" style={{ color: 'var(--foreground-muted)' }}>
            Prefer email directly?
          </p>
          <a
            href="mailto:antony@aoneill.co.uk"
            className="font-semibold transition-colors hover:text-[var(--primary)]"
            style={{ color: 'var(--foreground)' }}
          >
            antony@aoneill.co.uk
          </a>
        </div>
      </div>
    </main>
  );
}
