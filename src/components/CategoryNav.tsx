import { cn } from "@/lib/utils";

const categories = [
  { id: "generellt", label: "Generellt" },
  { id: "identitet", label: "Identitet" },
  { id: "forsvarsspel", label: "Försvarsspel" },
  { id: "omstallning-till-anfall", label: "Omställning → Anfall" },
  { id: "anfallsspel", label: "Anfallsspel" },
  { id: "omstallning-till-forsvar", label: "Omställning → Försvar" },
  { id: "fasta-situationer", label: "Fasta situationer" },
  { id: "matchtrupp", label: "Matchtrupp" },
];

const CategoryNav = () => {
  return (
    <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border/60">
      <div className="container">
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 scrollbar-hide">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200",
                "text-muted-foreground hover:text-primary-foreground hover:bg-primary border border-transparent hover:border-primary"
              )}
            >
              {cat.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
