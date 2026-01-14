import { useState } from "react";
import "./css/Visit.css";

export default function Visit() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (url) => {
    window.location.href = url;
  };

  const toggleMobileMenu = () => {
    setMobileOpen((v) => !v);
  };

  return (
    <>
      {/* NAV */}
      <header className="nav">
        <div className="nav__inner">
          <a className="brand" href="#">
            <span className="brand__dot"></span>
            Smart Campus
          </a>

          <nav className="menu" aria-label="Primary">
            <a href="#features">Features</a>
            <a href="#how">How it works</a>
            <a href="#resources">Resources</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="nav__actions">
            <a className="btn btn--ghost" href="login">
              Sign in
            </a>
            <a className="btn btn--primary" href="register">
              Sign up
            </a>
          </div>

          <button className="burger" aria-label="Open menu" onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`mobile ${mobileOpen ? "mobile--open" : ""}`} id="mobileMenu">
          <a
            href="#features"
            onClick={(e) => {
              // allow anchor jump, but close menu
              setMobileOpen(false);
            }}
          >
            Features
          </a>
          <a
            href="#how"
            onClick={() => {
              setMobileOpen(false);
            }}
          >
            How it works
          </a>
          <a
            href="#resources"
            onClick={() => {
              setMobileOpen(false);
            }}
          >
            Resources
          </a>
          <a
            href="#faq"
            onClick={() => {
              setMobileOpen(false);
            }}
          >
            FAQ
          </a>
          <div className="mobile__cta">
            <a className="btn btn--ghost" href="login">
              Sign in
            </a>
            <a className="btn btn--primary" href="register">
              Sign up
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <main className="hero">
        <div className="hero__inner">
          <section className="hero__copy">
            <div className="pill">
              <span className="pill__dot"></span>
              Conflict-free booking for campus spaces
            </div>

            <h1>Book labs, halls, and sports facilities — fast and without conflicts.</h1>
            <p className="lead">
              A centralized campus resource booking platform with availability views, calendar-like
              scheduling, and booking history. Built for students, staff, and admins.
            </p>

            <div className="cta">
              <a className="btn btn--primary btn--lg" href="catalog.html">
                View availability
              </a>
              <a className="btn btn--soft btn--lg" href="booking.html">
                Make a booking
              </a>
            </div>

            <div className="trust">
              <div className="trust__item">
                <strong>Real-time</strong>
                <span>availability</span>
              </div>
              <div className="trust__item">
                <strong>No double</strong>
                <span>booking</span>
              </div>
              <div className="trust__item">
                <strong>History</strong>
                <span>tracking</span>
              </div>
            </div>
          </section>

          {/* "Screenshot" mock */}
          <aside className="mock" aria-label="Product preview">
            <div className="mock__top">
              <div className="dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="mock__title">Smart Campus Booking</div>
              <div className="mock__chip">Today</div>
            </div>

            <div className="mock__content">
              <div className="mock__row">
                <div className="miniCard">
                  <div className="miniCard__icon">🧪</div>
                  <div>
                    <div className="miniCard__title">Labs</div>
                    <div className="miniCard__sub">
                      <span className="ok">8 free</span> · <span className="bad">4 booked</span>
                    </div>
                  </div>
                  <button className="miniBtn" onClick={() => go("catalog.html?type=lab")}>
                    View
                  </button>
                </div>

                <div className="miniCard">
                  <div className="miniCard__icon">🏛️</div>
                  <div>
                    <div className="miniCard__title">Halls</div>
                    <div className="miniCard__sub">
                      <span className="ok">3 free</span> · <span className="bad">3 booked</span>
                    </div>
                  </div>
                  <button className="miniBtn" onClick={() => go("catalog.html?type=hall")}>
                    View
                  </button>
                </div>
              </div>

              <div className="mock__panel">
                <div className="panel__head">
                  <div>
                    <div className="panel__title">Availability</div>
                    <div className="panel__sub">Tap a slot to book</div>
                  </div>
                  <div className="panel__legend">
                    <span className="legend ok">Free</span>
                    <span className="legend bad">Booked</span>
                  </div>
                </div>

                <div className="slots">
                  <button className="slot ok" onClick={() => go("booking.html")}>
                    09:00
                  </button>
                  <button className="slot bad" disabled>
                    10:00
                  </button>
                  <button className="slot ok" onClick={() => go("booking.html")}>
                    11:00
                  </button>
                  <button className="slot ok" onClick={() => go("booking.html")}>
                    12:00
                  </button>
                  <button className="slot bad" disabled>
                    13:00
                  </button>
                  <button className="slot ok" onClick={() => go("booking.html")}>
                    14:00
                  </button>
                </div>
              </div>

              <div className="mock__footer">
                <div className="footCard">
                  <div className="footCard__kpi">17</div>
                  <div className="footCard__txt">Available today</div>
                </div>
                <div className="footCard">
                  <div className="footCard__kpi">10</div>
                  <div className="footCard__txt">Currently booked</div>
                </div>
                <div className="footCard">
                  <div className="footCard__kpi">0</div>
                  <div className="footCard__txt">Conflicts</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="bgGlow" aria-hidden="true"></div>
      </main>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="section__inner">
          <div className="section__head">
            <h2>Enterprise-style scheduling UX</h2>
            <p>Availability dashboards, conflict checks, and admin-friendly flows — exactly what judges expect.</p>
          </div>

          <div className="cards">
            <article className="card">
              <div className="card__icon">📅</div>
              <h3>Calendar views</h3>
              <p>Day/Week style slots to quickly see what’s free and what’s booked.</p>
            </article>

            <article className="card">
              <div className="card__icon">🛡️</div>
              <h3>Conflict-free booking</h3>
              <p>Pre-check availability and block double booking at API + database level.</p>
            </article>

            <article className="card">
              <div className="card__icon">🧾</div>
              <h3>Booking history</h3>
              <p>Track past reservations, cancellations, and usage patterns.</p>
            </article>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section--alt" id="how">
        <div className="section__inner split">
          <div>
            <h2>How it works</h2>
            <ol className="steps">
              <li>
                <strong>Browse</strong> resources by type, capacity, and location.
              </li>
              <li>
                <strong>Check</strong> time slots in the availability panel.
              </li>
              <li>
                <strong>Book</strong> with date, time, and purpose — get instant confirmation.
              </li>
            </ol>
            <div className="cta">
              <a className="btn btn--primary" href="catalog.html">
                Open catalog
              </a>
              <a className="btn btn--ghost" href="booking.html">
                Go to booking
              </a>
            </div>
          </div>

          <div className="infoBox" id="resources">
            <div className="infoBox__title">Resource types</div>
            <div className="tags">
              <span className="tag">Labs</span>
              <span className="tag">Seminar halls</span>
              <span className="tag">Sports facilities</span>
              <span className="tag">Computer rooms</span>
              <span className="tag">Study zones</span>
            </div>
            <div className="infoBox__note">Tip: add capacity & location filters — looks “enterprise”.</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="section__inner">
          <div className="section__head">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about booking campus resources.</p>
          </div>

          <div className="faq">
            <details>
              <summary>How does the system prevent double bookings?</summary>
              <p>
                The platform checks availability in real time before confirming any request.
                Once a time slot is requested or approved, it becomes unavailable to others,
                ensuring that no two bookings can overlap.
              </p>
            </details>

            <details>
              <summary>Who can make a booking?</summary>
              <p>
                Students can request bookings for available resources.
                All requests are reviewed and approved by staff to ensure fair and appropriate usage.
              </p>
            </details>

            <details>
              <summary>Do I need an account to use the system?</summary>
              <p>
                Yes. Booking requires a campus account so we can track reservations,
                manage approvals, and provide a personal booking history.
              </p>
            </details>

            <details>
              <summary>What types of resources can be booked?</summary>
              <p>
                You can book laboratories, seminar halls, sports facilities, computer rooms,
                and other shared campus spaces depending on availability.
              </p>
            </details>

            <details>
              <summary>Can I view my past and upcoming bookings?</summary>
              <p>
                Yes. Each user has access to a booking history page where past,
                current, and upcoming reservations are displayed in one place.
              </p>
            </details>
          </div>
          <div class="finalCta">
            <div>
              <h3>Ready to demo?</h3>
              <p>Open the catalog and book a lab in under 10 seconds.</p>
            </div>
            <a class="btn btn--primary btn--lg" href="catalog.html">Start booking</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__inner">
          <span>© 2026 Smart Campus Booking</span>
          <span className="footer__muted">Demo landing for competition</span>
        </div>
      </footer>
    </>
  );
}
