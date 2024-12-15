"use client";
import { signIn } from "next-auth/react"; // Import from Auth.js
import Image from "next/image";
import React from "react";
import { googleImage } from "../app/assets"; // Ensure this path is correct
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5"; // Import a close icon

const SignIn: React.FC = () => {
  const router = useRouter();

  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      await signIn("google"); // Sign in with Google using Auth.js
      router.push("/chat"); // Redirect to the chat page
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  const handleClose = (): void => {
    router.push("/"); // Redirect to the homepage or another route
  };

  return (
    <div className="relative bg-[#2F2F2F] w-96 h-96 flex flex-col gap-5 items-center justify-center rounded-lg">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 duration-200 ease-in-out"
        aria-label="Close sign-in page"
      >
        <IoClose className="text-2xl" />
      </button>

      <div className="px-10 text-center">
        <p className="text-3xl font-bold tracking-wide">Welcome back</p>
        <p className="text-base tracking-wide mt-2 font-medium">
          Log in or sign up to get smarter responses, upload files and images,
          and more.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <button
          onClick={handleGoogleSignIn}
          className="border border-white/50 py-2 px-6 rounded-md text-base font-semibold flex items-center gap-1 hover:border-white text-white/80 hover:text-white duration-300 ease-in-out"
          aria-label="Sign in with Google"
        >
          <Image src={googleImage} alt="Google logo" className="w-8" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;