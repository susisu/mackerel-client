import type { ApiClient, ApiOptions } from "./api.ts";
import type { Extends } from "./types.ts";
import { assertType } from "./types.ts";

assertType<Extends<Dashboard, CreateDashboardInput>>(true);

export type Dashboard = {
  id: string;
  title: string;
  memo: string;
  urlPath: string;
  widgets: DashboardWidget[];
  createdAt: Date;
  updatedAt: Date;
};

export type DashboardWidget =
  | DashboardGraphWidget
  | DashboardValueWidget
  | DashboardMarkdownWidget
  | DashboardAlertStatusWidget;

type BaseDashboardWidget = {
  title: string;
  layout: DashboardWidgetLayout;
};

export type DashboardGraphWidget =
  & BaseDashboardWidget
  & {
    type: "graph";
    graph: DashboardGraphWidgetGraph;
    xRange: DashboardGraphWidgetXRange | undefined;
    yRange: DashboardGraphWidgetYRange | undefined;
    referenceLines: DashboardGraphWidgetReferenceLine[];
  };

export type DashboardValueWidget =
  & BaseDashboardWidget
  & {
    type: "value";
    metric: DashboardValueWidgetMetric;
    fractionSize: number | undefined;
    suffix: string | undefined;
    formatRules: DashboardValueWidgetFormatRule[];
  };

export type DashboardMarkdownWidget =
  & BaseDashboardWidget
  & {
    type: "markdown";
    markdown: string;
  };

export type DashboardAlertStatusWidget =
  & BaseDashboardWidget
  & {
    type: "alertStatus";
    roleFullname: string | undefined;
  };

export type DashboardWidgetLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DashboardGraphWidgetGraph =
  | DashboardGraphWidgetHostGraph
  | DashboardGraphWidgetRoleGraph
  | DashboardGraphWidgetServiceGraph
  | DashboardGraphWidgetExpressionGraph
  | DashboardGraphWidgetQueryGraph
  | DashboardGraphWidgetUnknownGraph;

export type DashboardGraphWidgetHostGraph = {
  type: "host";
  hostId: string;
  graphName: string;
};

export type DashboardGraphWidgetRoleGraph = {
  type: "role";
  roleFullname: string;
  graphName: string;
  isStacked: boolean;
};

export type DashboardGraphWidgetServiceGraph = {
  type: "service";
  serviceName: string;
  graphName: string;
};

export type DashboardGraphWidgetExpressionGraph = {
  type: "expression";
  expression: string;
};

export type DashboardGraphWidgetQueryGraph = {
  type: "query";
  query: string;
  legend: string;
};

export type DashboardGraphWidgetUnknownGraph = {
  type: "unknown";
};

export type DashboardGraphWidgetXRange =
  | DashboardGraphWidgetXRangeRelative
  | DashboardGraphWidgetXRangeAbsolute;

export type DashboardGraphWidgetXRangeRelative = {
  type: "relative";
  periodSeconds: number;
  offsetSeconds: number;
};

export type DashboardGraphWidgetXRangeAbsolute = {
  type: "absolute";
  from: Date;
  to: Date;
};

export type DashboardGraphWidgetYRange = {
  min: number | undefined;
  max: number | undefined;
};

export type DashboardGraphWidgetReferenceLine = {
  label: string;
  value: number;
};

export type DashboardValueWidgetMetric =
  | DashboardValueWidgetHostMetric
  | DashboardValueWidgetServiceMetric
  | DashboardValueWidgetExpressionMetric
  | DashboardValueWidgetQueryMetric
  | DashboardValueWidgetUnknownMetric;

export type DashboardValueWidgetHostMetric = {
  type: "host";
  hostId: string;
  metricName: string;
};

export type DashboardValueWidgetServiceMetric = {
  type: "service";
  serviceName: string;
  metricName: string;
};

export type DashboardValueWidgetExpressionMetric = {
  type: "expression";
  expression: string;
};

export type DashboardValueWidgetQueryMetric = {
  type: "query";
  query: string;
  legend: string;
};

export type DashboardValueWidgetUnknownMetric = {
  type: "unknown";
};

