// import React from "react";
// import { Link } from "react-router-dom";

// const Footer = () => {
//     return (
//         <footer style={{
//             background: '#09090b',
//             borderTop:'1px solid rgba(255,255,255,0.05)',
//             padding: '40px 20px',
//             margin: 'auto'
//         }}>
//         <div style={{
//             maxWidth: '1000px',
//             margin: 'auto',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center'
//             gap: '20px'
//         }}
//     );
// };



import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#09090b",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        padding: "40px 20px",
        margin: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div>
          <h3 style={{ color: "white", margin: 0 }}>ShopNest</h3>
          <p style={{ color: "#a1a1aa" }}>
            Your trusted online shopping destination.
          </p>
        </div>

        <div>
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: "20px",
            }}
          >
            Home
          </Link>

          <Link
            to="/shop"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            Shop
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;