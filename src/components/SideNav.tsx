import { FOXY_COLORS } from "../templates/ProductTemplates";

export type SideItem = {
  key: string;
  label: string;
  color?: string;
  targetIndex: number;
};

type Props = {
  items: SideItem[];
  currentKey?: string;
  onJump: (targetIndex: number) => void;
};

export default function SideNav({ items, currentKey, onJump }: Props) {
  return (
    <aside
      className="hidden md:flex flex-col gap-2 sticky top-4 self-start"
      style={{ minWidth: 220 }}
      aria-label="Navigation des catégories"
    >
      {items.map((it) => {
        const active = it.key === currentKey;
        return (
          <button
            key={it.key}
            onClick={() => onJump(it.targetIndex)}
            className={[
              "text-left w-full rounded-lg px-3 py-2 border transition",
              "hover:shadow",
              active ? "bg-white" : "bg-[#fff8f0]"
            ].join(" ")}
            style={{
              borderColor: `${FOXY_COLORS.bleu}26`,
              color: FOXY_COLORS.bleu,
            }}
          >
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: it.color || FOXY_COLORS.orange }}
              />
              <span className="font-roboto font-semibold text-sm">
                {it.label}
              </span>
            </span>
          </button>
        );
      })}
    </aside>
  );
}
