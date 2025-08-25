import { Helmet } from "react-helmet-async";

const CopyrightPolicy = () => {
  return (
    <div className="mt-[30%] lg:mt-[5%] max-w-4xl mx-auto px-6 py-10">
      <Helmet>
        <title>Copyright Policy | Books Emporium</title>
        <meta name="description" content="Read the copyright policy of Books Emporium to understand how we protect intellectual property rights." />
        <meta name="keywords" content="Copyright policy, Books Emporium, Intellectual property, Content protection" />
      </Helmet>
    <h1 className="text-3xl font-bold mb-2 text-center">Copyright Policy</h1>
    <p className="text-sm text-gray-600 mb-6 text-center">
      Last updated on Jul 29th 2025
    </p>
    <p className="mb-4">
      At <strong>Books Emporium</strong>, we respect intellectual property
      rights and expect our users to do the same. This Copyright Policy outlines
      the ownership, use, and protection of the content provided on our website.
    </p>
    <h2 className="text-xl font-semibold mt-6 mb-2">Ownership of Content</h2>
    <p className="mb-4">
      All content on this website—including but not limited to text, graphics,
      images, product listings, logos, icons, and software—is the property of
      Books Emporium or its content suppliers and is protected by applicable
      copyright laws in India and internationally.
    </p>
    <h2 className="text-xl font-semibold mt-6 mb-2">Permitted Use</h2>
    <ul className="list-disc list-inside mb-4 space-y-2">
      <li>
        You may view, download, and print portions of the content for your
        personal and non-commercial use only.
      </li>
      <li>
        Any commercial use, republication, or distribution without our written
        consent is strictly prohibited.
      </li>
      <li>
        Use of our trademarks, branding, or logos without authorization is not
        permitted.
      </li>
    </ul>
    <h2 className="text-xl font-semibold mt-6 mb-2">Copyright Infringement</h2>
    <p className="mb-4">
      We take copyright violations seriously. If you believe that any content on
      our website infringes your copyright, please contact us with:
    </p>
    <ul className="list-disc list-inside mb-4 space-y-2">
      <li>
        A description of the copyrighted work you claim has been infringed.
      </li>
      <li>Exact location (URL) of the infringing content on our website.</li>
      <li>
        Your name, contact information, and proof of ownership or authorization.
      </li>
    </ul>
    <h2 className="text-xl font-semibold mt-6 mb-2">Repeat Infringers</h2>
    <p className="mb-4">
      Users who repeatedly post or distribute infringing content may have their
      access suspended or terminated permanently, at our discretion.
    </p>
    <h2 className="text-xl font-semibold mt-6 mb-2">Policy Updates</h2>
    <p className="mb-4">
      Books Emporium may revise this Copyright Policy at any time. Please review
      this page periodically to stay informed of any changes.
    </p>
    <h2 className="text-xl font-semibold mt-6 mb-2">Contact Us</h2>
    <p>
      For copyright concerns or to report an infringement, please write to:
      <br />
      <strong>Books Emporium</strong>
      <br />
      51, Muthaliyar Street, Tiruchirappalli, TN 621314
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

export default CopyrightPolicy;
