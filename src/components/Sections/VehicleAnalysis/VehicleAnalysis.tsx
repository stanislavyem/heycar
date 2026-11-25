
'use client'

import { useState } from 'react'
import {
  createVehicleAnalysis,
  getVehicleAnalysis,
  getVehicleReport,
  parseVehicleListing,
  type ParsedVehicleListing,
  type VehicleDecision,
  type VehicleAnalysisInput,
} from '@/services/vehicleAnalysis'

import './VehicleAnalysis.scss'

const money = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') {
    return 'Not available'
  }

  if (typeof value === 'string' && !Number.isFinite(Number(value.replace(/[$,]/g, '')))) {
    return value
  }

  const amount = Number(
    typeof value === 'string' ? value.replace(/[$,]/g, '') : value
  )

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

const VehicleAnalysis = () => {
  const [activeTab, setActiveTab] = useState<'url' | 'manual'>('url')
  const [listingUrl, setListingUrl] = useState('')
  const [parsedListing, setParsedListing] = useState<ParsedVehicleListing | null>(null)
  const [parsing, setParsing] = useState(false)
  const [year, setYear] = useState('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [trim, setTrim] = useState('')
  const [vin, setVin] = useState('')
  const [mileage, setMileage] = useState('')
  const [askingPrice, setAskingPrice] = useState('')
  const [location, setLocation] = useState('')
  const [sellerType, setSellerType] = useState('unknown')
  const [titleStatus, setTitleStatus] = useState('unknown')
  const [budget, setBudget] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [analysisId, setAnalysisId] = useState('')
  const [report, setReport] = useState<VehicleDecision | null>(null)

  const buildPayload = (listingId: string, sourceName?: string): VehicleAnalysisInput => ({
    vehicle: {
      listing_id: listingId,
      year: Number(year),
      make: make.trim(),
      model: model.trim(),
      asking_price: Number(askingPrice),
      currency: 'USD',
      ...(vin.trim() && { vin: vin.trim() }),
      ...(trim.trim() && { trim: trim.trim() }),
      ...(mileage && { mileage: Number(mileage) }),
      ...(location.trim() && { location_region: location.trim() }),
      seller_type: sellerType as 'dealer' | 'private' | 'unknown',
      title_status: titleStatus as 'clean' | 'salvage' | 'rebuilt' | 'flood' | 'lemon' | 'unknown',
      ...(sourceName && { source_name: sourceName }),
    },
    ...(budget && {
      buyer: {
        maximum_budget: Number(budget),
        urgency: 'normal',
      },
    }),
  })

  const runAnalysis = async (payload: VehicleAnalysisInput) => {
    setError('')
    setReport(null)
    setAnalysisId('')
    setLoading(true)

    try {
      const created = await createVehicleAnalysis(payload)
      setAnalysisId(created.analysis_id)
      await getVehicleAnalysis(created.analysis_id)
      const decision = await getVehicleReport(created.analysis_id)
      setReport(decision)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while analyzing the vehicle.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleParseListing = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setParsedListing(null)

    try {
      const parsedUrl = new URL(listingUrl.trim())
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Please enter a valid HTTP or HTTPS listing URL.')
      }

      setParsing(true)
      const result = await parseVehicleListing(listingUrl.trim())
      setParsedListing(result)

      setYear(result.year ? String(result.year) : '')
      setMake(result.make ?? '')
      setModel(result.model ?? '')
      setTrim(result.trim ?? '')
      setVin(result.vin ?? '')
      setMileage(result.mileage != null ? String(result.mileage) : '')
      setAskingPrice(result.asking_price != null ? String(result.asking_price) : '')
      setLocation(result.location_region ?? '')
      setSellerType(result.seller_type ?? 'unknown')
      setTitleStatus(result.title_status ?? 'unknown')
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'We could not extract vehicle information from this listing.'
      )
    } finally {
      setParsing(false)
    }
  }

  const handleManualSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await runAnalysis(
      buildPayload(
        `manual-${Date.now()}`,
        'Manual entry'
      )
    )
  }

  const handleUrlAnalysis = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!parsedListing) {
      setError('Parse the listing URL before running the analysis.')
      return
    }

    const sourceName = (() => {
      try {
        return new URL(listingUrl).hostname
      } catch {
        return undefined
      }
    })()

    await runAnalysis(buildPayload(listingUrl, sourceName))
  }

  const clearVehicleFields = () => {
    setYear('')
    setMake('')
    setModel('')
    setTrim('')
    setVin('')
    setMileage('')
    setAskingPrice('')
    setLocation('')
    setSellerType('unknown')
    setTitleStatus('unknown')
    setBudget('')
    setParsedListing(null)
  }

  const resetForm = () => {
    setReport(null)
    setAnalysisId('')
    setError('')
    setParsedListing(null)
    setActiveTab('url')
  }

  return (
    <main className="carpal-analysis">

      <section className="carpal-analysis__hero">
        <div className="carpal-analysis__container">

          <span className="carpal-analysis__eyebrow">
            CARPAL VEHICLE INTELLIGENCE
          </span>

          <h1>Make your next car purchase a smarter one.</h1>

          <p>
            Analyze vehicle pricing, evaluate risks, and discover
            what you should actually pay.
          </p>

        </div>
      </section>

      <section className="carpal-analysis__container carpal-analysis__content">

        {!report && (
          <div className="carpal-analysis__form">
            <div className="carpal-analysis__section-heading">
              <h2>Analyze a vehicle</h2>
              <p>Choose how you want to provide the vehicle information.</p>
            </div>

            <div className="carpal-analysis__tabs" role="tablist" aria-label="Vehicle input method">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'url'}
                className={`carpal-analysis__tab ${activeTab === 'url' ? 'is-active' : ''}`}
                onClick={() => {
                  if (activeTab !== 'url') clearVehicleFields()
                  setActiveTab('url')
                  setError('')
                }}
              >
                Paste listing URL
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'manual'}
                className={`carpal-analysis__tab ${activeTab === 'manual' ? 'is-active' : ''}`}
                onClick={() => {
                  if (activeTab !== 'manual') clearVehicleFields()
                  setActiveTab('manual')
                  setError('')
                }}
              >
                Enter manually
              </button>
            </div>

            {activeTab === 'url' ? (
              <form onSubmit={parsedListing ? handleUrlAnalysis : handleParseListing}>
                <div className="carpal-analysis__field carpal-analysis__field--full">
                  <label htmlFor="listingUrl">Vehicle listing URL *</label>
                  <input
                    id="listingUrl"
                    type="url"
                    placeholder="https://www.cargurus.com/details/..."
                    value={listingUrl}
                    onChange={(e) => {
                      setListingUrl(e.target.value)
                      setParsedListing(null)
                    }}
                    required
                  />
                  <small>
                    Paste a public vehicle listing URL. We will try to extract its details.
                  </small>
                </div>

                {parsedListing && (
                  <>
                    <div className="carpal-analysis__parse-status">
                      <strong>Listing information extracted</strong>
                      <span>Review the details below and correct anything that looks inaccurate.</span>
                    </div>

                    <h3>Extracted vehicle information</h3>
                    <div className="carpal-analysis__grid">
                      <div className="carpal-analysis__field">
                        <label htmlFor="url-year">Year *</label>
                        <input id="url-year" type="number" min="1900" max="2100" value={year} onChange={(e) => setYear(e.target.value)} required />
                      </div>
                      <div className="carpal-analysis__field">
                        <label htmlFor="url-make">Make *</label>
                        <input id="url-make" value={make} onChange={(e) => setMake(e.target.value)} required />
                      </div>
                      <div className="carpal-analysis__field">
                        <label htmlFor="url-model">Model *</label>
                        <input id="url-model" value={model} onChange={(e) => setModel(e.target.value)} required />
                      </div>
                      <div className="carpal-analysis__field">
                        <label htmlFor="url-trim">Trim</label>
                        <input id="url-trim" value={trim} onChange={(e) => setTrim(e.target.value)} />
                      </div>
                      <div className="carpal-analysis__field">
                        <label htmlFor="url-vin">VIN</label>
                        <input id="url-vin" value={vin} onChange={(e) => setVin(e.target.value)} />
                      </div>
                      <div className="carpal-analysis__field">
                        <label htmlFor="url-mileage">Mileage</label>
                        <input id="url-mileage" type="number" min="0" value={mileage} onChange={(e) => setMileage(e.target.value)} />
                      </div>
                      <div className="carpal-analysis__field">
                        <label htmlFor="url-price">Asking price ($) *</label>
                        <input id="url-price" type="number" min="0.01" step="0.01" value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)} required />
                      </div>
                      <div className="carpal-analysis__field">
                        <label htmlFor="url-location">Location</label>
                        <input id="url-location" value={location} onChange={(e) => setLocation(e.target.value)} />
                      </div>
                      <div className="carpal-analysis__field">
                        <label htmlFor="url-seller">Seller type</label>
                        <select id="url-seller" value={sellerType} onChange={(e) => setSellerType(e.target.value)}>
                          <option value="unknown">Unknown</option>
                          <option value="dealer">Dealer</option>
                          <option value="private">Private seller</option>
                        </select>
                      </div>
                      <div className="carpal-analysis__field">
                        <label htmlFor="url-title">Title status</label>
                        <select id="url-title" value={titleStatus} onChange={(e) => setTitleStatus(e.target.value)}>
                          <option value="unknown">Unknown</option>
                          <option value="clean">Clean</option>
                          <option value="salvage">Salvage</option>
                          <option value="rebuilt">Rebuilt</option>
                          <option value="flood">Flood</option>
                          <option value="lemon">Lemon</option>
                        </select>
                      </div>
                    </div>

                    <div className="carpal-analysis__field carpal-analysis__budget">
                      <label htmlFor="url-budget">Maximum budget ($)</label>
                      <input id="url-budget" type="number" min="0" step="0.01" placeholder="30000" value={budget} onChange={(e) => setBudget(e.target.value)} />
                    </div>
                  </>
                )}

                {error && <div className="carpal-analysis__error" role="alert">{error}</div>}

                <button type="submit" className="carpal-analysis__submit" disabled={parsing || loading}>
                  {(parsing || loading) ? (
                    <>
                      <span className="carpal-analysis__spinner" />
                      {parsing ? 'Parsing listing...' : 'Analyzing vehicle...'}
                    </>
                  ) : parsedListing ? 'Analyze extracted vehicle' : 'Parse listing'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleManualSubmit}>
                <h3>Vehicle information</h3>
                <div className="carpal-analysis__grid">
                  <div className="carpal-analysis__field">
                    <label htmlFor="manual-year">Year *</label>
                    <input id="manual-year" type="number" min="1900" max="2100" placeholder="2022" value={year} onChange={(e) => setYear(e.target.value)} required />
                  </div>
                  <div className="carpal-analysis__field">
                    <label htmlFor="manual-make">Make *</label>
                    <input id="manual-make" placeholder="Toyota" value={make} onChange={(e) => setMake(e.target.value)} required />
                  </div>
                  <div className="carpal-analysis__field">
                    <label htmlFor="manual-model">Model *</label>
                    <input id="manual-model" placeholder="Camry" value={model} onChange={(e) => setModel(e.target.value)} required />
                  </div>
                  <div className="carpal-analysis__field">
                    <label htmlFor="manual-trim">Trim</label>
                    <input id="manual-trim" placeholder="SE" value={trim} onChange={(e) => setTrim(e.target.value)} />
                  </div>
                  <div className="carpal-analysis__field">
                    <label htmlFor="manual-vin">VIN</label>
                    <input id="manual-vin" placeholder="Vehicle identification number" value={vin} onChange={(e) => setVin(e.target.value)} />
                  </div>
                  <div className="carpal-analysis__field">
                    <label htmlFor="manual-mileage">Mileage</label>
                    <input id="manual-mileage" type="number" min="0" placeholder="35000" value={mileage} onChange={(e) => setMileage(e.target.value)} />
                  </div>
                  <div className="carpal-analysis__field">
                    <label htmlFor="manual-price">Asking price ($) *</label>
                    <input id="manual-price" type="number" min="0.01" step="0.01" placeholder="25000" value={askingPrice} onChange={(e) => setAskingPrice(e.target.value)} required />
                  </div>
                  <div className="carpal-analysis__field">
                    <label htmlFor="manual-location">Location</label>
                    <input id="manual-location" placeholder="Dallas, TX" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                  <div className="carpal-analysis__field">
                    <label htmlFor="manual-seller">Seller type</label>
                    <select id="manual-seller" value={sellerType} onChange={(e) => setSellerType(e.target.value)}>
                      <option value="unknown">Unknown</option>
                      <option value="dealer">Dealer</option>
                      <option value="private">Private seller</option>
                    </select>
                  </div>
                  <div className="carpal-analysis__field">
                    <label htmlFor="manual-title">Title status</label>
                    <select id="manual-title" value={titleStatus} onChange={(e) => setTitleStatus(e.target.value)}>
                      <option value="unknown">Unknown</option>
                      <option value="clean">Clean</option>
                      <option value="salvage">Salvage</option>
                      <option value="rebuilt">Rebuilt</option>
                      <option value="flood">Flood</option>
                      <option value="lemon">Lemon</option>
                    </select>
                  </div>
                </div>

                <div className="carpal-analysis__divider" />
                <h3>Buyer preferences</h3>
                <div className="carpal-analysis__field carpal-analysis__budget">
                  <label htmlFor="manual-budget">Maximum budget ($)</label>
                  <input id="manual-budget" type="number" min="0" step="0.01" placeholder="30000" value={budget} onChange={(e) => setBudget(e.target.value)} />
                </div>

                {error && <div className="carpal-analysis__error" role="alert">{error}</div>}
                <button type="submit" className="carpal-analysis__submit" disabled={loading}>
                  {loading ? <><span className="carpal-analysis__spinner" />Analyzing vehicle...</> : 'Analyze vehicle'}
                </button>
              </form>
            )}
          </div>
        )}

        {report && (
          <section className="carpal-report">

            <div className="carpal-report__header">
              <div>
                <span className="carpal-analysis__eyebrow">
                  VEHICLE ANALYSIS COMPLETE
                </span>
                <h2>Your CarPal report</h2>
                <p>Analysis ID: {analysisId}</p>
              </div>

              <button
                type="button"
                className="carpal-report__reset"
                onClick={resetForm}
              >
                New analysis
              </button>
            </div>

            <div className="carpal-report__overview">

              <div className="carpal-report__score">
                <span>Overall deal score</span>

                <strong>
                  {report.score.overall_score ?? 'N/A'}
                  {report.score.overall_score !== null && '/100'}
                </strong>

                <span>
                  {recommendationLabels[report.recommendation] ??
                    report.recommendation}
                </span>
              </div>

              <div className="carpal-report__offer">
                <span>Recommended opening offer</span>
                <strong>{money(report.pricing.opening_offer)}</strong>
                <small>
                  Target: {money(report.pricing.target_price)}
                </small>
              </div>

            </div>

            <div className="carpal-report__card">
              <h3>Market valuation</h3>

              <div className="carpal-report__metrics">
                <div>
                  <span>Asking price</span>
                  <strong>{money(report.pricing.asking_price)}</strong>
                </div>

                <div>
                  <span>Fair market value</span>
                  <strong>{money(report.market.fair_market_value)}</strong>
                </div>

                <div>
                  <span>Low market range</span>
                  <strong>{money(report.market.low_range)}</strong>
                </div>

                <div>
                  <span>High market range</span>
                  <strong>{money(report.market.high_range)}</strong>
                </div>

                <div>
                  <span>Maximum recommended price</span>
                  <strong>
                    {money(report.pricing.maximum_recommended_price)}
                  </strong>
                </div>

                <div>
                  <span>Price position</span>
                  <strong>{report.pricing.price_position.replace(/_/g, ' ')}</strong>
                </div>
              </div>

              <p>
                Based on {report.market.comparable_count} comparable listings.
                Market confidence: {report.market.confidence}.
              </p>
            </div>

            <div className="carpal-report__card">
              <h3>Deal score breakdown</h3>

              <div className="carpal-report__score-list">
                {[
                  ['Price', report.score.price],
                  ['History', report.score.history],
                  ['Mileage', report.score.mileage],
                  ['Reliability', report.score.reliability],
                  ['Ownership cost', report.score.ownership_cost],
                  ['Dealer transparency', report.score.dealer_transparency],
                ].map(([label, value]) => (
                  <div className="carpal-report__score-row" key={label}>
                    <span>{label}</span>

                    <div className="carpal-report__bar">
                      <div
                        style={{
                          width: `${Math.max(0, Math.min(100, Number(value ?? 0)))}%`,
                        }}
                      />
                    </div>

                    <strong>{value ?? 'N/A'}</strong>
                  </div>
                ))}
              </div>

              <p>Score coverage: {report.score.coverage_pct}%</p>
            </div>

            <div className="carpal-report__card">
              <h3>Vehicle mileage assessment</h3>

              <div className="carpal-report__metrics">
                <div>
                  <span>Actual mileage</span>
                  <strong>{report.mileage.actual_mileage?.toLocaleString() ?? 'N/A'}</strong>
                </div>

                <div>
                  <span>Expected mileage</span>
                  <strong>{report.mileage.expected_mileage?.toLocaleString() ?? 'N/A'}</strong>
                </div>

                <div>
                  <span>Classification</span>
                  <strong>{report.mileage.classification.replace(/_/g, ' ')}</strong>
                </div>

                <div>
                  <span>Mileage adjustment</span>
                  <strong>{report.mileage.adjustment}</strong>
                </div>
              </div>
            </div>

            <div className="carpal-report__card">
              <h3>Risk assessment</h3>

              <div className="carpal-report__risk-summary">
                <strong>
                  {report.risk.critical_restriction
                    ? 'Critical restriction identified'
                    : `${report.risk.risks.length} risk observations`}
                </strong>

                <span>
                  Total score penalty: {report.risk.total_score_penalty}
                </span>
              </div>

              {report.risk.risks.length > 0 ? (
                report.risk.risks.map((risk, index) => (
                  <div className="carpal-report__risk" key={`${risk.category}-${index}`}>
                    <div>
                      <strong>{risk.category.replace(/_/g, ' ')}</strong>
                      <span className={`carpal-report__severity carpal-report__severity--${risk.severity}`}>
                        {risk.severity}
                      </span>
                    </div>

                    <p>{risk.description}</p>

                    <small>
                      Score penalty: {risk.score_penalty}
                      {' · '}
                      {risk.resolved ? 'Resolved' : 'Unresolved'}
                    </small>
                  </div>
                ))
              ) : (
                <p>No risk observations were returned.</p>
              )}
            </div>

            {report.pricing.budget_warning && (
              <div className="carpal-report__warning">
                <strong>Budget warning</strong>
                <p>{report.pricing.budget_warning}</p>
              </div>
            )}

            {(report.data_warnings.length > 0 ||
              report.market.warnings.length > 0 ||
              report.mileage.warnings.length > 0) && (
              <div className="carpal-report__card">
                <h3>Data warnings</h3>
                <ul>
                  {[
                    ...report.data_warnings,
                    ...report.market.warnings,
                    ...report.mileage.warnings,
                  ].map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="carpal-report__footer">
              <span>Decision engine: {report.strategy_version}</span>
              <span>Confidence: {report.confidence}</span>
            </div>

          </section>
        )}

      </section>
    </main>
  )
}

export default VehicleAnalysis
