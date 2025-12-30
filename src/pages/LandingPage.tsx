import React, { useId, useMemo, useState } from "react";
import styles from "./LandingPage.module.css";

type ContactMethod = "Email" | "Phone" | "Text";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Icon({
  name,
  title,
}: {
  name: "check" | "sparkle" | "chat" | "heart" | "shield";
  title?: string;
}) {
  const path = (() => {
    switch (name) {
      case "check":
        return "M9.0 16.2 4.8 12.0l-1.4 1.4L9.0 19 21 7.0l-1.4-1.4z";
      case "sparkle":
        return "M12 2l1.4 4.6L18 8l-4.6 1.4L12 14l-1.4-4.6L6 8l4.6-1.4z";
      case "chat":
        return "M21 6a4 4 0 0 0-4-4H7A4 4 0 0 0 3 6v7a4 4 0 0 0 4 4h2v3l4-3h4a4 4 0 0 0 4-4z";
      case "heart":
        return "M12 21s-7-4.4-9.3-9A5.6 5.6 0 0 1 12 5.6 5.6 5.6 0 0 1 21.3 12C19 16.6 12 21 12 21z";
      case "shield":
        return "M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6z";
      default:
        return "";
    }
  })();

  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={path} />
    </svg>
  );
}

function Button({
  as = "a",
  href,
  onClick,
  variant = "primary",
  children,
  className,
  type,
}: {
  as?: "a" | "button";
  href?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
}) {
  const base = cx(
    styles.button,
    variant === "primary" && styles.buttonPrimary,
    variant === "secondary" && styles.buttonSecondary,
    variant === "ghost" && styles.buttonGhost,
    className
  );

  if (as === "button") {
    return (
      <button type={type ?? "button"} className={base} onClick={onClick}>
        {children}
      </button>
    );
  }

  return (
    <a className={base} href={href} onClick={onClick}>
      {children}
    </a>
  );
}

