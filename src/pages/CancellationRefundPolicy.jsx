import { Helmet } from "react-helmet-async";
const CancellationRefundPolicy = () => {
  return (
   
  <div className="mt-[30%] lg:mt-[5%] max-w-4xl mx-auto px-6 py-10">
    <Helmet>
      <title>Cancellation & Refund Policy | Books Emporium</title>
      <meta name="description" content="Read the cancellation and refund policy of Books Emporium to understand your rights and our procedures." />
      <meta name="keywords" content="Cancellation policy, Refund policy, Books Emporium, Online bookstore, Customer rights" />
    </Helmet>

    <h1 className="text-3xl font-bold mb-2 text-center">
      Cancellation &amp; Refund Policy
    </h1>
    <p className="text-sm text-gray-600 mb-6 text-center">
      Last updated on Jul 29th 2025
    </p>
    <p className="mb-6">
      At <strong>Books Emporium</strong>, we value your satisfaction and strive
      to provide the most convenient experience for purchasing used books. Our
      cancellation and refund policy has been created to ensure clarity,
      transparency, and fair treatment to all our customers. Please review the
      terms below carefully.
    </p>
    <ul className="list-disc list-inside space-y-4">
      <li>
        <strong>Cancellation Window:</strong> Orders can be canceled only if the
        cancellation request is made within <strong>48 hours</strong> (2 days)
        of placing the order. Once the order has been processed, packed, or
        dispatched for shipping, we regret that we are unable to cancel it.
      </li>
      <li>
        <strong>Exceptions:</strong> Cancellations are not applicable for
        perishable or time-sensitive items (e.g., flowers, eatables) as these
        are handled by third-party vendors and may be prepared or dispatched
        immediately after the order is confirmed.
      </li>
      <li>
        <strong>Damaged or Defective Items:</strong> If the item you receive is
        physically damaged, defective, or significantly different from the
        description or image shown on our website, you must notify our Customer
        Service team within <strong>2 days</strong> of receiving the order. We
        may request supporting photographs or videos to process the complaint.
      </li>
      <li>
        <strong>Resolution Process:</strong> Upon receiving your complaint, we
        will initiate an investigation with the seller or warehouse team. After
        verification, if the issue is deemed valid, we will provide a
        replacement or issue a full refund as per your preference.
      </li>
      <li>
        <strong>Products with Manufacturer Warranty:</strong> If the product
        carries a manufacturer’s warranty, we recommend contacting the
        manufacturer directly for any repair, replacement, or servicing claims.
      </li>
      <li>
        <strong>Refund Eligibility:</strong> Refunds are only applicable if the
        product qualifies under the above conditions. We do not offer refunds
        for buyer’s remorse, change of mind, or if the product condition is as
        described but not meeting subjective expectations.
      </li>
      <li>
        <strong>Refund Timeline &amp; Method:</strong> Once a refund is
        approved, we initiate the refund process within{" "}
        <strong>3–4 business days</strong>. The refund amount will be credited
        back to the original mode of payment — whether it’s a debit/credit card,
        UPI, wallet, or net banking.
      </li>
      <li>
        <strong>Refund Confirmation:</strong> A confirmation email will be sent
        to your registered email ID with details of the refund transaction.
        Depending on your bank, it may take additional time (typically 5–7
        business days) for the amount to reflect in your account.
      </li>
      <li>
        <strong>Customer Support:</strong> For any issues related to
        cancellation, returns, or refunds, you may contact our support team at
        <a
          href="mailto:support@booksemporium.in"
          className="text-blue-600 underline"
        >
          support@booksemporium.in
        </a>{" "}
        or call us at{" "}
        <a href="tel:+917598241312" className="text-blue-600 underline">
          7598241312
        </a>
        . We are happy to assist you.
      </li>
    </ul>
  </div>


  );
};

export default CancellationRefundPolicy;