export type DashboardValueWidgetFormatRule = {
  name: string;
  condition: {
    operator: DashboardValueWidgetFormatRuleOperator;
    threshold: number;
  };
};

export type DashboardValueWidgetFormatRuleOperator = ">" | "<";

export type CreateDashboardInput = Readonly<{
  title: string;
  memo?: string | undefined;
  urlPath: string;
  widgets?: readonly CreateDashboardInputWidget[] | undefined;
}>;

export type CreateDashboardInputWidget =
  | CreateDashboardInputGraphWidget
  | CreateDashboardInputValueWidget
  | CreateDashboardInputMarkdownWidget
  | CreateDashboardInputAlertStatusWidget;

type BaseCreateDashboardInputWidget = Readonly<{
  title?: string | undefined;
  layout?: CreateDashboardInputWidgetLayout | undefined;
}>;

export type CreateDashboardInputGraphWidget =
  & BaseCreateDashboardInputWidget
  & Readonly<{
    type: "graph";
    graph: CreateDashboardInputGraphWidgetGraph;
    xRange?: CreateDashboardInputGraphWidgetXRange | undefined;
    yRange?: CreateDashboardInputGraphWidgetYRange | undefined;
    referenceLines?: readonly CreateDashboardInputGraphWidgetReferenceLine[] | undefined;
  }>;

export type CreateDashboardInputValueWidget =
  & BaseCreateDashboardInputWidget
  & Readonly<{
    type: "value";
    metric: CreateDashboardInputValueWidgetMetric;
    fractionSize?: number | undefined;
    suffix?: string | undefined;
    formatRules?: readonly CreateDashboardInputValueWidgetFormatRule[] | undefined;
  }>;

export type CreateDashboardInputMarkdownWidget =
  & BaseCreateDashboardInputWidget
  & Readonly<{
    type: "markdown";
    markdown: string;
  }>;

export type CreateDashboardInputAlertStatusWidget =
  & BaseCreateDashboardInputWidget
  & Readonly<{
    type: "alertStatus";
    roleFullname: string | undefined;
  }>;

export type CreateDashboardInputWidgetLayout = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export type CreateDashboardInputGraphWidgetGraph =
  | CreateDashboardInputGraphWidgetHostGraph
  | CreateDashboardInputGraphWidgetRoleGraph
  | CreateDashboardInputGraphWidgetServiceGraph
  | CreateDashboardInputGraphWidgetExpressionGraph
  | CreateDashboardInputGraphWidgetQueryGraph
  | CreateDashboardInputGraphWidgetUnknownGraph;

export type CreateDashboardInputGraphWidgetHostGraph = Readonly<{
  type: "host";
  hostId: string;
  graphName: string;
}>;

export type CreateDashboardInputGraphWidgetRoleGraph = Readonly<{
  type: "role";
  roleFullname: string;
  graphName: string;
  isStacked?: boolean | undefined;
}>;

export type CreateDashboardInputGraphWidgetServiceGraph = Readonly<{
  type: "service";
  serviceName: string;
  graphName: string;
}>;

export type CreateDashboardInputGraphWidgetExpressionGraph = Readonly<{
  type: "expression";
  expression: string;
}>;

export type CreateDashboardInputGraphWidgetQueryGraph = Readonly<{
  type: "query";
  query: string;
  legend: string;
}>;

export type CreateDashboardInputGraphWidgetUnknownGraph = Readonly<{
  type: "unknown";
}>;

export type CreateDashboardInputGraphWidgetXRange =
  | CreateDashboardInputGraphWidgetXRangeRelative
  | CreateDashboardInputGraphWidgetXRangeAbsolute;

export type CreateDashboardInputGraphWidgetXRangeRelative = Readonly<{
  type: "relative";
  periodSeconds: number;
  offsetSeconds: number;
}>;

export type CreateDashboardInputGraphWidgetXRangeAbsolute = Readonly<{
  type: "absolute";
  from: Date;
  to: Date;
}>;

export type CreateDashboardInputGraphWidgetYRange = Readonly<{
  min?: number | undefined;
  max?: number | undefined;
}>;

export type CreateDashboardInputGraphWidgetReferenceLine = Readonly<{
  label: string;
  value: number;
}>;