function Section({
  id,
  label,
  eyebrow,
  title,
  subtitle,
  tone = "default",
  children,
}: {
  id?: string;
  label?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  tone?: "default" | "tinted";
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-label={label}
      className={cx(styles.section, tone === "tinted" && styles.sectionTinted)}
    >
      <div className={styles.container}>
        {(eyebrow || title || subtitle) && (
          <header className={styles.sectionHeader}>
            {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
            {title && <h2 className={styles.h2}>{title}</h2>}
            {subtitle && <p className={styles.lead}>{subtitle}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <div className={styles.fieldTop}>
        <label className={styles.label} htmlFor={htmlFor}>
          {label} {required ? <span className={styles.required}>*</span> : null}
        </label>
        {hint ? <span className={styles.hint}>{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

function formatPhoneInput(input: string) {
  // Keep it light: digits only + basic US formatting, but don't enforce.
  const digits = input.replace(/[^\d]/g, "").slice(0, 15);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  return `+${digits}`;
}

export default function LandingPage() {
  const preferredContactId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<
    | { type: "idle" }
    | { type: "success"; message: string }
    | { type: "error"; message: string }
  >({ type: "idle" });
  const [phoneValue, setPhoneValue] = useState("");

  const services = useMemo(
    () => [
      {
        title: "1:1 Therapy",
        description: "Individual therapy sessions",
        icon: "heart" as const,
      },
      {
        title: "Couples & Family Therapy",
        description: "Couples and family therapy sessions",
        icon: "chat" as const,
      },
      {
        title: "Intuitive Readings",
        description: "Intuitive reading sessions",
        icon: "sparkle" as const,
      },
    ],
    []
  );

  const testimonials = useMemo(
    () => [
      { quote: "TESTIMONIAL" },
      { quote: "TESTMONIAL" },
      { quote: "TESTMONIAL" },
    ],
    []
  );

  function scrollToId(targetId: string) {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "idle" });

    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setIsSubmitting(true);
    try {
      // Production-friendly default: no backend assumptions.
      // You can wire this to an API endpoint later without changing markup.
      await new Promise((r) => setTimeout(r, 550));
      form.reset();
      setPhoneValue("");
      setStatus({
        type: "success",
        message:
          "Thanks—your message has been received. We’ll follow up using your preferred contact method.",
      });
    } catch {
      setStatus({
        type: "error",
        message:
          "Something went wrong while sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const year = new Date().getFullYear();

  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>

      <header className={styles.siteHeader}>
        <div className={styles.container}>
          <div className={styles.navRow}>
            <div className={styles.brand} aria-label="Melanie's Therapy Practice">
              <span className={styles.brandMark} aria-hidden="true" />
              <span className={styles.brandText}>Melanie&apos;s Therapy Practice</span>
            </div>

            <nav className={styles.nav} aria-label="Primary">
              <a className={styles.navLink} href="#services">
                Services
              </a>
              <a className={styles.navLink} href="#testimonials">
                Testimonials
              </a>
              <a className={styles.navLink} href="#contact">
                Contact
              </a>
              <Button
                as="button"
                variant="primary"
                className={styles.navCta}
                onClick={() => scrollToId("contact")}
              >
                Book a Consultation
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main id="main">
        <section className={styles.hero} aria-label="Hero">
          <div className={styles.container}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <p className={styles.kicker}>
                  Conflict doesn’t have to be your default
                </p>
                <h1 className={styles.h1}>
                  Are You Stuck in the Same Arguments No Matter What You Say?
                </h1>
                <p className={styles.heroLead}>
                  Here&apos;s How You can Finally Feel Heard And Break Out Of That
                  Cycle Of Constant Fights
                </p>

                <div className={styles.heroCtas}>
                  <Button
                    as="button"
                    variant="primary"
                    onClick={() => scrollToId("contact")}
                    className={styles.heroPrimaryCta}
                  >
                    Schedule a Free Consultation
                  </Button>
                  <Button
                    as="button"
                    variant="secondary"
                    onClick={() => scrollToId("services")}
                  >
                    Explore Services
                  </Button>
                </div>

                <ul className={styles.heroBullets} aria-label="Highlights">
                  <li className={styles.heroBullet}>
                    <span className={styles.bulletIcon} aria-hidden="true">
                      <Icon name="check" />
                    </span>
                    <span>
                      Clear tools for calmer conversations and healthier boundaries
                    </span>
                  </li>
                  <li className={styles.heroBullet}>
                    <span className={styles.bulletIcon} aria-hidden="true">
                      <Icon name="shield" />
                    </span>
                    <span>
                      A supportive, judgment-free space to feel understood and safe
                    </span>
                  </li>
                  <li className={styles.heroBullet}>
                    <span className={styles.bulletIcon} aria-hidden="true">
                      <Icon name="sparkle" />
                    </span>
                    <span>
                      Insightful sessions that help you move forward with confidence
                    </span>
                  </li>
                </ul>
              </div>

              <aside className={styles.heroCard} aria-label="What you can expect">
                <div className={styles.heroCardTop}>
                  <p className={styles.cardEyebrow}>A gentle, structured approach</p>
                  <h2 className={styles.cardTitle}>What we’ll focus on together</h2>
                </div>
                <div className={styles.heroCardBody}>
                  <div className={styles.feature}>
                    <div className={styles.featureIcon} aria-hidden="true">
                      <Icon name="chat" />
                    </div>
                    <div className={styles.featureText}>
                      <p className={styles.featureTitle}>Communication</p>
                      <p className={styles.featureDesc}>
                        Break repeating patterns and learn how to truly hear each
                        other.
                      </p>
                    </div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.featureIcon} aria-hidden="true">
                      <Icon name="heart" />
                    </div>
                    <div className={styles.featureText}>
                      <p className={styles.featureTitle}>Connection</p>
                      <p className={styles.featureDesc}>
                        Rebuild trust, closeness, and a shared sense of “we’re on
                        the same team.”
                      </p>
                    </div>
                  </div>
                  <div className={styles.feature}>
                    <div className={styles.featureIcon} aria-hidden="true">
                      <Icon name="shield" />
                    </div>
                    <div className={styles.featureText}>
                      <p className={styles.featureTitle}>Stability</p>
                      <p className={styles.featureDesc}>
                        Create steadier emotional footing so conflict doesn’t run
                        your life.
                      </p>
                    </div>
                  </div>
                </div>
                <div className={styles.heroCardCtaRow}>
                  <Button
                    as="button"
                    variant="ghost"
                    onClick={() => scrollToId("contact")}
                  >
                    Start the conversation
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <Section
          id="services"
          label="Services"
          eyebrow="Services"
          title="Support tailored to your needs"
          subtitle="Choose the kind of support that fits where you are right now."
          tone="tinted"
        >
          <div className={styles.cardsGrid}>
            {services.map((s) => (
              <article key={s.title} className={styles.card}>
                <div className={styles.cardIcon} aria-hidden="true">
                  <Icon name={s.icon} />
                </div>
                <h3 className={styles.h3}>{s.title}</h3>
                <p className={styles.p}>{s.description}</p>
                <div className={styles.cardFooter}>
                  <Button
                    as="button"
                    variant="secondary"
                    onClick={() => scrollToId("contact")}
                    className={styles.cardCta}
                  >
                    Request availability
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="testimonials"
          label="Testimonials"
          eyebrow="Testimonials"
          title="Real words from real people"
          subtitle="A few reflections from clients who wanted something to change—and made it happen."
        >
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, idx) => (
              <figure key={idx} className={styles.testimonial}>
                <blockquote className={styles.blockquote}>
                  <p className={styles.quote}>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <figcaption className={styles.figcaption}>
                  <span className={styles.avatar} aria-hidden="true" />
                  <div className={styles.figText}>
                    <span className={styles.figTitle}>Client</span>
                    <span className={styles.figSub}>Verified testimonial</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className={styles.inlineCta}>
            <div className={styles.inlineCtaCard}>
              <div className={styles.inlineCtaText}>
                <p className={styles.inlineCtaTitle}>
                  Ready to stop repeating the same fight?
                </p>
                <p className={styles.inlineCtaDesc}>
                  Reach out and we’ll take the next step together.
                </p>
              </div>
              <div className={styles.inlineCtaActions}>
                <Button
                  as="button"
                  variant="primary"
                  onClick={() => scrollToId("contact")}
                >
                  Contact Melanie
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <Section
          id="contact"
          label="Contact form"
          eyebrow="Contact"
          title="Send a message"
          subtitle="Share a little about what you’re navigating. You’ll hear back using your preferred contact method."
          tone="tinted"
        >
          <div className={styles.contactGrid}>
            <div className={styles.contactIntro} aria-label="Contact details">
              <div className={styles.contactPanel}>
                <h3 className={styles.h3}>What happens next</h3>
                <ul className={styles.steps}>
                  <li className={styles.step}>
                    <span className={styles.stepIcon} aria-hidden="true">
                      <Icon name="check" />
                    </span>
                    <span>Send your message using the form.</span>
                  </li>
                  <li className={styles.step}>
                    <span className={styles.stepIcon} aria-hidden="true">
                      <Icon name="chat" />
                    </span>
                    <span>We’ll follow up via your chosen contact method.</span>
                  </li>
                  <li className={styles.step}>
                    <span className={styles.stepIcon} aria-hidden="true">
                      <Icon name="heart" />
                    </span>
                    <span>We’ll plan the best next step for your situation.</span>
                  </li>
                </ul>
                <p className={styles.smallNote}>
                  Your message is treated with care and confidentiality.
                </p>
              </div>
            </div>

            <div className={styles.formWrap}>
              <form className={styles.form} onSubmit={onSubmit} noValidate>
                <div className={styles.formGrid}>
                  <Field label="Full Name" htmlFor="fullName" required>
                    <input
                      className={styles.input}
                      id="fullName"
                      name="fullName"
                      autoComplete="name"
                      required
                    />
                  </Field>

                  <Field label="Email" htmlFor="email" required>
                    <input
                      className={styles.input}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      required
                    />
                  </Field>

                  <Field label="Phone" htmlFor="phone" hint="Optional">
                    <input
                      className={styles.input}
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={phoneValue}
                      onChange={(e) => setPhoneValue(formatPhoneInput(e.target.value))}
                    />
                  </Field>

                  <Field
                    label="Preferred Contact Method"
                    htmlFor={preferredContactId}
                    required
                  >
                    <select
                      className={styles.input}
                      id={preferredContactId}
                      name="preferredContactMethod"
                      required
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select one…
                      </option>
                      {(["Email", "Phone", "Text"] as ContactMethod[]).map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <div className={styles.fieldFull}>
                    <Field label="Message" htmlFor="message" required>
                      <textarea
                        className={styles.textarea}
                        id="message"
                        name="message"
                        rows={6}
                        required
                      />
                    </Field>
                  </div>
                </div>

                {status.type !== "idle" ? (
                  <div
                    className={cx(
                      styles.formStatus,
                      status.type === "success" && styles.formStatusSuccess,
                      status.type === "error" && styles.formStatusError
                    )}
                    role={status.type === "error" ? "alert" : "status"}
                    aria-live="polite"
                  >
                    {status.message}
                  </div>
                ) : null}

                <div className={styles.formActions}>
                  <Button
                    as="button"
                    type="submit"
                    variant="primary"
                    className={styles.submit}
                    onClick={undefined}
                  >
                    {isSubmitting ? "Sending…" : "Send Message"}
                  </Button>
                  <p className={styles.formFinePrint}>
                    By sending, you agree to be contacted about your request.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </Section>
      </main>

      <footer className={styles.footer} aria-label="Footer">
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerBrand}>
                <span className={styles.brandMark} aria-hidden="true" />
                <span className={styles.footerBrandText}>
                  Melanie&apos;s Therapy Practice
                </span>
              </div>
              <p className={styles.footerText}>
                Support for individuals, couples, and families ready to break the
                cycle and feel heard again.
              </p>
            </div>
            <div className={styles.footerLinks} aria-label="Quick links">
              <a className={styles.footerLink} href="#services">
                Services
              </a>
              <a className={styles.footerLink} href="#testimonials">
                Testimonials
              </a>
              <a className={styles.footerLink} href="#contact">
                Contact
              </a>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p className={styles.copyright}>
              © {year} Melanie&apos;s Therapy Practice. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}


