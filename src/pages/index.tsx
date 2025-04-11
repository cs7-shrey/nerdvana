import "@/styles/globals.css";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/router";

function Header() {
  return(
    <header className="flex flex-row p-4 justify-between sticky top-0 z-50 bg-background/50 backdrop-blur-3xl">
      <Link href='/'>
        <h1><Logo /></h1> 
      </Link>
      <Button className="rounded-2xl text-foreground">
        Log In
      </Button>
    </header>
  )
}

export default function Home() {
  const router = useRouter();
  return (
    <div className="relative">
      <Header />
      <div className="flex flex-row">
        <div className="px-16 py-8 flex justify-center">
          <div className="w-1/2 py-8">
            <h1 className="text-[4rem] leading-none font-bold">
              GROUP STUDY THAT&apos;S NEVER MEANT TO END 
            </h1>
            <p className="text-lg my-8 tracking-wider font-mono w-[70%]">
              Nerdvana is your go to platform for group study, making notes, video calls and organizing study material. Chat, call, study, chill.
            </p>
            <div className="my-16">
                <Button 
                  className="text-5xl px-4 py-4 h-fit w-fit tracking-wide bg-primary text-foreground"
                  onClick={() => router.push("/signup")}
                >
                  Get Started
                </Button>
            </div>
          </div>
          <div>
            <Image src={"/groupStudy.svg"} width={540} height={440} alt="group study  logo" />
          </div>
        </div>
      </div>
    </div>
  );
}
