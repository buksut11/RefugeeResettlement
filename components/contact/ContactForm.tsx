import { getContent } from '@/lib/content'
import type { Lang } from '@/lib/i18n'

export function ContactForm({ lang }: { lang: Lang }) {
  const content = getContent(lang)
  const { contact } = content

  return (
    <form method="POST" action={contact.formspreeEndpoint} className="mt-4 space-y-4 text-sm">
      <input
        type="text"
        name="_gotcha"
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        style={{ position: 'absolute', left: '-9999px' }}
      />
      <div>
        <label htmlFor="contact-name">{contact.nameLabel}</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="mt-1 block w-full border border-primary/20 p-2"
        />
      </div>
      <div>
        <label htmlFor="contact-email">{contact.emailLabel}</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full border border-primary/20 p-2"
        />
      </div>
      <div>
        <label htmlFor="contact-subject">{contact.subjectLabel}</label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          className="mt-1 block w-full border border-primary/20 p-2"
        />
      </div>
      <div>
        <label htmlFor="contact-message">{contact.messageLabel}</label>
        <textarea
          id="contact-message"
          name="message"
          required
          className="mt-1 block w-full border border-primary/20 p-2"
        />
      </div>
      <button type="submit" className="rounded bg-primary px-4 py-2 text-paper">
        {contact.submitLabel}
      </button>
    </form>
  )
}