export type CreateDashboardInputValueWidgetMetric =
  | CreateDashboardInputValueWidgetHostMetric
  | CreateDashboardInputValueWidgetServiceMetric
  | CreateDashboardInputValueWidgetExpressionMetric
  | CreateDashboardInputValueWidgetQueryMetric
  | CreateDashboardInputValueWidgetUnknownMetric;

export type CreateDashboardInputValueWidgetHostMetric = Readonly<{
  type: "host";
  hostId: string;
  metricName: string;
}>;

export type CreateDashboardInputValueWidgetServiceMetric = Readonly<{
  type: "service";
  serviceName: string;
  metricName: string;
}>;

export type CreateDashboardInputValueWidgetExpressionMetric = Readonly<{
  type: "expression";
  expression: string;
}>;

export type CreateDashboardInputValueWidgetQueryMetric = Readonly<{
  type: "query";
  query: string;
  legend: string;
}>;

export type CreateDashboardInputValueWidgetUnknownMetric = Readonly<{
  type: "unknown";
}>;

export type CreateDashboardInputValueWidgetFormatRule = Readonly<{
  name?: string | undefined;
  condition: Readonly<{
    operator: DashboardValueWidgetFormatRuleOperator;
    threshold: number;
  }>;
}>;

export class DashboardsApiClient {
  private api: ApiClient;

  constructor(api: ApiClient) {
    this.api = api;
  }

  async list(options?: ApiOptions): Promise<Dashboard[]> {
    const res = await this.api.fetch<{ dashboards: RawDashboard[] }>(
      "GET",
      "/api/v0/dashboards",
      { signal: options?.signal },
    );
    return res.dashboards.map((dashboard) => fromRawDashboard(dashboard));
  }

  async get(dashboardId: string, options?: ApiOptions): Promise<Dashboard> {
    const res = await this.api.fetch<RawDashboard>(
      "GET",
      `/api/v0/dashboards/${dashboardId}`,
      { signal: options?.signal },
    );
    return fromRawDashboard(res);
  }

  async create(input: CreateDashboardInput, options?: ApiOptions): Promise<Dashboard> {
    const res = await this.api.fetch<RawDashboard, RawCreateDashboardInput>(
      "POST",
      "/api/v0/dashboards",
      {
        body: toRawCreateDashboardInput(input),
        signal: options?.signal,
      },
    );
    return fromRawDashboard(res);
  }

  async update(
    dashboardId: string,
    input: CreateDashboardInput,
    options?: ApiOptions,
  ): Promise<Dashboard> {
    const res = await this.api.fetch<RawDashboard, RawCreateDashboardInput>(
      "PUT",
      `/api/v0/dashboards/${dashboardId}`,
      {
        body: toRawCreateDashboardInput(input),
        signal: options?.signal,
      },
    );
    return fromRawDashboard(res);
  }

  async delete(dashboardId: string, options?: ApiOptions): Promise<Dashboard> {
    const res = await this.api.fetch<RawDashboard>(
      "DELETE",
      `/api/v0/dashboards/${dashboardId}`,
      {
        body: {},
        signal: options?.signal,
      },
    );
    return fromRawDashboard(res);
  }
}

type RawDashboard = {
  id: string;
  title: string;
  memo: string;
  urlPath: string;
  widgets: RawDashboardWidget[];
  createdAt: number;
  updatedAt: number;
};

type RawDashboardWidget =
  | RawDashboardGraphWidget
  | RawDashboardValueWidget
  | RawDashboardMarkdownWidget
  | RawDashboardAlertStatusWidget;

type RawBaseDashboardWidget = {
  title: string;
  layout: RawDashboardWidgetLayout;
};

type RawDashboardGraphWidget =
  & RawBaseDashboardWidget
  & {
    type: "graph";
    graph: RawDashboardGraphWidgetGraph;
    range?: RawDashboardGraphWidgetRange | null | undefined;
    valueRange: RawDashboardGraphWidgetValueRange;
    referenceLines: RawDashboardGraphWidgetReferenceLine[];
  };

