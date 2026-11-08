import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Temple of No Importance handles account and site data.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 leading-relaxed">
      <h1 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        Privacy policy
      </h1>
      <p className="mt-3 text-center text-sm text-(--muted-text-color)">
        Last updated: November 8, 2026
      </p>

      <div className="mt-8 space-y-7 text-base text-(--muted-text-color) sm:text-lg">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-(--text-color)">Information this site handles</h2>
          <p>
            When you create an account, the site stores your name, email address,
            and a password hash. It also stores account changes and session
            tokens needed to authenticate you. Passwords are not stored in
            plain text. If you create or edit posts, the title, author name,
            excerpt, Markdown content, publication status, and image references
            are stored as well.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-(--text-color)">Cookies and sessions</h2>
          <p>
            The site uses HttpOnly cookies for sign-in sessions. These cookies
            are used to authenticate account and administration requests; they
            are not used for advertising. You can sign out to end your current
            session. Sessions are also revoked when the account password is
            changed or the account is deleted.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-(--text-color)">Posts and images</h2>
          <p>
            Published posts and their author names are visible to site visitors.
            Drafts are available only to administrators. Images uploaded for a
            post are processed and stored by the site, then served from the
            site. If post content links to an image hosted elsewhere, that
            provider may receive a request from your browser when the post is
            viewed.
          </p>
          <p>
            Deleting an account removes the account and its authentication
            sessions. Posts and uploaded image files are not automatically
            removed with the account, so contact the site operator to request
            their removal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-(--text-color)">How information is used</h2>
          <p>
            Account information is used to provide sign-in, account management,
            and administration features. Post and image data is used to store,
            manage, and display blog content. The application does not currently
            include advertising or analytics features. The infrastructure
            provider hosting the site may process technical request data to
            operate and secure the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-(--text-color)">Your choices and contact</h2>
          <p>
            You can update your account details or delete your account from the
            administration area. For questions or requests about account data,
            posts, or uploaded images, contact the site operator through the
            project’s <a className="underline" href="https://github.com/ThiagodePaula00/Temple-of-No-Importance" target="_blank" rel="noreferrer">GitHub repository</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
