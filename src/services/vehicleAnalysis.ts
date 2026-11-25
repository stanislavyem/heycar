
const API_BASE_URL =
  process.env.NEXT_PUBLIC_CARPAL_API_URL || 'http://127.0.0.1:8000'

export interface VehicleAnalysisInput {
  vehicle: {
    listing_id: string
    vin?: string | null
    year: number
    make: string
    model: string
    trim?: string | null
    mileage?: number | null
    asking_price: number
    currency: 'USD'
    location_region?: string | null
    seller_type?: 'dealer' | 'private' | 'unknown'
    title_status?: 'clean' | 'salvage' | 'rebuilt' | 'flood' | 'lemon' | 'unknown'
    condition_score?: number | null
    listing_updated_days?: number | null
    source_name?: string | null
  }
  buyer?: {
    maximum_budget?: number | null
    annual_mileage?: number | null
    ownership_years?: number | null
    urgency?: 'low' | 'normal' | 'high'
  }
}

export interface VehicleDecision {
  vehicle_id: string
  strategy_version: string
  recommendation: string

  market: {
    fair_market_value: string | null
    low_range: string | null
    high_range: string | null
    weighted_median: string | null
    comparable_count: number
    comparables_used: {
      comparable_id: string
      asking_price: string
      weight: number
      similarity: string
      adjusted_price: string
    }[]
    confidence: string
    warnings: string[]
  }

  mileage: {
    expected_mileage: number | null
    actual_mileage: number | null
    difference_miles: number | null
    classification: string
    adjustment: string
    rate_per_mile: string | null
    used_fallback_rate: boolean
    warnings: string[]
  }

  risk: {
    risks: {
      category: string
      severity: string
      description: string
      evidence_confidence: number
      score_penalty: number
      estimated_value_impact: string | null
      resolved: boolean
      critical_restriction: boolean
    }[]
    total_score_penalty: number
    total_value_impact: string
    critical_restriction: boolean
  }

  pricing: {
    asking_price: string
    adjusted_value: string | null
    asking_price_premium_pct: number | null
    price_position: string
    opening_offer: string | null
    target_price: string | null
    maximum_recommended_price: string | null
    buyer_budget: string | null
    budget_warning: string | null
    rationale_codes: string[]
  }

  score: {
    price: number | null
    history: number | null
    mileage: number | null
    reliability: number | null
    ownership_cost: number | null
    dealer_transparency: number | null
    overall_score: number | null
    coverage_pct: number
    category_weights_used: Record<string, number>
  }

  confidence: string
  data_warnings: string[]
  reasoning_codes: string[]
}

export interface AnalysisCreated {
  analysis_id: string
  created_at: string
  decision: VehicleDecision
}

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)

    const message =
      error?.detail instanceof Array
        ? error.detail.map((item: { msg: string }) => item.msg).join(', ')
        : typeof error?.detail === 'string'
          ? error.detail
          : `API request failed (${response.status})`

    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export async function createVehicleAnalysis(
  payload: VehicleAnalysisInput
): Promise<AnalysisCreated> {
  return apiRequest<AnalysisCreated>('/v1/analyses', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getVehicleAnalysis(analysisId: string) {
  return apiRequest<AnalysisCreated>(`/v1/analyses/${analysisId}`)
}

export async function getVehicleReport(
  analysisId: string
): Promise<VehicleDecision> {
  return apiRequest<VehicleDecision>(
    `/v1/analyses/${analysisId}/report`
  )
}


export interface ParsedVehicleListing {
  year: number | null
  make: string | null
  model: string | null
  trim: string | null
  vin: string | null
  mileage: number | null
  asking_price: number | null
  location_region: string | null
  seller_type: 'dealer' | 'private' | 'unknown'
  title_status: 'clean' | 'salvage' | 'rebuilt' | 'flood' | 'lemon' | 'unknown'
  source_name: string
}

export async function parseVehicleListing(url: string): Promise<ParsedVehicleListing> {
  return apiRequest<ParsedVehicleListing>('/v1/listings/parse', {
    method: 'POST',
    body: JSON.stringify({ url }),
  })
}
