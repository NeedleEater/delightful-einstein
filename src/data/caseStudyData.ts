import rawData from './ntea_case_study_data.json';

export interface Metadata {
  practice: string;
  location: string;
  specialty: string;
  domain: string;
  ga4_reporting_period: string;
  visibility_reporting_period: string;
  notes: string;
}

export interface Ga4MonthlyChannel {
  sessions: number;
  session_share_pct: number;
  engaged_sessions: number;
  engaged_session_share_pct: number;
  engagement_rate_pct: number;
  avg_engagement_time: string;
  avg_engagement_seconds: number;
  events_per_session: number;
  appointment_requests: number;
  appointment_request_share_pct: number;
  click_to_call: number;
  click_to_call_share_pct: number;
  session_key_event_rate_pct: number;
  month: string;
  month_label: string;
  channel: string;
  source_pdf: string;
  lead_actions: number;
  year: number;
  quarter: string;
  client_period: string;
}

export interface OrganicMonthlySummary {
  month: string;
  month_label: string;
  year: number;
  quarter: string;
  organic_sessions: number;
  organic_engaged_sessions: number;
  organic_engagement_rate_pct: number;
  organic_avg_engagement_seconds: number;
  organic_avg_engagement_time: string;
  organic_events_per_session: number;
  organic_appointment_requests: number;
  organic_click_to_call: number;
  organic_lead_actions: number;
  organic_session_key_event_rate_pct: number;
  source_pdf: string;
}

export interface VisibilityMonthlyWide {
  month: string;
  month_label: string;
  organic_traffic: number;
  organic_keywords: number;
  organic_traffic_cost: number;
  paid_traffic: number;
  paid_keywords: number;
  paid_traffic_cost: number;
}

export interface VisibilityBenchmark {
  period: string;
  start_month: string;
  end_month: string;
  month_count: number;
  avg_estimated_organic_traffic: number;
  avg_organic_keywords: number;
  avg_estimated_organic_traffic_value: number;
  traffic_change_vs_pre_client_pct: number;
  keywords_change_vs_pre_client_pct: number;
  traffic_value_change_vs_pre_client_pct: number;
}

export interface Ga4PeriodSummary {
  period: string;
  start_month: string;
  end_month: string;
  total_sessions: number;
  total_lead_actions: number;
  organic_sessions: number;
  organic_engaged_sessions: number;
  organic_lead_actions: number;
  organic_appointment_requests: number;
  organic_click_to_call: number;
  organic_share_of_sessions_pct: number;
  organic_share_of_lead_actions_pct: number;
  organic_weighted_engagement_rate_pct: number;
}

export interface KeyCallout {
  sort_order: number;
  title: string;
  month: string;
  metric: string;
  value: string;
  recommended_annotation: string;
}

export interface ChartConfig {
  section: string;
  default_view: string;
  primary_metric: string;
  interaction: string;
}

export interface CaseStudyData {
  metadata: Metadata;
  ga4_monthly_channel: Ga4MonthlyChannel[];
  organic_monthly_summary: OrganicMonthlySummary[];
  visibility_monthly_wide: VisibilityMonthlyWide[];
  visibility_benchmarks: VisibilityBenchmark[];
  ga4_period_summary: Ga4PeriodSummary[];
  key_callouts: KeyCallout[];
  chart_config: ChartConfig[];
}

export const caseStudyData = rawData as unknown as CaseStudyData;
