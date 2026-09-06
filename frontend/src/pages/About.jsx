import React from "react";
import "../styles/About.css";

const About = () => {
  const team = [
    { name: "Rahul Sharma", role: "Founder & CEO", emoji: "👨‍💼" },
    { name: "Priya Mehta", role: "Head of Design", emoji: "👩‍🎨" },
    { name: "Amit Patel", role: "Lead Developer", emoji: "👨‍💻" },
    { name: "Sneha Joshi", role: "Customer Success", emoji: "👩‍💼" },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-badge">🏪 About Us</span>
          <h1>
            We are <span className="brand-highlight">ShopNest</span>
          </h1>
          <p>
            Your one-stop destination for premium products at unbeatable prices.
            Born in India, built for India — we deliver quality to your doorstep.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="about-section">
        <div className="about-card mission-card">
          <span className="about-icon">🎯</span>
          <h2>Our Mission</h2>
          <p>
            To make quality shopping accessible and affordable for every Indian
            household. We curate the best products across categories — from
            electronics to fashion — and deliver them with speed, care, and
            transparency.
          </p>
        </div>
        <div className="about-card vision-card">
          <span className="about-icon">🚀</span>
          <h2>Our Vision</h2>
          <p>
            To become India's most trusted e-commerce platform by 2030,
            empowering local sellers and giving customers a world-class shopping
            experience from the comfort of their homes.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="astat">
          <span className="astat-num">10K+</span>
          <span className="astat-label">Products Listed</span>
        </div>
        <div className="astat">
          <span className="astat-num">50K+</span>
          <span className="astat-label">Happy Customers</span>
        </div>
        <div className="astat">
          <span className="astat-num">4.9★</span>
          <span className="astat-label">Average Rating</span>
        </div>
        <div className="astat">
          <span className="astat-num">500+</span>
          <span className="astat-label">Sellers Onboard</span>
        </div>
      </section>

      {/* Team */}
      <section className="about-team">
        <h2 className="section-title">Meet the Team</h2>
        <p className="section-sub">The people powering ShopNest</p>
        <div className="team-grid">
          {team.map((member, i) => (
            <div className="team-card" key={i}>
              <div className="team-avatar">{member.emoji}</div>
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="values-grid">
          <div className="value-item">
            <span>🛡️</span>
            <h4>Trust & Safety</h4>
            <p>Every product is verified. Your data is always secure.</p>
          </div>
          <div className="value-item">
            <span>⚡</span>
            <h4>Fast Delivery</h4>
            <p>Same-day delivery in major cities. Express options available.</p>
          </div>
          <div className="value-item">
            <span>💎</span>
            <h4>Premium Quality</h4>
            <p>We never compromise on the quality of products we list.</p>
          </div>
          <div className="value-item">
            <span>🤝</span>
            <h4>Customer First</h4>
            <p>24/7 support. Easy returns. No questions asked policy.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
