// =============================================================================
// client.types.ts
// Tipagem para consumo no cliente (Next.js / React)
// Copiar para src/types/api.ts no projecto Next.js
// =============================================================================
// Gerado a partir da fonte do Worker — manter em sincronismo.
// =============================================================================

// ---------------------------------------------------------------------------
// Tipos base reutilizáveis
// ---------------------------------------------------------------------------

/** País */
export interface Country {
	id: number;
	/** Nome completo  ex: "Democratic Republic of the Congo" */
	name: string;
	/** ISO3  ex: "cod" */
	iso3: string;
	/** Shortname  ex: "Congo, DRC" */
	shortname?: string;
}

/** Tipo de desastre */
export interface DisasterType {
	id: number;
	/** Ex: "Epidemic" */
	name: string;
	/** Ex: "EP" */
	code: string;
}

/** Fonte / organização */
export interface Source {
	id: number;
	/** Ex: "World Health Organization" */
	name: string;
	/** Ex: "WHO" */
	shortname: string;
	type?: { name: string };
	homepage?: string;
}

/** Surto associado a um relatório */
export interface DisasterRef {
	id: number;
	/** Ex: "DR Congo: Ebola Outbreak - May 2026" */
	name: string;
	/** Ex: "EP-2026-000071-COD" */
	glide?: string;
	status: 'ongoing' | 'past';
	url_alias?: string;
}

/** Ficheiro/PDF em anexo */
export interface ReportFile {
	id: string;
	/** URL de download directo do PDF */
	url: string;
	/** Nome do ficheiro  ex: "sitrep-ebola-2026.pdf" */
	filename: string;
	/** Tamanho em bytes */
	filesize: number;
	description?: string;
	/** Ex: "application/pdf" */
	mimetype: string;
}

// ---------------------------------------------------------------------------
// /search — lista de relatórios
// ---------------------------------------------------------------------------

/**
 * Parâmetros para GET /search
 *
 * @example
 * // Feed principal (todos os surtos activos)
 * fetch('/search?status=ongoing')
 *
 * @example
 * // Filtrar por país e doença
 * fetch('/search?country=cod&disease=Ebola&status=ongoing')
 *
 * @example
 * // Comparação de 3 países
 * fetch('/search?country=cod&country2=ago&country3=uga')
 *
 * @example
 * // Filtrar por fonte e ano
 * fetch('/search?source=WHO&year=2024&limit=50')
 *
 * @example
 * // Paginação
 * fetch('/search?limit=20&offset=20')
 */
export interface SearchRequest {
	/** ISO3 do país principal  ex: "cod", "ago", "nga" */
	country?: string;
	/** ISO3 do 2º país (comparação)  ex: "uga" */
	country2?: string;
	/** ISO3 do 3º país (comparação)  ex: "zaf" */
	country3?: string;
	/** Palavra-chave da doença  ex: "Ebola", "Cholera", "Mpox", "Malaria" */
	disease?: string;
	/** Status do surto */
	status?: 'ongoing' | 'past';
	/** Shortname da fonte  ex: "WHO", "MSF", "UNICEF", "OCHA" */
	source?: string;
	/** Ano de publicação  ex: "2024" */
	year?: string;
	/** Número de resultados por página (default: 20, máximo: 50) */
	limit?: number;
	/** Offset para paginação (default: 0) */
	offset?: number;
}

/** Um item de relatório no feed */
export interface SearchItem {
	/** ID do relatório — usar para chamar /detail */
	id: string;
	fields: {
		/** Título do relatório */
		title: string;
		/** Data de publicação ISO 8601  ex: "2026-05-01T00:00:00+00:00" */
		'date.original': string;
		/** Nome completo do país principal */
		'primary_country.name': string;
		/** ISO3 do país principal  ex: "cod" */
		'primary_country.iso3': string;
		/** Tipo de desastre — sempre "Epidemic" neste contexto */
		'disaster_type.name'?: string;
		/** Código do tipo — sempre "EP" neste contexto */
		'disaster_type.code'?: string;
		/** Status do surto associado */
		'disaster.status'?: 'ongoing' | 'past';
		/** Shortname da organização fonte  ex: "WHO" */
		'source.shortname'?: string;
		/** URL amigável na ReliefWeb */
		url_alias?: string;
	};
}