type RawDashboardValueWidget =
  & RawBaseDashboardWidget
  & {
    type: "value";
    metric: RawDashboardValueWidgetMetric;
    fractionSize?: number | null | undefined;
    suffix?: string | null | undefined;
    formatRules: RawDashboardValueWidgetFormatRule[];
  };

type RawDashboardMarkdownWidget =
  & RawBaseDashboardWidget
  & {
    type: "markdown";
    markdown: string;
  };

type RawDashboardAlertStatusWidget =
  & RawBaseDashboardWidget
  & {
    type: "alertStatus";
    roleFullname: string | null;
  };

type RawDashboardWidgetLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type RawDashboardGraphWidgetGraph =
  | RawDashboardGraphWidgetHostGraph
  | RawDashboardGraphWidgetRoleGraph
  | RawDashboardGraphWidgetServiceGraph
  | RawDashboardGraphWidgetExpressionGraph
  | RawDashboardGraphWidgetQueryGraph;

type RawDashboardGraphWidgetHostGraph = {
  type: "host";
  hostId: string;
  name: string;
};

type RawDashboardGraphWidgetRoleGraph = {
  type: "role";
  roleFullname: string;
  name: string;
  isStacked?: boolean | null | undefined;
};

type RawDashboardGraphWidgetServiceGraph = {
  type: "service";
  serviceName: string;
  name: string;
};

type RawDashboardGraphWidgetExpressionGraph = {
  type: "expression";
  expression: string;
};

type RawDashboardGraphWidgetQueryGraph = {
  type: "query";
  query: string;
  legend: string;
};

type RawDashboardGraphWidgetRange =
  | RawDashboardGraphWidgetRelativeRange
  | RawDashboardGraphWidgetAbsoluteRange;

type RawDashboardGraphWidgetRelativeRange = {
  type: "relative";
  period: number;
  offset: number;
};

type RawDashboardGraphWidgetAbsoluteRange = {
  type: "absolute";
  start: number;
  end: number;
};

type RawDashboardGraphWidgetValueRange = {
  min?: number | null | undefined;
  max?: number | null | undefined;
};

type RawDashboardGraphWidgetReferenceLine = {
  label: string;
  value: number;
};

type RawDashboardValueWidgetMetric =
  | RawDashboardValueWidgetHostMetric
  | RawDashboardValueWidgetServiceMetric
  | RawDashboardValueWidgetExpressionMetric
  | RawDashboardValueWidgetQueryMetric;

type RawDashboardValueWidgetHostMetric = {
  type: "host";
  hostId: string;
  name: string;
};

type RawDashboardValueWidgetServiceMetric = {
  type: "service";
  serviceName: string;
  name: string;
};

type RawDashboardValueWidgetExpressionMetric = {
  type: "expression";
  expression: string;
};

type RawDashboardValueWidgetQueryMetric = {
  type: "query";
  query: string;
  legend: string;
};

type RawDashboardValueWidgetFormatRule = {
  name: string;
  operator: DashboardValueWidgetFormatRuleOperator;
  threshold: number;
};

function fromRawDashboard(raw: RawDashboard): Dashboard {
  return {
    id: raw.id,
    title: raw.title,
    memo: raw.memo,
    urlPath: raw.urlPath,
    widgets: raw.widgets.map((widget) => fromRawDashboardWidget(widget)),
    createdAt: new Date(raw.createdAt * 1000),
    updatedAt: new Date(raw.updatedAt * 1000),
  };
}

function fromRawDashboardWidget(raw: RawDashboardWidget): DashboardWidget {
  const base: BaseDashboardWidget = {
    title: raw.title,
    layout: raw.layout,
  };
  switch (raw.type) {
    case "graph":
      return {
        ...base,
        type: "graph",
        graph: fromRawDashboardGraphWidgetGraph(raw.graph),
        xRange: raw.range ? fromRawDashboardGraphWidgetRange(raw.range) : undefined,
        yRange: typeof raw.valueRange.min === "number" || typeof raw.valueRange.max === "number"
          ? {
            min: raw.valueRange.min ?? undefined,
            max: raw.valueRange.max ?? undefined,
          }
          : undefined,
        referenceLines: raw.referenceLines,
      };
    case "value":
      return {
        ...base,
        type: "value",
        metric: fromRawDashboardValueWidgetMetric(raw.metric),
        fractionSize: raw.fractionSize ?? undefined,
        suffix: raw.suffix ?? undefined,
        formatRules: raw.formatRules.map((rule) => ({
          name: rule.name,
          condition: {
            operator: rule.operator,
            threshold: rule.threshold,
          },
        })),
      };
    case "markdown":
      return {
        ...base,
        type: "markdown",
        markdown: raw.markdown,
      };
    case "alertStatus":
      return {
        ...base,
        type: "alertStatus",
        roleFullname: raw.roleFullname ?? undefined,
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (raw satisfies never as any).type;
      throw new Error(`Unknown widget type: ${type}`, { cause: raw });
    }
  }
}

