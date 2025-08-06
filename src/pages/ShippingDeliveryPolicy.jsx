import { Helmet } from "react-helmet";


const ShippingDeliveryPolicy = () => {
  return (
   
  <div className="mt-[30%] lg:mt-[5%] max-w-4xl mx-auto px-6 py-10">
   <Helmet>
  <title>Privacy Policy | Books Emporium</title>
  <meta name="description" content="Read the privacy policy of Books Emporium to understand how we protect your data while you shop second-hand books online." />
  <meta name="keywords" content="Privacy policy, Books Emporium, Online bookstore safety, Data protection" />
</Helmet>

    <h1 className="text-3xl font-bold mb-2 text-center">
      Shipping &amp; Delivery Policy
    </h1>
    <p className="text-sm text-gray-600 mb-6 text-center">
      Last updated on Jul 29th 2025
    </p>
    <ul className="list-disc list-inside space-y-3">
      <li>
        International orders shipped via registered courier or speed post.
      </li>
      <li>
        Domestic orders shipped within 0–7 days depending on order and
        availability.
      </li>
      <li>Delivery is to the address provided by the customer.</li>
      <li>Delivery delays are subject to courier company/postal delays.</li>
      <li>Shipment confirmation is sent via email after dispatch.</li>
      <li>
        For help, contact us at{" "}
        <a href="tel:+917598241312" className="text-blue-600 underline">
          7598241312
        </a>{" "}
        or{" "}
        <a
          href="mailto:support@booksemporium.in"
          className="text-blue-600 underline"
        >
          support@booksemporium.in
        </a>
        .
      </li>
    </ul>
  </div>


  );
};

export default ShippingDeliveryPolicy;
