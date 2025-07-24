import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { LoginForm } from "@/components/login-form"
import { buttonVariants } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { auth } from "@/server/auth"


export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default async function AuthenticationPage() {
    const session = await auth();

    if (session) {
      redirect("/dashboard");
    }
  return (
    // The main container now uses flexbox by default for small screens (phone),
    // stacking content vertically and centering it.
    // On medium screens (md:grid), it switches to a grid layout.
    <div className="relative flex  flex-col items-center justify-center min-h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

      {/* Sign Up Link: Visible on small screens, hidden on medium and up */}
      <Link
        href="/signup"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute top-4 right-4 md:hidden"
        )}
      >
        Sign Up
      </Link>

      {/* Image and Quote Section: Hidden by default, shown on large screens */}
  
  
      <div className="relative hidden h-full flex-col bg-primary/5 p-10 text-primary dark:border-r lg:flex">
        {/* Consider if 'bg-primary/5' on both parent and absolute inset is necessary. */}
        <div className="absolute inset-0 bg-primary/5" />
        <div className="flex items-center gap-2 group z-20">
          <Link href="/" className="flex items-center gap-2 text-xl font-medium tracking-tight">
            <Image src="/logo.png" alt="Staged" className="  rotate-90 group-hover:rotate-[80deg] transition-transform duration-300" width={35} height={35} />
            Staged
          </Link>
        </div>
        <div className="relative z-20  mt-auto">
          <blockquote className="leading-normal text-balance">
            &ldquo;Before Staged, client communication felt like a constant uphill battle. Now, everything from file sharing to feedback rounds is incredibly smooth. It's truly helped us deliver projects faster and keep our clients much happier. This tool just works.&rdquo; — Sarah Miller
          </blockquote>
        </div>
      </div>

      {/* Login Form Section */}
      {/* Added responsive padding (p-4 sm:p-8) and full width (w-full) for better layout on all screen sizes */}
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 lg:p-8 w-full">
        <div className="mx-auto flex w-full flex-col justify-center gap-6 sm:w-[350px]">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back!
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign back in with your Google account
            </p>
          </div>
          <LoginForm />
          <p className="text-muted-foreground px-8 text-center text-sm">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}