import { cn } from "@/lib/utils";

const categories = [
  { id: "generellt", label: "Generellt" },
  { id: "identitet", label: "Identitet" },
  { id: "forsvarsspel", label: "Försvarsspel" },
  { id: "omstallning-till-anfall", label: "Omställning till anfall" },
  { id: "anfallsspel", label: "Anfallsspel" },
  { id: "omstallning-till-forsvar", label: "Omställning till försvar" },
  { id: "fasta-situationer", label: "Fasta situationer" },
  { id: "matchtrupp", label: "Matchtrupp" },
];

const CategoryNav = () => {
  return (
    <nav className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border py-3">
      <div className="container">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={cn(
                "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all",
                "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
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
