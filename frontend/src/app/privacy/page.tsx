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
            and a password hash. Passwords are not stored in plain text. The
            site also stores account changes and hashed refresh tokens used to
            maintain sign-in sessions. If you comment, it stores the comment
            text, its post and reply relationships, and your likes or dislikes.
            If you request a password change, the site stores your optional
            message and request status for administrator review. The new
            password is submitted only after approval and is stored as a hash.
            Administrators can also see whether an account is banned so they
            can moderate participation.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-(--text-color)">Cookies and sessions</h2>
          <p>
            The site uses HttpOnly cookies for sign-in sessions. These cookies
            are used to authenticate account and administration requests; they
            are not used for advertising. You can sign out to end your current
            session. Changing your password revokes refresh sessions. Deleting
            your account removes its sessions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-(--text-color)">Posts and images</h2>
          <p>
            Published posts and their author names are visible to site visitors.
            Comments on published posts are visible to visitors and display the
            account name used to write them. Drafts are available only to
            administrators. Images uploaded for a post are processed and stored
            by the site, then served from the site. If post content links to an
            image hosted elsewhere, that provider may receive a request from
            your browser when the post is viewed.
          </p>
          <p>
            Deleting an account removes the account, its sessions, comments it
            authored, and its votes. Replies in those comment threads are also
            removed. Posts and uploaded image files are not automatically
            removed with the account, so contact the site operator to request
            their removal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-(--text-color)">How information is used</h2>
          <p>
            Account information is used to provide sign-in and account
            management. Administrators review password change requests and
            approve or decline them; they never receive the proposed password.
            Comment data and reactions are used to display discussions.
            Administrators may remove comments or ban and unban accounts to
            moderate the community; a ban blocks account activity and revokes
            its refresh sessions. Post and image data is used to store, manage,
            and display blog content. The application does not currently include
            advertising or analytics features. The infrastructure provider
            hosting the site may process technical request data to operate and
            secure the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-(--text-color)">Your choices and contact</h2>
          <p>
            From the Account panel, you can update your name and email address,
            request a password change, or request permanent account deletion.
            After an administrator approves a password change request, you set
            the new password yourself. The site asks you to confirm before it
            deletes the account. If you cannot sign in to request a password
            change, contact the site operator through the project’s
            <a className="underline" href="https://github.com/ThiagodePaula00/Temple-of-No-Importance" target="_blank" rel="noreferrer"> GitHub repository</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