function fromRawDashboardGraphWidgetGraph(
  raw: RawDashboardGraphWidgetGraph,
): DashboardGraphWidgetGraph {
  switch (raw.type) {
    case "host":
      return {
        type: "host",
        hostId: raw.hostId,
        graphName: raw.name,
      };
    case "role":
      return {
        type: "role",
        roleFullname: raw.roleFullname,
        graphName: raw.name,
        isStacked: raw.isStacked ?? false,
      };
    case "service":
      return {
        type: "service",
        serviceName: raw.serviceName,
        graphName: raw.name,
      };
    case "expression":
      return {
        type: "expression",
        expression: raw.expression,
      };
    case "query":
      return {
        type: "query",
        query: raw.query,
        legend: raw.legend,
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (raw satisfies never as any).type;
      throw new Error(`Unknown graph type: ${type}`, { cause: raw });
    }
  }
}

function fromRawDashboardGraphWidgetRange(
  raw: RawDashboardGraphWidgetRange,
): DashboardGraphWidgetXRange {
  switch (raw.type) {
    case "relative":
      return {
        type: "relative",
        periodSeconds: raw.period,
        offsetSeconds: raw.offset,
      };
    case "absolute":
      return {
        type: "absolute",
        from: new Date(raw.start * 1000),
        to: new Date(raw.end * 1000),
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (raw satisfies never as any).type;
      throw new Error(`Unknown range type: ${type}`, { cause: raw });
    }
  }
}

function fromRawDashboardValueWidgetMetric(
  raw: RawDashboardValueWidgetMetric,
): DashboardValueWidgetMetric {
  switch (raw.type) {
    case "host":
      return {
        type: "host",
        hostId: raw.hostId,
        metricName: raw.name,
      };
    case "service":
      return {
        type: "service",
        serviceName: raw.serviceName,
        metricName: raw.name,
      };
    case "expression":
      return {
        type: "expression",
        expression: raw.expression,
      };
    case "query":
      return {
        type: "query",
        query: raw.query,
        legend: raw.legend,
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (raw satisfies never as any).type;
      throw new Error(`Unknown metric type: ${type}`, { cause: raw });
    }
  }
}

type RawCreateDashboardInput = Readonly<{
  title: string;
  memo: string;
  urlPath: string;
  widgets: readonly RawCreateDashboardInputWidget[];
}>;

type RawCreateDashboardInputWidget =
  | RawCreateDashboardInputGraphWidget
  | RawCreateDashboardInputValueWidget
  | RawCreateDashboardInputMarkdownWidget
  | RawCreateDashboardInputAlertStatusWidget;

type RawBaseCreateDashboardInputWidget = Readonly<{
  title: string;
  layout: RawCreateDashboardInputWidgetLayout;
}>;

type RawCreateDashboardInputGraphWidget =
  & RawBaseCreateDashboardInputWidget
  & Readonly<{
    type: "graph";
    graph: RawCreateDashboardInputGraphWidgetGraph;
    range?: RawCreateDashboardInputGraphWidgetRange | undefined;
    valueRange: RawCreateDashboardInputGraphWidgetValueRange | undefined;
    referenceLines?: readonly RawCreateDashboardInputGraphWidgetReferenceLine[] | undefined;
  }>;

