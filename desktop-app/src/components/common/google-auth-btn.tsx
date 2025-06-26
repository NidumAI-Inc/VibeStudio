import { FaGoogle } from "react-icons/fa";

import { useGoogleAuthMutate } from "@/hooks/use-user";

function GoogleAuthBtn() {
  const { mutate, isPending } = useGoogleAuthMutate()

  return (
    <button
      type='button'
      onClick={() => mutate()}
      disabled={isPending}
      className='dc w-full rounded-md border border-border bg-card hover:bg-muted px-4 py-2 transition-colors duration-200 shadow-sm cursor-pointer'
    >
      <FaGoogle />
      Continue with Google
    </button>
  )
}

export default GoogleAuthBtn
