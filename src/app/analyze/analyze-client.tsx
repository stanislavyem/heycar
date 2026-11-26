
'use client'

import { useState } from 'react'
import {
  createVehicleAnalysis,
  getVehicleAnalysis,
  getVehicleReport,
  parseVehicleListing,
  type VehicleAnalysisInput,
  type VehicleDecision,
} from '@/services/vehicleAnalysis'

import { ContactForm } from '@/app/blocks/contact-form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/ui/tabs'

const money = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') {
    return 'Not available'
  }

  const amount =
    typeof value === 'string'
      ? Number(value.replace(/[$,]/g, ''))
      : value

  if (!Number.isFinite(amount)) {
    return String(value)
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}

const recommendationLabels: Record<string, string> = {
  excellent_value: 'Excellent Value',
  good_value: 'Good Value',
  fair_value: 'Fair Value',
  negotiate: 'Negotiate',
  poor_value: 'Poor Value',
  avoid_pending_review: 'Avoid Pending Review',
  insufficient_data: 'Insufficient Data',
}

const parseNumber = (value?: string) => {
  if (!value?.trim()) return undefined

  const number = Number(value.replace(/[$,]/g, ''))

  return Number.isFinite(number) ? number : undefined
}

function buildPayload(
  vehicle: {
    listingId: string
    year: number
    make: string
    model: string
    askingPrice: number
    vin?: string
    trim?: string
    mileage?: number
    location?: string
    sourceName?: string
  }
): VehicleAnalysisInput {
  return {
    vehicle: {
      listing_id: vehicle.listingId,
      year: vehicle.year,
      make: vehicle.make.trim(),
      model: vehicle.model.trim(),
      asking_price: vehicle.askingPrice,
      currency: 'USD',

      ...(vehicle.vin && { vin: vehicle.vin }),
      ...(vehicle.trim && { trim: vehicle.trim }),
      ...(vehicle.mileage !== undefined && {
        mileage: vehicle.mileage,
      }),
      ...(vehicle.location && {
        location_region: vehicle.location,
      }),
      ...(vehicle.sourceName && {
        source_name: vehicle.sourceName,
      }),

      seller_type: 'unknown',
      title_status: 'unknown',
    },
  }
}

async function submitAnalysis(
  payload: VehicleAnalysisInput
): Promise<{ analysisId: string; report: VehicleDecision }> {
  const created = await createVehicleAnalysis(payload)

  await getVehicleAnalysis(created.analysis_id)

  const report = await getVehicleReport(created.analysis_id)

  return {
    analysisId: created.analysis_id,
    report,
  }
}

