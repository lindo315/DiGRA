import { useState } from 'react';
import { FiCheck, FiUsers, FiBookOpen, FiGlobe, FiMail } from 'react-icons/fi';
import SectionHeader from '../components/SectionHeader';
import styles from './Membership.module.css';

const benefits = [
  {
    icon: FiUsers,
    title: 'Community Access',
    description:
      'Connect with a growing network of South African and African game researchers, educators, developers, and students.',
  },
  {
    icon: FiBookOpen,
    title: 'DiGRA Resources',
    description:
      'Access DiGRA International resources including the open-access digital library, journal discounts, and conference networks.',
  },
  {
    icon: FiGlobe,
    title: 'Events & Conferences',
    description:
      'Priority access and discounts to DiGRA SA symposia, workshops, and the annual DiGRA International conference.',
  },
  {
    icon: FiMail,
    title: 'Newsletter & Updates',
    description:
      'Receive our newsletter with the latest in South African game studies: news, calls for papers, job opportunities, and research highlights.',
  },
];

const tiers = [
  {
    id: 'student',
    name: 'Student',
    note: 'For full-time students at any level',
    price: 'TBC',
    features: [
      'Full DiGRA SA membership',
      'Access to events at student rate',
      'DiGRA International student benefits',
      'Community forum access',
      'Newsletter subscription',
    ],
  },
  {
    id: 'regular',
    name: 'Regular',
    note: 'For individual researchers, educators, and professionals',
    price: 'TBC',
    featured: true,
    features: [
      'Full DiGRA SA membership',
      'Access to all events',
      'DiGRA International member benefits',
      'Voting rights on chapter decisions',
      'Newsletter subscription',
      'Eligibility for committee positions',
    ],
  },
  {
    id: 'institutional',
    name: 'Institutional',
    note: 'For universities, research centres, and organisations',
    price: 'TBC',
    features: [
      'Multiple staff/student memberships',
      'Institutional listing on DiGRA SA website',
      'Co-branding opportunities at events',
      'Priority partnership on DiGRA SA events',
      'Annual report and impact documentation',
    ],
  },
];

const steps = [
  {
    number: '01',
    title: 'Complete the form below',
    description: 'Fill in your details, tell us about your background and research interests.',
  },
  {
    number: '02',
    title: 'We confirm your membership',
    description:
      "Our team will review your application and confirm your membership by email — we're in formation, so this is a welcoming process.",
  },
  {
    number: '03',
    title: 'Join the community',
    description:
      "You'll receive access to our community channels, event notifications, and DiGRA SA resources.",
  },
  {
    number: '04',
    title: 'Stay engaged',
    description:
      'Attend events, contribute to discussions, share your research, and help build DiGRA SA from the ground up.',
  },
];

