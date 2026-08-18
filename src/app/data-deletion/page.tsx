import Link from 'next/link';

export default function DataDeletionPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-[#171717]">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold">
          SmartWills.Ai Data Deletion
        </h1>

        <p className="mt-6 leading-7 text-[#555555]">
          If you would like to delete your SmartWills.Ai account and
          associated personal data, please contact us using the email
          address below.
        </p>

        <p className="mt-4 leading-7 text-[#555555]">
          Please include the email address associated with your
          SmartWills.Ai account and state that you are requesting
          account and data deletion.
        </p>

        <p className="mt-6">
          Email:{' '}
          <a
            href="mailto:privacy@smartwills.ai"
            className="font-medium text-[#a42025] hover:underline"
          >
            privacy@smartwills.ai
          </a>
        </p>

        <p className="mt-6 text-sm text-[#777777]">
          We will process valid deletion requests in accordance with
          applicable privacy and data protection requirements.
        </p>

        <Link
          href="/"
          className="mt-10 inline-block text-sm font-semibold text-[#a42025] hover:underline"
        >
          ← Back to SmartWills.Ai
        </Link>
      </div>
    </main>
  );
}