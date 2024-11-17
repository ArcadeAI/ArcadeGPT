import { signIn } from '@/app/(auth)/auth';

export default function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('github');
      }}
    >
      <button
        type="submit"
        className="flex items-center justify-center bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200"
      >
        {/* GitHub Icon */}
        <svg
          className="size-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.089 2.91.832.092-.647.35-1.089.636-1.34-2.22-.253-4.555-1.113-4.555-4.947 0-1.091.39-1.984 1.029-2.682-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.378.202 2.397.1 2.65.64.698 1.028 1.591 1.028 2.682 0 3.842-2.338 4.69-4.566 4.936.359.309.679.92.679 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.013 10.013 0 0022 12.017C22 6.484 17.523 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
        Sign in with GitHub
      </button>
    </form>
  );
}
