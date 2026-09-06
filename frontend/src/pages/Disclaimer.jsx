import React from "react";
import "../styles/Policy.css";

const Disclaimer = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <span className="policy-icon">⚠️</span>
          <h1>Disclaimer</h1>
          <p>Last updated: August 2025</p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>📌 General Information</h2>
            <p>
              The information provided on ShopNest is for general informational
              purposes only. All information on the site is provided in good
              faith, however we make no representation or warranty of any kind,
              express or implied, regarding the accuracy, adequacy, validity,
              reliability, availability, or completeness of any information on
              the site.
            </p>
          </section>

          <section className="policy-section">
            <h2>🛍️ Product Descriptions</h2>
            <p>
              ShopNest attempts to be as accurate as possible with product
              descriptions, images, and pricing. However, we do not warrant that
              product descriptions or other content on this site are accurate,
              complete, reliable, or error-free. Product colors may vary slightly
              due to monitor display settings.
            </p>
          </section>

          <section className="policy-section">
            <h2>🔗 External Links</h2>
            <p>
              Our website may contain links to third-party websites. These links
              are provided for your convenience only. We have no control over
              the content of those sites and accept no responsibility for them or
              for any loss or damage that may arise from your use of them.
            </p>
          </section>

          <section className="policy-section">
            <h2>💸 Pricing & Availability</h2>
            <p>
              Prices and availability of products are subject to change without
              notice. We reserve the right to modify or discontinue any product
              at any time without prior notice. ShopNest shall not be liable to
              you or any third party for any modification, price change,
              suspension, or discontinuance of service.
            </p>
            <div className="policy-highlight">
              <span>⚡</span>
              <p>
                In case of a pricing error, we reserve the right to cancel any
                orders placed at the incorrect price and will notify you immediately.
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>🔒 Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, ShopNest shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, including but not limited to loss of profits,
              data, or goodwill, arising out of or in connection with your use
              of our platform.
            </p>
          </section>

          <section className="policy-section">
            <h2>📋 Changes to this Disclaimer</h2>
            <p>
              We reserve the right to update this disclaimer at any time. Changes
              will be reflected on this page with a new "last updated" date. Your
              continued use of our services after any changes constitutes your
              acceptance of the updated disclaimer.
            </p>
          </section>

          <section className="policy-section">
            <h2>📞 Contact Us</h2>
            <p>
              If you have any questions about this disclaimer, please contact us
              at{" "}
              <a href="mailto:legal@shopnest.in">legal@shopnest.in</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