/** Resposta do endpoint /search */
export interface SearchResponse {
	time: number;
	/** Total de resultados existentes (pode ser > count se houver mais páginas) */
	totalCount: number;
	/** Número de resultados nesta página */
	count: number;
	data: SearchItem[];
}

// ---------------------------------------------------------------------------
// /detail — conteúdo completo de um relatório
// ---------------------------------------------------------------------------

/**
 * Parâmetros para GET /detail
 *
 * @example
 * // Buscar detalhe de um relatório
 * fetch('/detail?id=4214071')
 */
export interface DetailRequest {
	/** ID numérico do relatório (obrigatório) — vem do campo `id` do /search */
	id: string;
}

/** Detalhe completo de um relatório */
export interface DetailItem {
	/** ID do relatório */
	id: string;
	fields: {
		/** Título completo */
		title: string;
		/** Corpo em texto simples (para exportação/cópia) */
		body?: string;
		/** Corpo em HTML (usar para renderizar na UI) */
		'body-html'?: string;
		/** Datas do relatório */
		date: {
			/** Data de publicação original */
			original: string;
			/** Data de criação na ReliefWeb */
			created?: string;
			/** Data de última actualização */
			changed?: string;
		};
		/** País principal */
		primary_country: Country;
		/** Todos os países mencionados */
		country?: Country[];
		/** Surtos associados (pode ter mais de um) */
		disaster?: DisasterRef[];
		/** Tipos de desastre */
		disaster_type?: DisasterType[];
		/** Organizações que publicaram/contribuíram */
		source?: Source[];
		/** Temas  ex: [{ name: "Health" }] */
		theme?: Array<{ id: number; name: string }>;
		/** Formato editorial  ex: "Situation Report", "News and Press Release" */
		format?: Array<{ id: number; name: string }>;
		/** URL amigável na ReliefWeb */
		url_alias?: string;
		/**
		 * Ficheiros em anexo (PDFs)
		 * file[0].url → link directo para download do PDF (fornecido pela ReliefWeb API)
		 */
		file?: ReportFile[];
		/** Idiomas disponíveis */
		language?: Array<{ id: number; name: string; code: string }>;
	};
}

/** Resposta do endpoint /detail */
export interface DetailResponse {
	time: number;
	count: number;
	/** Array com 1 item */
	data: DetailItem[];
}

// ---------------------------------------------------------------------------
// /disasters — surtos como eventos
// ---------------------------------------------------------------------------

/**
 * Parâmetros para GET /disasters
 *
 * @example
 * // Todos os surtos activos em África
 * fetch('/disasters')
 *
 * @example
 * // Surtos activos no Congo
 * fetch('/disasters?country=cod&status=ongoing')
 *
 * @example
 * // Surtos passados, até 50 resultados
 * fetch('/disasters?status=past&limit=50')
 */
export interface DisastersRequest {
	/** Status do surto (default: "ongoing") */
	status?: 'ongoing' | 'past';
	/** ISO3 do país  ex: "cod", "ago" */
	country?: string;
	/** Código do tipo de desastre (default: "EP" = Epidemic) */
	type?: string;
	/** Número de resultados (default: 20, máximo: 100) */
	limit?: number;
}

/** Um surto (evento) devolvido pelo /disasters */
export interface DisasterItem {
	/** ID do surto na ReliefWeb */
	id: string;
	fields: {
		/** Nome descritivo  ex: "DR Congo/Uganda: Ebola Outbreak - May 2026" */
		name: string;
		/** Status actual */
		status: 'ongoing' | 'past';
		/** Datas do surto */
		date: {
			/** Data de início do evento  ex: "2026-05-01T00:00:00+00:00" */
			event: string;
			created?: string;
		};
		/** Países afectados (pode ser mais de um — surtos transfronteiriços) */
		country?: Country[];
		/** País principal */
		primary_country?: Country;
		/** Tipos de desastre */
		type?: DisasterType[];
		/**
		 * GLIDE number — identificador único global do evento
		 * Formato: "EP-YYYY-NNNNNN-ISO3"  ex: "EP-2026-000071-COD"
		 * Útil para cruzar com bases de dados externas
		 */
		glide?: string;
		/** URL amigável na ReliefWeb */
		url_alias?: string;
	};
}

