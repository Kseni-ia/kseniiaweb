import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold">Kseniia</span>
        </div>
        <nav className="flex gap-4 text-sm">
          <a href="#features" className="text-muted-foreground hover:text-primary">Features</a>
          <a href="#testimonials" className="text-muted-foreground hover:text-primary">Testimonials</a>
          <a href="#pricing" className="text-muted-foreground hover:text-primary">Pricing</a>
          <a href="#contact" className="text-muted-foreground hover:text-primary">Contact</a>
        </nav>
        <p className="text-sm text-muted-foreground">© 2024 Kseniia. All rights reserved.</p>
      </div>
    </footer>
  );
}