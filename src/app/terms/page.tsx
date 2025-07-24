import type { Metadata } from 'next';
import { BackButton } from '@/components/back-button';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <BackButton />
        <div className="prose prose-indigo mx-auto mt-8">
          <h1>Terms of Service</h1>
          <p>
            Welcome to Staged! These terms and conditions outline the rules and
            regulations for the use of Staged's Website, located at staged.com.
          </p>
          <p>
            By accessing this website we assume you accept these terms and
            conditions. Do not continue to use Staged if you do not agree to
            take all of the terms and conditions stated on this page.
          </p>

          <h2>Cookies</h2>
          <p>
            We employ the use of cookies. By accessing Staged, you agreed to use
            cookies in agreement with the Staged's Privacy Policy.
          </p>
          <p>
            Most interactive websites use cookies to let us retrieve the user's
            details for each visit. Cookies are used by our website to enable
            the functionality of certain areas to make it easier for people
            visiting our website. Some of our affiliate/advertising partners may
            also use cookies.
          </p>

          <h2>License</h2>
          <p>
            Unless otherwise stated, Staged and/or its licensors own the
            intellectual property rights for all material on Staged. All
            intellectual property rights are reserved. You may access this from
            Staged for your own personal use subjected to restrictions set in
            these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from Staged</li>
            <li>Sell, rent or sub-license material from Staged</li>
            <li>Reproduce, duplicate or copy material from Staged</li>
            <li>Redistribute content from Staged</li>
          </ul>

          <h2>iFrames</h2>
          <p>
            Without prior approval and written permission, you may not create
            frames around our Webpages that alter in any way the visual
            presentation or appearance of our Website.
          </p>

          <h2>Content Liability</h2>
          <p>
            We shall not be hold responsible for any content that appears on
            your Website. You agree to protect and defend us against all claims
            that is rising on your Website. No link(s) should appear on any
            Website that may be interpreted as libelous, obscene or criminal, or
            which infringes, otherwise violates, or advocates the infringement
            or other violation of, any third party rights.
          </p>

          <h2>Your Privacy</h2>
          <p>Please read our Privacy Policy</p>

          <h2>Reservation of Rights</h2>
          <p>
            We reserve the right to request that you remove all links or any
            particular link to our Website. You approve to immediately remove
            all links to our Website upon request. We also reserve the right to
            amen these terms and conditions and it's linking policy at any time.
            By continuously linking to our Website, you agree to be bound to and
            follow these linking terms and conditions.
          </p>

          <h2>Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all
            representations, warranties and conditions relating to our website
            and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul>
            <li>
              limit or exclude our or your liability for death or personal
              injury;
            </li>
            <li>
              limit or exclude our or your liability for fraud or fraudulent
              misrepresentation;
            </li>
            <li>
              limit any of our or your liabilities in any way that is not
              permitted under applicable law; or
            </li>
            <li>
              exclude any of our or your liabilities that may not be excluded
              under applicable law.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