type RawCreateDashboardInputValueWidget =
  & RawBaseCreateDashboardInputWidget
  & Readonly<{
    type: "value";
    metric: RawCreateDashboardInputValueWidgetMetric;
    fractionSize?: number | undefined;
    suffix?: string | undefined;
    formatRules?: readonly RawCreateDashboardInputValueWidgetFormatRule[] | undefined;
  }>;

type RawCreateDashboardInputMarkdownWidget =
  & RawBaseCreateDashboardInputWidget
  & Readonly<{
    type: "markdown";
    markdown: string;
  }>;

type RawCreateDashboardInputAlertStatusWidget =
  & RawBaseCreateDashboardInputWidget
  & Readonly<{
    type: "alertStatus";
    roleFullname: string;
  }>;

type RawCreateDashboardInputWidgetLayout = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

type RawCreateDashboardInputGraphWidgetGraph =
  | RawCreateDashboardInputGraphWidgetHostGraph
  | RawCreateDashboardInputGraphWidgetRoleGraph
  | RawCreateDashboardInputGraphWidgetServiceGraph
  | RawCreateDashboardInputGraphWidgetExpressionGraph
  | RawCreateDashboardInputGraphWidgetQueryGraph;

type RawCreateDashboardInputGraphWidgetHostGraph = Readonly<{
  type: "host";
  hostId: string;
  name: string;
}>;

type RawCreateDashboardInputGraphWidgetRoleGraph = Readonly<{
  type: "role";
  roleFullname: string;
  name: string;
  isStacked?: boolean | undefined;
}>;

type RawCreateDashboardInputGraphWidgetServiceGraph = Readonly<{
  type: "service";
  serviceName: string;
  name: string;
}>;

type RawCreateDashboardInputGraphWidgetExpressionGraph = Readonly<{
  type: "expression";
  expression: string;
}>;

type RawCreateDashboardInputGraphWidgetQueryGraph = Readonly<{
  type: "query";
  query: string;
  legend: string;
}>;

type RawCreateDashboardInputGraphWidgetRange =
  | RawCreateDashboardInputGraphWidgetRelativeRange
  | RawCreateDashboardInputGraphWidgetAbsoluteRange;

type RawCreateDashboardInputGraphWidgetRelativeRange = Readonly<{
  type: "relative";
  period: number;
  offset: number;
}>;

type RawCreateDashboardInputGraphWidgetAbsoluteRange = Readonly<{
  type: "absolute";
  start: number;
  end: number;
}>;

type RawCreateDashboardInputGraphWidgetValueRange = Readonly<{
  min?: number | undefined;
  max?: number | undefined;
}>;

type RawCreateDashboardInputGraphWidgetReferenceLine = Readonly<{
  label: string;
  value: number;
}>;

type RawCreateDashboardInputValueWidgetMetric =
  | RawCreateDashboardInputValueWidgetHostMetric
  | RawCreateDashboardInputValueWidgetServiceMetric
  | RawCreateDashboardInputValueWidgetExpressionMetric
  | RawCreateDashboardInputValueWidgetQueryMetric;

type RawCreateDashboardInputValueWidgetHostMetric = Readonly<{
  type: "host";
  hostId: string;
  name: string;
}>;

type RawCreateDashboardInputValueWidgetServiceMetric = Readonly<{
  type: "service";
  serviceName: string;
  name: string;
}>;

type RawCreateDashboardInputValueWidgetExpressionMetric = Readonly<{
  type: "expression";
  expression: string;
}>;

type RawCreateDashboardInputValueWidgetQueryMetric = Readonly<{
  type: "query";
  query: string;
  legend: string;
}>;

type RawCreateDashboardInputValueWidgetFormatRule = Readonly<{
  name: string;
  operator: DashboardValueWidgetFormatRuleOperator;
  threshold: number;
}>;

function toRawCreateDashboardInput(input: CreateDashboardInput): RawCreateDashboardInput {
  return {
    title: input.title,
    memo: input.memo ?? "",
    urlPath: input.urlPath,
    widgets: input.widgets
      ? input.widgets.map((widget) => toRawCreateDashboardInputWidget(widget))
        .filter((widget): widget is RawCreateDashboardInputWidget => widget !== undefined)
      : [],
  };
}

