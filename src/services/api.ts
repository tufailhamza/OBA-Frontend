import { apiCache } from '@/lib/api-cache';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ProcurementSearchFilters {
  keyword?: string;
  agency?: string;
  procurement_method?: string;
  fiscal_quarter?: string;
  job_titles?: string;
  fiscal_years?: string[];
  page?: number;
  page_size?: number;
}

export interface ProcurementRecord {
  ID: number;
  PlanID: string;
  Agency: string;
  Services_Description: string;
  Start_Date: string;
  End_Date: string;
  Procurement_Method: string;
  Fiscal_Quarter: string;
  Job_Titles: string;
  Head_Count: number;
  Fiscal_Year: string;
  Data_Source: string;
}

export interface ProcurementSearchResponse {
  records: ProcurementRecord[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface AwardRecord {
  ID: string;
  Agency: string;
  Title: string;
  Award_Date: string;
  Description: string;
  Category: string;
  Agency_Division: string | null;
  Notice_Type: string | null;
  Contact_Information: string | null;
  Selection_Method: string | null;
  Vendor_Information: string | null;
  Award_Status: string;
}

export interface AwardSearchResponse {
  records: AwardRecord[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

// Health check
export const checkHealth = async (): Promise<{ status: string; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  return response.json();
};

// Procurement search
export const searchProcurement = async (filters: ProcurementSearchFilters): Promise<ProcurementSearchResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/procurement/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filters),
  });

  if (!response.ok) {
    throw new Error(`Procurement search failed: ${response.status}`);
  }

  return response.json();
};

// Awards search
export const searchAwards = async (keyword?: string, agency?: string, page = 1, page_size = 50): Promise<AwardSearchResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/awards/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      keyword,
      agency,
      page,
      page_size,
    }),
  });

  if (!response.ok) {
    throw new Error(`Awards search failed: ${response.status}`);
  }

  return response.json();
};

// Get available agencies
export const getAgencies = async (fiscal_years?: string[]): Promise<string[]> => {
  const params = new URLSearchParams();
  if (fiscal_years) {
    fiscal_years.forEach(year => params.append('fiscal_years', year));
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/procurement/agencies?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch agencies: ${response.status}`);
  }

  const data = await response.json();
  return data.agencies;
};

// Get procurement methods
export const getProcurementMethods = async (fiscal_years?: string[]): Promise<string[]> => {
  const params = new URLSearchParams();
  if (fiscal_years) {
    fiscal_years.forEach(year => params.append('fiscal_years', year));
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/procurement/procurement-methods?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch procurement methods: ${response.status}`);
  }

  const data = await response.json();
  return data.procurement_methods;
};

// Get fiscal quarters
export const getFiscalQuarters = async (fiscal_years?: string[]): Promise<string[]> => {
  const params = new URLSearchParams();
  if (fiscal_years) {
    fiscal_years.forEach(year => params.append('fiscal_years', year));
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/procurement/fiscal-quarters?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch fiscal quarters: ${response.status}`);
  }

  const data = await response.json();
  return data.fiscal_quarters;
};

// Get job titles
export const getJobTitles = async (fiscal_years?: string[]): Promise<string[]> => {
  const params = new URLSearchParams();
  if (fiscal_years) {
    fiscal_years.forEach(year => params.append('fiscal_years', year));
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/procurement/job-titles?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch job titles: ${response.status}`);
  }

  const data = await response.json();
  return data.job_titles;
};

// Update awards data using scraper
export const updateAwardsData = async (pages: number = 20, forceRun: boolean = false): Promise<{ message: string; status: string; running?: boolean; last_run?: string }> => {
  const response = await fetch("https://nyc-procurement-scraper-3863265067.us-east1.run.app/scrape", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pages, force_run: forceRun }),
  });

  const data = await response.json();

  // Handle the case where scraper is already running
  if (data.status === 'error' && data.message?.includes('already running')) {
    return {
      status: 'running',
      message: `Scraper is already running since ${data.last_run || 'recently'}. ${forceRun ? 'Force run attempted.' : 'Use force run to override.'}`,
      running: data.running,
      last_run: data.last_run
    };
  }

  if (!response.ok) {
    throw new Error(data.message || `Failed to update awards data: ${response.status}`);
  }

  return data;
};

// Search by Plan ID for predictions
export interface PlanIdSearchResponse {
  plan_id: string;
  found: boolean;
  records: ProcurementRecord[];
  predictions: Array<{
    predicted_month: number;
    predicted_month_name: string;
    confidence: string;
    input_data: any;
  }>;
  total_records: number;
  search_message: string;
}

export interface ContractSizeSearchResponse {
  plan_id: string;
  found: boolean;
  records: Array<{
    ID: number;
    PlanID: string;
    Agency: string;
    Services_Description: string;
    Start_Date: string;
    End_Date: string;
    Procurement_Method: string;
    Fiscal_Quarter: string;
    Job_Titles: string;
    Head_Count: number;
    Fiscal_Year: string;
    Data_Source: string;
  }>;
  contract_size_predictions: Array<{
    predicted_contract_size: number;
    predicted_contract_size_formatted: string;
    confidence_lower: number;
    confidence_upper: number;
    key_factors: string[];
    error: string | null;
  }>;
  total_records: number;
  search_message: string;
}

export interface CompetitorAnalysisSearchResponse {
  plan_id: string;
  found: boolean;
  records: Array<{
    ID: number;
    PlanID: string;
    Agency: string;
    Services_Description: string;
    Start_Date: string;
    End_Date: string;
    Procurement_Method: string;
    Fiscal_Quarter: string;
    Job_Titles: string;
    Head_Count: number;
    Fiscal_Year: string;
    Data_Source: string;
  }>;
  vendor_predictions: Array<{
    prime_vendor_predicted: number;
    mwbe_vendor_predicted: number;
    prime_vendor_probability: number;
    mwbe_vendor_probability: number;
    prime_vendor_recommendations: Array<{
      vendor: string;
      probability: number;
    }>;
    mwbe_vendor_recommendations: Array<{
      vendor: string;
      probability: number;
    }>;
    error: string | null;
  }>;
  total_records: number;
  search_message: string;
}

