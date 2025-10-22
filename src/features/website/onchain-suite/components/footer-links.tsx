import Link from "next/link";

interface FooterLink {
  name: string;
  href: string;
}

interface FooterLinksProps {
  title: string;
  links: FooterLink[];
}

export function FooterLinks({ title, links }: FooterLinksProps) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