function toRawCreateDashboardInputWidget(
  widget: CreateDashboardInputWidget,
): RawCreateDashboardInputWidget | undefined {
  const base: RawBaseCreateDashboardInputWidget = {
    title: widget.title ?? "",
    layout: widget.layout ?? { x: 0, y: 0, width: 6, height: 6 },
  };
  switch (widget.type) {
    case "graph":
      if (widget.graph.type === "unknown") {
        return undefined;
      }
      return {
        ...base,
        type: "graph",
        graph: toRawCreateDashboardInputGraphWidgetGraph(widget.graph),
        range: widget.xRange ? toRawCreateDashboardInputGraphWidgetRange(widget.xRange) : undefined,
        valueRange: widget.yRange,
        referenceLines: widget.referenceLines,
      };
    case "value":
      if (widget.metric.type === "unknown") {
        return undefined;
      }
      return {
        ...base,
        type: "value",
        metric: toRawCreateDashboardInputValueWidgetMetric(widget.metric),
        fractionSize: widget.fractionSize,
        suffix: widget.suffix,
        formatRules: widget.formatRules
          ? widget.formatRules.map((rule) => ({
            name: rule.name ?? "",
            operator: rule.condition.operator,
            threshold: rule.condition.threshold,
          }))
          : undefined,
      };
    case "markdown":
      return {
        ...base,
        type: "markdown",
        markdown: widget.markdown,
      };
    case "alertStatus":
      if (widget.roleFullname === undefined) {
        return undefined;
      }
      return {
        ...base,
        type: "alertStatus",
        roleFullname: widget.roleFullname,
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (widget satisfies never as any).type;
      throw new Error(`Unknown widget type: ${type}`, { cause: widget });
    }
  }
}

function toRawCreateDashboardInputGraphWidgetGraph(
  graph: Exclude<CreateDashboardInputGraphWidgetGraph, { type: "unknown" }>,
): RawCreateDashboardInputGraphWidgetGraph {
  switch (graph.type) {
    case "host":
      return {
        type: "host",
        hostId: graph.hostId,
        name: graph.graphName,
      };
    case "role":
      return {
        type: "role",
        roleFullname: graph.roleFullname,
        name: graph.graphName,
        isStacked: graph.isStacked,
      };
    case "service":
      return {
        type: "service",
        serviceName: graph.serviceName,
        name: graph.graphName,
      };
    case "expression":
      return {
        type: "expression",
        expression: graph.expression,
      };
    case "query":
      return {
        type: "query",
        query: graph.query,
        legend: graph.legend,
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (graph satisfies never as any).type;
      throw new Error(`Unknown graph type: ${type}`, { cause: graph });
    }
  }
}

function toRawCreateDashboardInputGraphWidgetRange(
  xRange: CreateDashboardInputGraphWidgetXRange,
): RawCreateDashboardInputGraphWidgetRange {
  switch (xRange.type) {
    case "relative":
      return {
        type: "relative",
        period: xRange.periodSeconds,
        offset: xRange.offsetSeconds,
      };
    case "absolute":
      return {
        type: "absolute",
        start: Math.floor(xRange.from.getTime() / 1000),
        end: Math.floor(xRange.to.getTime() / 1000),
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (xRange satisfies never as any).type;
      throw new Error(`Unknown xRange type: ${type}`, { cause: xRange });
    }
  }
}

function toRawCreateDashboardInputValueWidgetMetric(
  metric: Exclude<CreateDashboardInputValueWidgetMetric, { type: "unknown" }>,
): RawCreateDashboardInputValueWidgetMetric {
  switch (metric.type) {
    case "host":
      return {
        type: "host",
        hostId: metric.hostId,
        name: metric.metricName,
      };
    case "service":
      return {
        type: "service",
        serviceName: metric.serviceName,
        name: metric.metricName,
      };
    case "expression":
      return {
        type: "expression",
        expression: metric.expression,
      };
    case "query":
      return {
        type: "query",
        query: metric.query,
        legend: metric.legend,
      };
    default: {
      // deno-lint-ignore no-explicit-any
      const type = (metric satisfies never as any).type;
      throw new Error(`Unknown metric type: ${type}`, { cause: metric });
    }
  }
}