function VehicleReport({
  report,
  analysisId,
  onReset,
}: {
  report: VehicleDecision
  analysisId: string
  onReset: () => void
}) {
  const scoreItems = [
    ['Price', report.score.price],
    ['History', report.score.history],
    ['Mileage', report.score.mileage],
    ['Reliability', report.score.reliability],
    ['Ownership cost', report.score.ownership_cost],
    ['Dealer transparency', report.score.dealer_transparency],
  ] as const

  const warnings = [
    ...report.data_warnings,
    ...report.market.warnings,
    ...report.mileage.warnings,
  ]

  return (
    <section className="mt-12 space-y-6" aria-label="Vehicle analysis report">

      {/* Report header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Vehicle analysis complete
          </span>

          <h2 className="mt-2 text-2xl font-semibold">
            Your CarPal report
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Analysis ID: {analysisId}
          </p>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
        >
          New analysis
        </button>
      </div>

      {/* Overall score and offer */}
      <div className="grid gap-4 sm:grid-cols-2">

        <div className="rounded-xl border bg-card p-6">
          <span className="text-sm text-muted-foreground">
            Overall deal score
          </span>

          <div className="mt-2 text-4xl font-bold">
            {report.score.overall_score ?? 'N/A'}
            {report.score.overall_score !== null && (
              <span className="text-xl text-muted-foreground">/100</span>
            )}
          </div>

          <p className="mt-2 font-medium text-primary">
            {recommendationLabels[report.recommendation] ??
              report.recommendation.replace(/_/g, ' ')}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <span className="text-sm text-muted-foreground">
            Recommended opening offer
          </span>

          <div className="mt-2 text-3xl font-bold">
            {money(report.pricing.opening_offer)}
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Target price: {money(report.pricing.target_price)}
          </p>
        </div>

      </div>

      {/* Market valuation */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold">
          Market valuation
        </h3>

        <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3">

          <div>
            <span className="text-sm text-muted-foreground">
              Asking price
            </span>
            <p className="mt-1 font-semibold">
              {money(report.pricing.asking_price)}
            </p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">
              Fair market value
            </span>
            <p className="mt-1 font-semibold">
              {money(report.market.fair_market_value)}
            </p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">
              Low market range
            </span>
            <p className="mt-1 font-semibold">
              {money(report.market.low_range)}
            </p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">
              High market range
            </span>
            <p className="mt-1 font-semibold">
              {money(report.market.high_range)}
            </p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">
              Maximum recommended price
            </span>
            <p className="mt-1 font-semibold">
              {money(report.pricing.maximum_recommended_price)}
            </p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">
              Price position
            </span>
            <p className="mt-1 font-semibold capitalize">
              {report.pricing.price_position.replace(/_/g, ' ')}
            </p>
          </div>

        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          Based on {report.market.comparable_count} comparable listings.
          Market confidence: {report.market.confidence}.
        </p>
      </div>

      {/* Score breakdown */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold">
          Deal score breakdown
        </h3>

        <div className="mt-5 space-y-4">
          {scoreItems.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[110px_1fr_40px] items-center gap-3"
            >
              <span className="text-sm">{label}</span>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, Number(value ?? 0))
                    )}%`,
                  }}
                />
              </div>

              <strong className="text-right text-sm">
                {value ?? 'N/A'}
              </strong>
            </div>
          ))}
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          Score coverage: {report.score.coverage_pct}%
        </p>
      </div>

      {/* Mileage */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold">
          Vehicle mileage assessment
        </h3>

        <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-4">

          <div>
            <span className="text-sm text-muted-foreground">
              Actual mileage
            </span>
            <p className="mt-1 font-semibold">
              {report.mileage.actual_mileage?.toLocaleString() ?? 'N/A'}
            </p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">
              Expected mileage
            </span>
            <p className="mt-1 font-semibold">
              {report.mileage.expected_mileage?.toLocaleString() ?? 'N/A'}
            </p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">
              Classification
            </span>
            <p className="mt-1 font-semibold capitalize">
              {report.mileage.classification.replace(/_/g, ' ')}
            </p>
          </div>

          <div>
            <span className="text-sm text-muted-foreground">
              Mileage adjustment
            </span>
            <p className="mt-1 font-semibold">
              {report.mileage.adjustment}
            </p>
          </div>

        </div>
      </div>

      {/* Risk assessment */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="text-lg font-semibold">
          Risk assessment
        </h3>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <strong>
            {report.risk.critical_restriction
              ? 'Critical restriction identified'
              : `${report.risk.risks.length} risk observations`}
          </strong>

          <span className="text-sm text-muted-foreground">
            Total score penalty: {report.risk.total_score_penalty}
          </span>
        </div>

        {report.risk.risks.length > 0 ? (
          <div className="mt-5 space-y-4">
            {report.risk.risks.map((risk, index) => (
              <div
                key={`${risk.category}-${index}`}
                className="rounded-lg border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <strong className="capitalize">
                    {risk.category.replace(/_/g, ' ')}
                  </strong>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">
                    {risk.severity}
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {risk.description}
                </p>

                <p className="mt-3 text-xs text-muted-foreground">
                  Score penalty: {risk.score_penalty}
                  {' · '}
                  {risk.resolved ? 'Resolved' : 'Unresolved'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            No risk observations were returned.
          </p>
        )}
      </div>

      {/* Budget warning */}
      {report.pricing.budget_warning && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-6">
          <h3 className="font-semibold">Budget warning</h3>
          <p className="mt-2 text-sm">
            {report.pricing.budget_warning}
          </p>
        </div>
      )}

      {/* Data warnings */}
      {warnings.length > 0 && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-semibold">
            Data warnings
          </h3>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-wrap justify-between gap-3 border-t pt-5 text-sm text-muted-foreground">
        <span>Decision engine: {report.strategy_version}</span>
        <span>Confidence: {report.confidence}</span>
      </div>

    </section>
  )
}

export default function AnalyzeClient() {
  const [report, setReport] = useState<VehicleDecision | null>(null)
  const [analysisId, setAnalysisId] = useState('')

  const runAnalysis = async (payload: VehicleAnalysisInput) => {
    const result = await submitAnalysis(payload)

    setAnalysisId(result.analysisId)
    setReport(result.report)
  }

  // URL submission:
  // Parse the listing, build the API payload, and retrieve the report.
  const handleUrlSubmit = async (values: Record<string, string>) => {
    const listingUrl = values.url?.trim()

    if (!listingUrl) {
      throw new Error('Please enter a vehicle listing URL.')
    }

    let parsedUrl: URL

    try {
      parsedUrl = new URL(listingUrl)
    } catch {
      throw new Error('Please enter a valid listing URL.')
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Please enter a valid HTTP or HTTPS listing URL.')
    }

    const parsed = await parseVehicleListing(listingUrl)

    if (!parsed.year || !parsed.make || !parsed.model || parsed.asking_price == null) {
      throw new Error(
        'The listing did not provide enough vehicle information. Please enter the vehicle details manually.'
      )
    }

    const payload: VehicleAnalysisInput = {
      vehicle: {
        listing_id: listingUrl,
        year: parsed.year,
        make: parsed.make,
        model: parsed.model,
        asking_price: parsed.asking_price,
        currency: 'USD',
        ...(parsed.vin && { vin: parsed.vin }),
        ...(parsed.trim && { trim: parsed.trim }),
        ...(parsed.mileage != null && { mileage: parsed.mileage }),
        ...(parsed.location_region && {
          location_region: parsed.location_region,
        }),
        seller_type: parsed.seller_type ?? 'unknown',
        title_status: parsed.title_status ?? 'unknown',
        source_name: parsed.source_name || parsedUrl.hostname,
      },
    }

    await runAnalysis(payload)
  }

  // Manual submission:
  // Keep the ContactForm UI unchanged and only change its submission action.
  const handleManualSubmit = async (values: Record<string, string>) => {
    const year = parseNumber(values.year)
    const askingPrice = parseNumber(values.price)

    if (!year || !askingPrice) {
      throw new Error('Please provide a valid vehicle year and asking price.')
    }

    const mileage = parseNumber(values.mileage)

    const payload = buildPayload({
      listingId: `manual-${Date.now()}`,
      year,
      make: values.make ?? '',
      model: values.model ?? '',
      askingPrice,
      trim: values.trim?.trim() || undefined,
      vin: values.vin?.trim() || undefined,
      mileage,
      location: values.zip?.trim() || undefined,
      sourceName: 'Manual entry',
    })

    await runAnalysis(payload)
  }

  const resetAnalysis = () => {
    setReport(null)
    setAnalysisId('')
  }

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {!report ? (
          <>
            <h1 className="max-w-3xl font-display text-(length:--display-h1-size) leading-(--display-h1-leading) font-medium tracking-(--display-h1-tracking)">
              Check a car before you talk price.
            </h1>

            <p className="mt-6 max-w-prose text-lg text-muted-foreground md:text-xl">
              Paste a listing or enter the details yourself. CarPal returns
              the fair market range, the history and any fees worth questioning.
            </p>

            <Tabs defaultValue="link" className="mt-12 max-w-2xl">

              <TabsList>
                <TabsTrigger value="link">
                  Paste a car link
                </TabsTrigger>

                <TabsTrigger value="manual">
                  Enter details manually
                </TabsTrigger>
              </TabsList>

              {/* URL tab */}
              <TabsContent value="link" className="mt-8">
                <ContactForm
                  formId="car-link-check"
                  onSubmit={handleUrlSubmit}
                  fields={[
                    {
                      name: 'url',
                      label: 'Listing link',
                      required: true,
                      placeholder: 'https://dealer.com/listing/2021-suv',
                    },
                    {
                      name: 'email',
                      label: 'Email for your report',
                      type: 'email',
                      required: true,
                    },
                  ]}
                  submitLabel="Parse listing and analyze vehicle"
                  successMessage="Your vehicle analysis is ready."
                />
              </TabsContent>

              {/* Manual tab */}
              <TabsContent value="manual" className="mt-8">
                <ContactForm
                  formId="car-details-check"
                  onSubmit={handleManualSubmit}
                  fields={[
                    {
                      name: 'year',
                      label: 'Year',
                      required: true,
                      half: true,
                      placeholder: '2021',
                    },
                    {
                      name: 'make',
                      label: 'Make',
                      required: true,
                      half: true,
                      placeholder: 'Toyota',
                    },
                    {
                      name: 'model',
                      label: 'Model',
                      required: true,
                      half: true,
                      placeholder: 'RAV4',
                    },
                    {
                      name: 'trim',
                      label: 'Trim',
                      half: true,
                      placeholder: 'XLE',
                    },
                    {
                      name: 'mileage',
                      label: 'Mileage',
                      required: true,
                      half: true,
                      placeholder: '42,000',
                    },
                    {
                      name: 'price',
                      label: 'Asking price',
                      required: true,
                      half: true,
                      placeholder: '$27,900',
                    },
                    {
                      name: 'condition',
                      label: 'Condition',
                      type: 'select',
                      options: [
                        'Excellent',
                        'Good',
                        'Fair',
                        'Needs work',
                      ],
                      placeholder: 'Choose one',
                      half: true,
                    },
                    {
                      name: 'zip',
                      label: 'ZIP code',
                      half: true,
                      placeholder: '90210',
                    },
                    {
                      name: 'vin',
                      label: 'VIN (optional)',
                    },
                    {
                      name: 'email',
                      label: 'Email for your report',
                      type: 'email',
                      required: true,
                    },
                  ]}
                  submitLabel="Check this car"
                  successMessage="Your vehicle analysis is ready."
                />
              </TabsContent>

            </Tabs>
          </>
        ) : (
          <VehicleReport
            report={report}
            analysisId={analysisId}
            onReset={resetAnalysis}
          />
        )}

      </div>
    </section>
  )
}
