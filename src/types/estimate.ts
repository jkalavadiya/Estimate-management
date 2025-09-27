export interface EstimateItem {
  item_id: string;
  estimate_id: string;
  subject: string;
  quantity: string;
  unit: string;
  unit_cost: string;
  total: string;
  markup: string;
  description: string;
  item_type_display_name: string;
  section_id: string;
  estimate_item_no: string;
  updated_unit_cost?: string;
}

export interface EstimateSection {
  section_id: string;
  section_name: string;
  custom_section_id: string;
  section_total: string;
  section_total_with_optional_item: string;
  description: string;
  items: EstimateItem[];
}

export interface EstimateData {
  estimate_id: string;
  title: string;
  company_estimate_id: string;
  total: string;
  estimate_date: string;
  user_company_name: string;
  current_estimate_items_total: string;
  sections: EstimateSection[];
}

export interface EstimateResponse {
  success: string;
  data: EstimateData;
}