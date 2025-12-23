import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const footerLinks = {
  main: [
    { label: "Статьи", href: "/posts" },
    { label: "Кейсы", href: "/cases" },
    { label: "Партнерки", href: "/networks" },
    { label: "Сервисы", href: "/services" },
    { label: "Блоги", href: "/blogs" },
    { label: "Конференции", href: "/events" },
  ],
  social: [
    { label: "Telegram", href: "#" },
    { label: "YouTube", href: "#" },
    { label: "Discord", href: "#" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-page mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Logo />
            <p className="t-body max-w-xs">
              Affilinko — ведущий портал про арбитраж трафика, CPA-маркетинг и интернет-заработок.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Навигация</h4>
            <ul className="space-y-2">
              {footerLinks.main.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="t-body hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Социальные сети</h4>
            <ul className="space-y-2">
              {footerLinks.social.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-body hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center t-body">
          <p>© 2025 Affilinko. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};