export interface AgencyAnalysisSearchResponse {
  agency: string;
  total_budget: number;
  total_count: number;
  avg_contract_size: number;
  avg_confidence: number;
  categories: Array<{
    category_name: string;
    total_budget: number;
    total_count: number;
    budget_percentage: number;
    subcategories: Array<{
      subcategory_name: string;
      count: number;
      percentage: number;
      total_budget: number;
      budget_percentage: number;
      avg_contract_size: number;
      avg_confidence: number;
    }>;
  }>;
  summary: {
    total_categories: number;
    total_subcategories: number;
    largest_category: string;
    largest_category_budget: number;
    largest_category_percentage: number;
  };
}

export interface AgencyAnalysisErrorResponse {
  agency: string;
  total_budget: number;
  total_count: number;
  error: string;
  categories: Array<any>;
}

export type AgencyAnalysisResponse = AgencyAnalysisSearchResponse | AgencyAnalysisErrorResponse;

export const searchByPlanId = async (planId: string): Promise<PlanIdSearchResponse> => {
  const cacheKey = `plan-id-${planId}`;
  
  // Check cache first
  const cachedData = apiCache.get<PlanIdSearchResponse>(cacheKey);
  if (cachedData) {
    console.log("Using cached data for planId:", planId);
    return cachedData;
  }

  console.log("Making API request to:", `${API_BASE_URL}/api/v1/procurement/search-by-plan-id`);
  console.log("Request body:", JSON.stringify({ plan_id: planId }));
  
  // First, let's test if we can reach the backend at all
  try {
    console.log("Testing backend connectivity...");
    const healthCheck = await fetch(`${API_BASE_URL}/health`);
    console.log("Health check status:", healthCheck.status);
    console.log("Health check ok:", healthCheck.ok);
  } catch (healthError) {
    console.error("Backend health check failed:", healthError);
    throw new Error(`Cannot reach backend server at ${API_BASE_URL}. Please ensure the backend is running.`);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/procurement/search-by-plan-id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: planId }),
    });
    
    console.log("Response status:", response.status);
    console.log("Response ok:", response.ok);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // If we can't parse the error response, use the status
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("Response data:", data);
    
    // Cache the response
    apiCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const searchByContractSizePlanId = async (planId: string): Promise<ContractSizeSearchResponse> => {
  const cacheKey = `contract-size-${planId}`;
  
  // Check cache first
  const cachedData = apiCache.get<ContractSizeSearchResponse>(cacheKey);
  if (cachedData) {
    console.log("Using cached contract size data for planId:", planId);
    return cachedData;
  }

  console.log("Making Contract Size API request to:", `${API_BASE_URL}/api/v1/contract-size/search-by-plan-id`);
  console.log("Request body:", JSON.stringify({ plan_id: planId }));
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/contract-size/search-by-plan-id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: planId }),
    });
    
    console.log("Contract Size response status:", response.status);
    console.log("Contract Size response ok:", response.ok);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // If we can't parse the error response, use the status
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("Contract Size response data:", data);
    
    // Cache the response
    apiCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error("Contract Size fetch error:", error);
    throw error;
  }
};

export const searchByCompetitorPlanId = async (planId: string): Promise<CompetitorAnalysisSearchResponse> => {
  const cacheKey = `competitor-${planId}`;
  
  // Check cache first
  const cachedData = apiCache.get<CompetitorAnalysisSearchResponse>(cacheKey);
  if (cachedData) {
    console.log("Using cached competitor data for planId:", planId);
    return cachedData;
  }

  console.log("Making Competitor Analysis API request to:", `${API_BASE_URL}/api/v1/competitor-analysis/search-by-plan-id`);
  console.log("Request body:", JSON.stringify({ plan_id: planId }));
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/competitor-analysis/search-by-plan-id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: planId }),
    });
    
    console.log("Competitor Analysis response status:", response.status);
    console.log("Competitor Analysis response ok:", response.ok);
    
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch (e) {
        // If we can't parse the error response, use the status
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("Competitor Analysis response data:", data);
    
    // Cache the response
    apiCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error("Competitor Analysis fetch error:", error);
    throw error;
  }
};

export const searchByAgencyName = async (agencyName: string): Promise<AgencyAnalysisResponse> => {
  const cacheKey = `agency-analysis-${agencyName}`;
  
  // Check cache first
  const cachedData = apiCache.get<AgencyAnalysisResponse>(cacheKey);
  if (cachedData) {
    console.log("Using cached agency analysis data for agency:", agencyName);
    return cachedData;
  }

  console.log("Making API request to:", `${API_BASE_URL}/api/v1/agency-analysis/${encodeURIComponent(agencyName)}`);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/agency-analysis/${encodeURIComponent(agencyName)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Agency Analysis API response:", data);
    
    // Cache the data
    apiCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error("Agency Analysis fetch error:", error);
    throw error;
  }
};

// Model prediction
export interface PredictionRequest {
  agency: string;
  fiscal_quarter: string;
  procurement_method: string;
  start_date: string;
  end_date: string;
  headcount: number;
  services_description: string;
}

export interface PredictionResponse {
  predicted_month: number;
  predicted_month_name: string;
  confidence: string;
  input_data: PredictionRequest;
}

export const makePrediction = async (data: PredictionRequest): Promise<PredictionResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/model/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Prediction failed: ${response.status}`);
  }

  return response.json();
};