export default function Membership() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    affiliation: '',
    role: '',
    interests: '',
    referral: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!formData.name.trim()) e.name = 'Name is required.';
    if (!formData.email.trim()) e.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Please enter a valid email.';
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
          <p className="page-hero-breadcrumb">Home / Membership</p>
          <h1>Join DiGRA South Africa</h1>
          <p>
            Become a founding member of the South African game studies community.
            Open to researchers, students, educators, industry professionals, and enthusiasts.
          </p>
        </div>
      </div>

      {/* Why Join */}
      <section id="benefits" className={`${styles.benefitsSection} section-white`}>
        <div className="container">
          <SectionHeader
            title="Why Join DiGRA SA?"
            subtitle="DiGRA SA membership connects you to a community, resources, and opportunities."
            align="center"
          />
          <div className={styles.benefitsGrid}>
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div key={i} className={styles.benefitCard}>
                  <div className={styles.benefitIcon}>
                    <Icon size={22} />
                  </div>
                  <h3>{b.title}</h3>
                  <p>{b.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who Can Join */}
      <section className={`${styles.whoSection} section-bg`}>
        <div className="container">
          <div className={styles.whoGrid}>
            <SectionHeader
              title="Who Can Join?"
              subtitle="DiGRA SA is radically open. We welcome anyone with an interest in games, play, and game culture."
            />
            <div className={styles.whoList}>
              {[
                { label: 'Academic Researchers', desc: 'Lecturers, professors, and postdoctoral researchers in any discipline with an interest in games.' },
                { label: 'Postgraduate Students', desc: 'Honours, Masters, and PhD students whose work touches on games, play, or digital culture.' },
                { label: 'Undergraduate Students', desc: 'Students curious about game studies as a field, looking to connect with the community.' },
                { label: 'Game Developers', desc: 'Independent and professional game developers interested in the intersection of practice and scholarship.' },
                { label: 'Industry Professionals', desc: 'Publishers, journalists, designers, and others working in or around the games industry.' },
                { label: 'Educators & Teachers', desc: 'School and university teachers using games in the classroom or researching games-based learning.' },
                { label: 'Enthusiasts & Practitioners', desc: 'Anyone passionate about games and game culture who wants to engage with academic discourse.' },
              ].map((item, i) => (
                <div key={i} className={styles.whoItem}>
                  <FiCheck size={16} className={styles.whoCheck} />
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="membership-tiers" className={`${styles.tiersSection} section-white`}>
        <div className="container">
          <SectionHeader
            title="Membership Tiers"
            subtitle="Exact fees are to be confirmed pending DiGRA International guidelines. Membership is free while we get established."
            align="center"
          />
          <div className={styles.tiersGrid}>
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`${styles.tierCard} ${tier.featured ? styles.featured : ''}`}
              >
                {tier.featured && <span className={styles.featuredBadge}>Most Common</span>}
                <h3 className={styles.tierName}>{tier.name}</h3>
                <p className={styles.tierNote}>{tier.note}</p>
                <p className={styles.tierPrice}>
                  {tier.price}
                  <span> / year</span>
                </p>
                <ul className={styles.tierFeatures}>
                  {tier.features.map((f, i) => (
                    <li key={i}>
                      <FiCheck size={14} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#join-form" className={tier.featured ? 'btn-primary' : 'btn-secondary'} style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}>
                  Apply Now
                </a>
              </div>
            ))}
          </div>
          <p className={styles.tierNote2}>
            * Membership fees will be set in accordance with DiGRA International chapter guidelines.
            Until then, membership is open and free.
          </p>
        </div>
      </section>

      {/* How to Join */}
      <section id="how-to-join" className={`${styles.stepsSection} section-bg`}>
        <div className="container">
          <SectionHeader
            title="How to Join"
            subtitle="A simple, welcoming process. DiGRA SA is in formation — your membership helps shape what we become."
            align="center"
          />
          <div className={styles.stepsGrid}>
            {steps.map((step) => (
              <div key={step.number} className={styles.stepCard}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Form */}
      <section className={`${styles.formSection} section-white`} id="join-form">
        <div className="container">
          <div className={styles.formWrapper}>
            <div className={styles.formIntro}>
              <SectionHeader
                title="Apply for Membership"
                subtitle="Complete the form to join DiGRA South Africa. We'll be in touch to confirm your membership."
              />
              <p className={styles.formNote}>
                DiGRA SA is a newly established chapter. We are currently in the process of setting
                up our full membership system. This form registers your interest and we will confirm
                your founding membership by email.
              </p>
            </div>

            {submitted ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>Application Received!</h3>
                <p>
                  Thank you, <strong>{formData.name}</strong>! We&apos;ve received your membership
                  application. A confirmation will be sent to <strong>{formData.email}</strong> shortly.
                  Welcome to DiGRA South Africa!
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
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="affiliation">Institution / Affiliation</label>
                    <input
                      type="text"
                      id="affiliation"
                      name="affiliation"
                      value={formData.affiliation}
                      onChange={handleChange}
                      placeholder="University, company, or independent"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="role">Role / Position</label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="">Select your role</option>
                      <option value="undergraduate">Undergraduate Student</option>
                      <option value="postgraduate">Postgraduate Student (Honours/Masters/PhD)</option>
                      <option value="postdoc">Postdoctoral Researcher</option>
                      <option value="lecturer">Lecturer / Senior Lecturer</option>
                      <option value="professor">Associate / Full Professor</option>
                      <option value="developer">Game Developer</option>
                      <option value="industry">Industry Professional</option>
                      <option value="educator">School Educator</option>
                      <option value="independent">Independent Researcher</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="interests">Research Interests</label>
                  <textarea
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us briefly about your interest in game studies, your research focus, or how you engage with games professionally or academically..."
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="referral">How did you hear about DiGRA SA?</label>
                  <select
                    id="referral"
                    name="referral"
                    value={formData.referral}
                    onChange={handleChange}
                  >
                    <option value="">Select one</option>
                    <option value="colleague">From a colleague or peer</option>
                    <option value="social">Social media</option>
                    <option value="digra-intl">DiGRA International</option>
                    <option value="conference">At a conference or event</option>
                    <option value="search">Web search</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
