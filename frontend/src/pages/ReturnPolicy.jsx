import React from "react";
import "../styles/Policy.css";

const ReturnPolicy = () => {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <div className="policy-header">
          <span className="policy-icon">↩️</span>
          <h1>Return Policy</h1>
          <p>Last updated: August 2025</p>
        </div>

        <div className="policy-content">
          <section className="policy-section">
            <h2>📦 Overview</h2>
            <p>
              At ShopNest, we want you to be completely satisfied with your
              purchase. If you're not happy with an item, we offer a hassle-free
              7-day return policy from the date of delivery.
            </p>
          </section>

          <section className="policy-section">
            <h2>✅ Eligible Items for Return</h2>
            <ul>
              <li>Items must be unused and in original condition</li>
              <li>Products must be returned in original packaging with all tags</li>
              <li>Receipt or proof of purchase is required</li>
              <li>Electronics must be unopened (unless defective)</li>
              <li>Fashion items must not be washed or altered</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>❌ Non-Returnable Items</h2>
            <ul>
              <li>Perishable goods (food, flowers, plants)</li>
              <li>Personal hygiene products (once opened)</li>
              <li>Digital products and downloadable software</li>
              <li>Gift cards and vouchers</li>
              <li>Items on clearance / final sale</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>🔄 Return Process</h2>
            <ol>
              <li>Go to <strong>My Orders</strong> and select the item to return</li>
              <li>Select a reason for return and submit your request</li>
              <li>Our team will review and approve your request within 24 hours</li>
              <li>Pack the item securely and hand it to our pickup agent</li>
              <li>Refund will be processed within 5–7 business days after we receive the item</li>
            </ol>
          </section>

          <section className="policy-section">
            <h2>💰 Refunds</h2>
            <p>
              Refunds are issued to the original payment method. UPI & wallet
              payments are refunded within 3–5 business days. Bank transfers may
              take up to 7 business days.
            </p>
            <div className="policy-highlight">
              <span>💡</span>
              <p>
                For COD orders, refunds are credited as ShopNest wallet balance
                or via bank transfer (NEFT/RTGS).
              </p>
            </div>
          </section>

          <section className="policy-section">
            <h2>📞 Need Help?</h2>
            <p>
              Contact our support team at{" "}
              <a href="mailto:support@shopnest.in">support@shopnest.in</a> or
              call us at <strong>1800-XXX-XXXX</strong> (Mon–Sat, 9am–6pm IST).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
