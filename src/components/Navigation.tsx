import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

export function Navigation() {
  return (
    <nav className="border-b bg-[#6B6B45] backdrop-blur supports-[backdrop-filter]:bg-[#6B6B45]">
      <div className="container flex h-16 items-center px-4">
        <div className="flex gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-2">
            <Logo />
          </a>
          <div className="hidden gap-6 md:flex">
            <a href="#features" className="flex items-center text-lg font-medium text-white/90 transition-colors hover:text-white">
              Why Choose Me
            </a>
            <a href="#testimonials" className="flex items-center text-lg font-medium text-white/90 transition-colors hover:text-white">
              Student Stories
            </a>
            <a href="#pricing" className="flex items-center text-lg font-medium text-white/90 transition-colors hover:text-white">
              Pricing
            </a>
          </div>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button className="bg-white text-black hover:bg-white/90 transition-colors">
            Book a Trial
          </Button>
        </div>
      </div>
    </nav>
  );
}