/** Resposta do endpoint /disasters */
export interface DisastersResponse {
	time: number;
	totalCount: number;
	count: number;
	data: DisasterItem[];
}

// ---------------------------------------------------------------------------
// /stats — estatísticas agregadas
// ---------------------------------------------------------------------------

/**
 * Parâmetros para GET /stats
 *
 * @example
 * // Stats globais de África
 * fetch('/stats')
 *
 * @example
 * // Comparar 3 países
 * fetch('/stats?country=cod,ago,nga')
 *
 * @example
 * // Ebola desde 2020, timeline mensal
 * fetch('/stats?disease=Ebola&year_from=2020&interval=month')
 *
 * @example
 * // Stats de um país num intervalo de anos
 * fetch('/stats?country=ago&year_from=2015&year_to=2024')
 */
export interface StatsRequest {
	/**
	 * ISO3 separados por vírgula (máximo recomendado: 3)
	 * ex: "cod,ago,uga"
	 */
	country?: string;
	/** Doenças separadas por vírgula  ex: "Ebola,Cholera" */
	disease?: string;
	/** Fontes separadas por vírgula  ex: "WHO,MSF" */
	source?: string;
	/** Ano de início  ex: "2020" */
	year_from?: string;
	/** Ano de fim  ex: "2024" */
	year_to?: string;
	/** Status dos surtos a considerar */
	status?: 'ongoing' | 'past';
	/** Granularidade da timeline (default: "year") */
	interval?: 'year' | 'month';
}

/** Item de uma faceta de termos (país, doença, fonte) */
export interface FacetItem {
	/** Valor do campo  ex: "cod", "WHO", "Ebola" */
	key: string;
	/** Contagem de documentos com este valor */
	count: number;
}

/** Item de uma faceta de timeline */
export interface TimelineFacetItem {
	/** Data no formato ISO 8601  ex: "2024-01-01T00:00:00+00:00" */
	key: string;
	/** Número de relatórios neste período */
	count: number;
}

/** Resposta do endpoint /stats */
export interface StatsResponse {
	time: number;
	/** Total de relatórios correspondentes aos filtros */
	totalCount: number;
	count: number;
	embedded: {
		facets: {
			/** Top países africanos por nº de relatórios */
			countries?: {
				type: 'term';
				data: FacetItem[];
				missing: number;
				more: boolean;
			};
			/** Top doenças por nº de relatórios */
			diseases?: {
				type: 'term';
				data: FacetItem[];
				missing: number;
				more: boolean;
			};
			/**
			 * Evolução temporal de relatórios
			 * Granularidade controlada pelo param `interval`
			 */
			timeline?: {
				type: 'date';
				data: TimelineFacetItem[];
			};
			/** Top fontes por nº de relatórios */
			sources?: {
				type: 'term';
				data: FacetItem[];
				missing: number;
				more: boolean;
			};
			/**
			 * Distribuição de SURTOS por status
			 * Vem do /disasters (não dos reports) — é o nº real de eventos
			 * ex: [{ key: "ongoing", count: 5 }, { key: "past", count: 83 }]
			 */
			status?: {
				type: 'term';
				data: FacetItem[];
				missing: number;
				more: boolean;
			};
		};
	};
}

// ---------------------------------------------------------------------------
// Erro genérico (todos os endpoints)
// ---------------------------------------------------------------------------

export interface ApiError {
	error: string;
}

// ---------------------------------------------------------------------------
// Helper: construir query string a partir de um objeto
// ---------------------------------------------------------------------------

/**
 * Converte um objecto de parâmetros numa query string
 *
 * @example
 * buildQuery({ country: 'cod', status: 'ongoing', limit: 20 })
 * // → "country=cod&status=ongoing&limit=20"
 */
export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
	return Object.entries(params)
		.filter(([, v]) => v !== undefined && v !== '')
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
		.join('&');
}
