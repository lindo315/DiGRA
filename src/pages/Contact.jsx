import { useState } from 'react';
import { FiMail, FiMapPin, FiTwitter, FiLinkedin, FiFacebook } from 'react-icons/fi';
import SectionHeader from '../components/SectionHeader';
import styles from './Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required.';
    if (!formData.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Please enter a valid email.';
    if (!formData.message.trim()) e.message = 'Message is required.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitted(true);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  }

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-inner">
          <p className="page-hero-breadcrumb">Home / Contact</p>
          <h1>Get In Touch</h1>
          <p>
            Have a question, a research proposal, or want to get involved? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      {/* New Chapter Notice */}
      <div className={styles.noticeBanner}>
        <div className="container">
          <p>
            <strong>Note:</strong> DiGRA SA is a newly established chapter. We are in the process of setting up
            our full operations. Response times may vary during this formation period.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <section className={`${styles.contactSection} section-white`}>
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Form */}
            <div className={styles.formSide}>
              <SectionHeader
                title="Send Us a Message"
                subtitle="Use this form to get in touch with the DiGRA SA team."
              />

              {submitted ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>✓</div>
                  <h3>Message Sent!</h3>
                  <p>
                    Thank you, <strong>{formData.name}</strong>. Your message has been received. We&apos;ll
                    get back to you at <strong>{formData.email}</strong> as soon as we can.
                  </p>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={errors.name ? styles.inputError : ''}
                      />
                      {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={errors.email ? styles.inputError : ''}
                      />
                      {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    >
                      <option value="">Select a subject</option>
                      <option value="membership">Membership enquiry</option>
                      <option value="events">Events & conferences</option>
                      <option value="research">Research collaboration</option>
                      <option value="media">Media & press</option>
                      <option value="partnership">Partnership opportunity</option>
                      <option value="general">General enquiry</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      placeholder="How can we help you? Tell us about your enquiry..."
                      className={errors.message ? styles.inputError : ''}
                    />
                    {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                  </div>
                  <button type="submit" className="btn-primary">
                    Send Message
                  </button>
                </form>
              )}
            </div>

            {/* Info Side */}
            <div className={styles.infoSide}>
              <h3 className={styles.infoHeading}>Contact Information</h3>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <FiMail size={20} />
                </div>
                <div>
                  <p className={styles.infoLabel}>Email</p>
                  <a href="mailto:info@digrasa.org" className={styles.infoValue}>
                    info@digrasa.org
                  </a>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <FiMapPin size={20} />
                </div>
                <div>
                  <p className={styles.infoLabel}>Location</p>
                  <p className={styles.infoValue}>South Africa</p>
                  <p className={styles.infoSub}>
                    DiGRA SA operates nationally — we are not affiliated with a single institution.
                  </p>
                </div>
              </div>

              <div className={styles.socialsBlock}>
                <p className={styles.socialsHeading}>Follow Us</p>
                <div className={styles.socials}>
                  <a href="#" className={styles.socialCard} aria-label="Twitter/X">
                    <FiTwitter size={20} />
                    <span>Twitter / X</span>
                  </a>
                  <a href="#" className={styles.socialCard} aria-label="LinkedIn">
                    <FiLinkedin size={20} />
                    <span>LinkedIn</span>
                  </a>
                  <a href="#" className={styles.socialCard} aria-label="Facebook">
                    <FiFacebook size={20} />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Follow Section */}
      <section className={`${styles.followSection} section-bg`}>
        <div className="container">
          <div className={styles.followInner}>
            <div>
              <SectionHeader
                title="Stay Connected"
                subtitle="Follow DiGRA SA on social media for news, event announcements, and research highlights."
              />
            </div>
            <div className={styles.followCards}>
              <a href="#" className={styles.followCard}>
                <FiTwitter size={28} />
                <p className={styles.followPlatform}>Twitter / X</p>
                <p className={styles.followHandle}>@DiGRASA</p>
              </a>
              <a href="#" className={styles.followCard}>
                <FiLinkedin size={28} />
                <p className={styles.followPlatform}>LinkedIn</p>
                <p className={styles.followHandle}>DiGRA South Africa</p>
              </a>
              <a href="#" className={styles.followCard}>
                <FiFacebook size={28} />
                <p className={styles.followPlatform}>Facebook</p>
                <p className={styles.followHandle}>DiGRA South Africa</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
