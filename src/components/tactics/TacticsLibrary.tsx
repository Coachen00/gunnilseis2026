import { useEffect, useMemo, useRef, useState } from "react";
import { FolderOpen, ImagePlus, Save, Trash2 } from "lucide-react";
import { listTacticsLibraryItems, removeTacticsLibraryItem, saveTacticsLibraryItem, TACTICS_LIBRARY_CATEGORIES, type TacticsLibraryCategory, type TacticsLibraryItem } from "@/lib/tacticsLibrary";

type Props = { latestImage: string | null };
const categoryEntries = Object.entries(TACTICS_LIBRARY_CATEGORIES) as [TacticsLibraryCategory, (typeof TACTICS_LIBRARY_CATEGORIES)[TacticsLibraryCategory]][];

const TacticsLibrary = ({ latestImage }: Props) => {
  const [items, setItems] = useState<TacticsLibraryItem[]>([]);
  const [category, setCategory] = useState<TacticsLibraryCategory>("anfall");
  const [folder, setFolder] = useState(TACTICS_LIBRARY_CATEGORIES.anfall.folders[0]);
  const [title, setTitle] = useState("");
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [status, setStatus] = useState("Biblioteket är lokalt på den här enheten.");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folders = TACTICS_LIBRARY_CATEGORIES[category].folders;
  const visibleItems = useMemo(() => items.filter((item) => item.category === category && item.folder === folder), [category, folder, items]);

  const refresh = async () => {
    try { setItems(await listTacticsLibraryItems()); }
    catch (error) { setStatus(error instanceof Error ? error.message : "Biblioteket kunde inte läsas."); }
  };
  useEffect(() => { void refresh(); }, []);
  useEffect(() => {
    const handleSaved = () => { setStatus("Senaste tavlan är redo att sparas i en mapp."); void refresh(); };
    window.addEventListener("tactics:image-saved", handleSaved);
    return () => window.removeEventListener("tactics:image-saved", handleSaved);
  }, []);

  const saveImage = async (image: string | null) => {
    if (!image) { setStatus("Det finns ingen bild ännu. Spara en tavla eller välj en bildfil först."); return; }
    const item: TacticsLibraryItem = { id: crypto.randomUUID(), title: title.trim() || `${TACTICS_LIBRARY_CATEGORIES[category].label} · ${folder}`, category, folder, image, savedAt: new Date().toISOString() };
    try {
      await saveTacticsLibraryItem(item);
      setTitle(""); setUploadImage(null); setStatus(`Sparad i ${TACTICS_LIBRARY_CATEGORIES[category].label} / ${folder}.`); await refresh();
    } catch (error) { setStatus(error instanceof Error ? error.message : "Filen kunde inte sparas."); }
  };

  const handleUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setStatus("Välj en bildfil, till exempel PNG eller JPG."); return; }
    const reader = new FileReader();
    reader.onload = () => setUploadImage(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => setStatus("Bildfilen kunde inte läsas.");
    reader.readAsDataURL(file);
  };
  const handleCategoryChange = (next: TacticsLibraryCategory) => { setCategory(next); setFolder(TACTICS_LIBRARY_CATEGORIES[next].folders[0]); };

  return (
    <section className="tactics-library" aria-labelledby="tactics-library-title">
      <div className="tactics-library__header"><div><span className="tactics-library__eyebrow">06 · Bibliotek</span><h2 id="tactics-library-title">Spara dina matchbilder i mappar</h2><p>{status}</p></div><FolderOpen aria-hidden="true" /></div>
      <div className="tactics-library__controls">
        <label><span>Mapp</span><select value={category} onChange={(event) => handleCategoryChange(event.target.value as TacticsLibraryCategory)}>{categoryEntries.map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>
        <label><span>Undermapp</span><select value={folder} onChange={(event) => setFolder(event.target.value)}>{folders.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
        <label className="tactics-library__title"><span>Filnamn</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Till exempel 4-3-3 mot Velebit" /></label>
        <div className="tactics-library__actions"><button type="button" onClick={() => void saveImage(latestImage)}><Save aria-hidden="true" />Spara senaste tavla</button><button type="button" onClick={() => fileInputRef.current?.click()}><ImagePlus aria-hidden="true" />Ladda upp bild</button><input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(event) => handleUpload(event.target.files?.[0])} />{uploadImage && <button type="button" className="tactics-library__save-upload" onClick={() => void saveImage(uploadImage)}>Spara uppladdad fil</button>}</div>
      </div>
      <div className="tactics-library__folder-label"><FolderOpen aria-hidden="true" />{TACTICS_LIBRARY_CATEGORIES[category].label} / {folder}<span>{visibleItems.length} filer</span></div>
      {visibleItems.length === 0 ? <div className="tactics-library__empty"><strong>Mappen är tom.</strong><span>Spara aktuell tavla eller ladda upp en bild så hamnar den här.</span></div> : <div className="tactics-library__grid">{visibleItems.map((item) => <article key={item.id} className="tactics-library__item"><img src={item.image} alt="" /><div><strong>{item.title}</strong><span>{new Date(item.savedAt).toLocaleDateString("sv-SE")}</span></div><button type="button" aria-label={`Ta bort ${item.title}`} onClick={async () => { await removeTacticsLibraryItem(item.id); setStatus("Filen är borttagen."); await refresh(); }}><Trash2 aria-hidden="true" /></button></article>)}</div>}
    </section>
  );
};

export default TacticsLibrary;
