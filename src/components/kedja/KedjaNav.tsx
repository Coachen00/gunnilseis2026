import { Link } from "react-router-dom";

interface KedjaNavItem {
  num: string;
  title: string;
  sub: string;
  href: string;
}

interface KedjaNavProps {
  items: KedjaNavItem[];
}

const KedjaNav = ({ items }: KedjaNavProps) => {
  return (
    <nav aria-label="Kedjenavigering" className="relative flex flex-col">
      <span className="absolute bottom-6 left-[21px] top-6 w-[2px] bg-kedja-green/35" aria-hidden="true" />
      {items.map((item) => {
        const linkClass = "group relative flex items-center gap-4 py-[11px] pr-[14px] text-kedja-ink";
        const content = (
          <>
            <span className="relative z-10 grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-kedja-ink text-sm font-black text-kedja-lime">
              {item.num}
            </span>
            <span className="flex flex-col">
              <span className="text-[19px] font-extrabold tracking-[-0.02em] transition-colors duration-300 ease-out group-hover:text-kedja-green">
                {item.title}
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-kedja-green">{item.sub}</span>
            </span>
          </>
        );
        return item.href.startsWith("#") ? (
          <a key={item.href} href={item.href} className={linkClass}>
            {content}
          </a>
        ) : (
          <Link key={item.href} to={item.href} className={linkClass}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
};

export default KedjaNav;
