const EXPERIENCE = [
  {
    role: 'Head of Engineering',
    org: 'Tribela GmbH',
    date: '2025 – Present',
    desc: 'Lead engineering on multi-modal (text, image, audio, video) machine learning for harmful-content detection — building the research pipelines and a ~500K-sample dataset to reach ~90% accuracy served via API, using LLM-agentic tooling to relabel ~100K samples at near-human quality, porting the Android app from Swift to React Native, standing up an open-source R&D branch, and pitching to industry leaders in London and New York.',
  },
  {
    role: 'Level 2 Swimming Coach',
    org: 'Maxwell Swimming Club',
    date: '2025 – Present',
    desc: 'Coach competitive swimmers, planning training sessions and mentoring athletes to regional and national personal bests.',
  },
  {
    role: 'Access Control Engineer',
    org: 'Darren Bryan Security Services',
    date: '2018 – 2025',
    desc: 'Installed and maintained security systems — locks, CCTV, and automated gates — for the Oxford Colleges, troubleshooting complex integration issues.',
  },
]

const EDUCATION = [
  {
    role: 'MSc Data-Intensive Physics (First-Class Honours)',
    org: 'Cardiff University',
    date: 'Sep 2024 – Sep 2025',
    desc: 'Built a deep neural network to learn gravitational waveforms (written up in Projects), across modules spanning gravitational-wave astronomy, numerical relativity, and machine learning.',
  },
  {
    role: 'BSc Cyber Security (First-Class Honours)',
    org: 'Cardiff Metropolitan University',
    date: 'Sep 2021 – Jun 2024',
    desc: 'Cyber Security Student of the Year (2024), specialising in cryptography and IoT device security; my dissertation, Fenrir, implemented identity-based cryptography (see Projects).',
  },
]

function Timeline({ title, items }) {
  return (
    <div className="about-block">
      <h3 className="about-block__title">{title}</h3>
      <ul className="timeline">
        {items.map((item) => (
          <li key={item.role + item.org} className="timeline__item">
            <div className="timeline__head">
              <span className="timeline__role">{item.role}</span>
              <span className="timeline__date">{item.date}</span>
            </div>
            <span className="timeline__org">{item.org}</span>
            {item.desc && <p className="timeline__desc">{item.desc}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function AboutSection() {
  return (
    <section id="about" className="section">
      <h2 className="page-title">About</h2>

      <div className="about-grid">
        {/* Left: experience + education */}
        <div className="about-col">
          <Timeline title="Experience" items={EXPERIENCE} />
          <Timeline title="Education" items={EDUCATION} />
        </div>

        {/* Right: profile copy + photo */}
        <div className="about-col about-col--profile">
          <h3 className="about-block__title">Profile</h3>
          <div className="prose">
            <p>
              Ex-GB swimmer and AI/ML engineer with an MSc in Data-Intensive
              Physics (Cardiff University) and a First-Class BSc in Cyber
              Security, specialising in turning large, complex, multi-modal
              datasets into robust machine learning systems.
            </p>
            <p>
              You can reach me at{' '}
              <a href="mailto:astrilcodex@gmail.com">astrilcodex@gmail.com</a>.
            </p>
          </div>

          <img
            className="about-photo"
            src="/about/graduation.webp"
            alt="Connor Bryan at graduation"
            width="630"
            height="900"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
