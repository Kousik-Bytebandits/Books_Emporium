

const PaymentPolicy = () => {
  return (
    
  <div className="max-w-4xl mx-auto px-6 py-10">
    <h1 className="text-3xl font-bold mb-2 text-center">Payment Policy</h1>
    <p className="text-sm text-gray-600 mb-6 text-center">
      Last updated on Jul 29th 2025
    </p>
    <p className="mb-4">
      At <strong>Books Emporium</strong>, we are committed to providing a secure
      and seamless payment experience. This Payment Policy outlines the
      available payment methods, transaction processing, refund timelines, and
      other key payment-related terms for purchases made on our platform.
    </p>
    <h2 className="text-xl font-semibold mt-6 mb-2">
      Accepted Payment Methods
    </h2>
    <ul className="list-disc list-inside mb-4 space-y-2">
      <li>Credit and Debit Cards (Visa, MasterCard, RuPay, etc.)</li>
      <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
      <li>Net Banking</li>
      <li>Wallets (if enabled via Razorpay)</li>
      <li>Cash on Delivery (COD) – available only for eligible PIN codes</li>
    </ul>
    <h2 className="text-xl font-semibold mt-6 mb-2">Payment Gateway</h2>
    <p className="mb-4">
      We use <strong>Razorpay</strong> as our official payment gateway partner
      to ensure all online transactions are secure and encrypted. All sensitive
      card details are processed through Razorpay’s PCI-DSS-compliant
      infrastructure and are never stored on our servers.
    </p>
    <h2 className="text-xl font-semibold mt-6 mb-2">Order Confirmation</h2>
    <p className="mb-4">
      Once your payment is successfully processed, you will receive an email
      and/or SMS confirming your order details. If you do not receive
      confirmation within 30 minutes, please contact our support team with your
      transaction ID.
    </p>
    <h2 className="text-xl font-semibold mt-6 mb-2">Failed Transactions</h2>
    <p className="mb-4">
      In the event of a failed payment, the amount will be automatically
      refunded by your bank or payment gateway within 5–7 business days. If the
      amount is debited but you did not receive an order confirmation, please
      contact us with proof of transaction.
    </p>
    <h2 className="text-xl font-semibold mt-6 mb-2">
      Refunds and Cancellations
    </h2>
    <p className="mb-4">
      Refunds for eligible returns or cancellations are processed to the
      original method of payment. Please allow 3–4 business days for Books
      Emporium to initiate the refund after approval. Additional bank processing
      time may apply.
    </p>
    <h2 className="text-xl font-semibold mt-6 mb-2">
      Security &amp; Fraud Prevention
    </h2>
    <p className="mb-4">
      We reserve the right to cancel any transaction deemed suspicious or
      fraudulent. Multiple failed payment attempts or the use of unauthorized
      cards may result in temporary or permanent account restrictions.
    </p>
    <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
    <p className="mb-4">
      For any payment-related concerns or to report a payment issue, please
      contact:
    </p>
    <p>
      Books Emporium, 51, Muthaliyar Street, Tiruchirappalli, TN 621314
      <br />
      Email:{" "}
      <a
        href="mailto:support@booksemporium.in"
        className="text-blue-600 underline"
      >
        support@booksemporium.in
      </a>
    </p>
  </div>


  );
};

export default PaymentPolicy;
