import SignIn from '@/components/custom/github-sign-in';

export default async function Page() {
  return (
    <div className="flex h-dvh w-screen items-center justify-center bg-background">
      <div className="p-0 rounded-md shadow-[0_0_15px_#ED155D] transition-shadow duration-300 hover:shadow-[0_0_25px_#ED155D]">
        <SignIn />
      </div>
    </div>
  );
}
