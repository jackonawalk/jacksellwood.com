import Link from "next/link";
import Image from "next/image";
const navItems: { [key: string]: { name: string; target?: string } } = {
  "/blog": {
    name: "writing",
  },
  "https://cloudgrapple.com": {
    name: "grapple",
    target: "_blank",
  },
};

export function Navbar() {
  return (
    <aside className="-ml-[8px] mb-16 tracking-tight">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row items-start relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row items-center space-x-0 pr-10">
            <Link
              href="/"
              className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
            >
              <Image
                src="/jack-sellwood.jpg"
                alt="Jack Sellwood"
                width={64}
                height={64}
                className="rounded-lg"
              />
            </Link>
            {Object.entries(navItems).map(([path, { name, target }]) => {
              return (
                <Link
                  key={path}
                  href={path}
                  target={target}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                >
                  {name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
