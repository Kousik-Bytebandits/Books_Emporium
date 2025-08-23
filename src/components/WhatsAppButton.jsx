import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "../App.css";

const WhatsAppButton = () => {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=917598241312"
      className="float bounce"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <i className="fa fa-whatsapp my-float"></i>
    </a>
  );
};

export default WhatsAppButton;
