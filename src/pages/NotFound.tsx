import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-svh items-center justify-center">
      <div className="text-center">
        <h1 className="text-primary/80 text-7xl font-bold">Oops!</h1>
        <h2 className="mt-2 text-xl">We can't seem to find the page you're looking for.</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          <code>404</code>
        </p>

        <figure>
          <img
            alt=""
            src="https://c.tenor.com/hXa7oZpXsvsAAAAC/tenor.gif"
            width={200}
            height={200}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="mx-auto rounded-xl py-6"
          />
          <figcaption className="sr-only">
            Animated reaction illustrating a missing page.
          </figcaption>
        </figure>

        <div className="flex justify-center gap-3">
          <Button onClick={() => navigate(-1)} variant="secondary" className="rounded-xl">
            Go back
          </Button>
          <Button asChild className="rounded-xl">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
