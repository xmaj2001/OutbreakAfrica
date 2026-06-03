import { Badge } from "@/components/ui/badge";
import type { ReportSummary } from "@/lib/types";

interface Props {
  report: ReportSummary;
}

const STATUS_LABEL: Record<string, string> = {
  ongoing: "Activo",
  past: "Encerrado",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> =
  {
    ongoing: "destructive",
    past: "secondary",
  };

export function ReportCard({ report }: Props) {
  const f = report.fields;

  const date = f["date.original"]
    ? new Date(f["date.original"]).toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : null;

  const status = f["disaster.status"];

  return (
    <a
      href={`/feed/${report.id}`}
      className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 hover:border-primary/50 hover:bg-card/80 transition-colors"
    >
      {/* Topo: status + tipo de doença */}
      <div className="flex items-center gap-2 flex-wrap">
        {status && (
          <Badge variant={STATUS_VARIANT[status] ?? "secondary"}>
            {STATUS_LABEL[status] ?? status}
          </Badge>
        )}
        {f["disaster_type.name"] && (
          <Badge variant="outline" className="text-xs">
            {f["disaster_type.name"]}
          </Badge>
        )}
      </div>

      {/* Título */}
      <p className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
        {f.title}
      </p>

      {/* Rodapé: país + data + fonte */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto flex-wrap">
        <span className="flex items-center gap-1">
          <span className="uppercase font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">
            {f["primary_country.iso3"]}
          </span>
          {f["primary_country.name"]}
        </span>

        {date && <span>{date}</span>}

        {f["source.shortname"] && (
          <span className="ml-auto font-medium">{f["source.shortname"]}</span>
        )}
      </div>
    </a>
  );
}
