#!/usr/bin/env bun
/**
 * Imports Hyperping's public incident timeline and maintenance history into one
 * OpenStatus page. It intentionally never touches monitors or source resources.
 *
 * Required:
 *   HYPERPING_API_KEY
 *   OPENSTATUS_API_KEY
 *   OPENSTATUS_PAGE_ID
 *
 * Optional:
 *   HYPERPING_STATUS_PAGE_IDS=sp_a,sp_b
 *   OPENSTATUS_API_BASE=https://api.openstatus.dev
 *   OPENSTATUS_RESOLVE_IP=verified_ipv4 (only for a provider-routing fallback)
 *
 * Usage:
 *   bun migrate-status-history.mjs --dry-run
 *   bun migrate-status-history.mjs --apply --ledger /secure/path/history-ledger.json
 */

import { basename, resolve } from 'node:path'

const args = process.argv.slice(2)
const apply = args.includes('--apply')
const ledgerFlag = args.indexOf('--ledger')
const ledgerPath = resolve(
  ledgerFlag >= 0 && args[ledgerFlag + 1]
    ? args[ledgerFlag + 1]
    : `./hyperping-openstatus-history-ledger.json`,
)

const hyperpingKey = required('HYPERPING_API_KEY')
const openstatusKey = required('OPENSTATUS_API_KEY')
const targetPageId = required('OPENSTATUS_PAGE_ID')
const openstatusBase = (process.env.OPENSTATUS_API_BASE || 'https://api.openstatus.dev').replace(/\/$/, '')
const openstatusResolveIp = process.env.OPENSTATUS_RESOLVE_IP

if (apply && args.includes('--dry-run'))
  fail('Use either --dry-run or --apply, not both.')

function required(name) {
  const value = process.env[name]
  if (!value)
    fail(`Missing required environment variable: ${name}`)
  return value
}

function fail(message) {
  throw new Error(message)
}

function localized(value, fallback) {
  if (typeof value === 'string' && value.trim())
    return value.trim()

  if (value && typeof value === 'object') {
    const preferred = value.en
    if (typeof preferred === 'string' && preferred.trim())
      return preferred.trim()

    const first = Object.values(value).find(entry => typeof entry === 'string' && entry.trim())
    if (typeof first === 'string')
      return first.trim()
  }

  return fallback
}

function normaliseName(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

function sortByDate(records, field = 'date') {
  return [...records].sort((left, right) => Date.parse(left[field]) - Date.parse(right[field]))
}

function sameInstant(left, right) {
  return Number.isFinite(Date.parse(left))
    && Number.isFinite(Date.parse(right))
    && Date.parse(left) === Date.parse(right)
}

function sameIds(left, right) {
  return [...new Set(left)].sort().join(',') === [...new Set(right)].sort().join(',')
}

function statusFor(type, fallback = 'STATUS_REPORT_STATUS_INVESTIGATING') {
  switch (String(type || '').trim().toLowerCase()) {
    case 'investigating':
      return 'STATUS_REPORT_STATUS_INVESTIGATING'
    case 'identified':
      return 'STATUS_REPORT_STATUS_IDENTIFIED'
    case 'monitoring':
      return 'STATUS_REPORT_STATUS_MONITORING'
    case 'resolved':
      return 'STATUS_REPORT_STATUS_RESOLVED'
    default:
      return fallback
  }
}

function updateEvent(update, fallbackStatus, sourceId, index) {
  const status = statusFor(update.type, fallbackStatus)
  return {
    id: update.uuid || `${sourceId}:update:${index}`,
    date: update.date,
    status,
    message: localized(update.text, 'Hyperping incident update.'),
    synthetic: false,
  }
}

function incidentPlan(incident, componentMap) {
  const componentIds = mapComponents(incident.affectedComponents || [], componentMap)
  const sourceUpdates = sortByDate(incident.updates || [])
  const events = []
  let phase = 'STATUS_REPORT_STATUS_INVESTIGATING'
  const incidentTimestamp = Date.parse(incident.date)
  const firstUpdateTimestamp = sourceUpdates.length ? Date.parse(sourceUpdates[0].date) : Number.NaN
  const sourceDatePrecedesTimeline = Number.isFinite(incidentTimestamp)
    && (!sourceUpdates.length || incidentTimestamp < firstUpdateTimestamp)

  if (sourceDatePrecedesTimeline) {
    events.push({
      id: `${incident.uuid}:detected`,
      date: incident.date,
      status: phase,
      message: 'Incident detected in Hyperping.',
      synthetic: true,
    })
  }

  sourceUpdates.forEach((update, index) => {
    const event = updateEvent(update, phase, incident.uuid, index)
    phase = event.status
    events.push(event)
  })

  if (!events.length)
    fail(`Incident ${incident.uuid} has no usable timeline timestamp.`)

  return {
    id: incident.uuid,
    title: localized(incident.title, 'Hyperping incident').slice(0, 256),
    componentIds: componentIds.mapped,
    unmappedComponentIds: componentIds.unmapped,
    sourceTimestampAfterFirstUpdate: Number.isFinite(incidentTimestamp)
      && Number.isFinite(firstUpdateTimestamp)
      && incidentTimestamp > firstUpdateTimestamp,
    events,
  }
}

function maintenancePlan(maintenance, componentMap) {
  const componentIds = mapComponents(maintenance.monitors || [], componentMap)
  const updates = sortByDate(maintenance.updates || [])
  const baseMessage = localized(
    maintenance.message || maintenance.description,
    'Imported from Hyperping maintenance history.',
  )
  const timeline = updates
    .map(update => `- ${update.date}: ${localized(update.text, 'Maintenance update.')}`)
    .join('\n')

  return {
    id: maintenance.uuid,
    title: localized(maintenance.title, maintenance.name || 'Hyperping maintenance').slice(0, 256),
    message: timeline ? `${baseMessage}\n\nOriginal Hyperping maintenance timeline:\n${timeline}` : baseMessage,
    from: maintenance.start_date,
    to: maintenance.end_date,
    componentIds: componentIds.mapped,
    unmappedComponentIds: componentIds.unmapped,
    sourceUpdateCount: updates.length,
  }
}

function mapComponents(sourceIds, componentMap) {
  const mapped = []
  const unmapped = []

  for (const sourceId of sourceIds) {
    const targetId = componentMap.get(sourceId)
    if (targetId)
      mapped.push(targetId)
    else
      unmapped.push(sourceId)
  }

  return { mapped: [...new Set(mapped)], unmapped }
}

async function curlJson({ url, method = 'GET', headers = [], body, openstatus = false }) {
  const curlArgs = ['curl', '-sS', '--max-time', '45', '--fail-with-body', '-X', method]

  if (openstatusResolveIp && openstatus) {
    const host = new URL(openstatusBase).hostname
    curlArgs.push('-4', '--http1.1', '--resolve', `${host}:443:${openstatusResolveIp}`)
  }

  for (const [name, value] of headers)
    curlArgs.push('-H', `${name}: ${value}`)

  if (body !== undefined)
    curlArgs.push('--data', JSON.stringify(body))

  curlArgs.push(url)
  const process = Bun.spawn(curlArgs, { stdout: 'pipe', stderr: 'pipe' })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(process.stdout).text(),
    new Response(process.stderr).text(),
    process.exited,
  ])

  if (exitCode !== 0)
    fail(`Request failed for ${new URL(url).pathname}: ${stderr.trim() || 'curl exited non-zero'}`)

  try {
    return stdout ? JSON.parse(stdout) : {}
  }
  catch {
    fail(`Non-JSON response from ${new URL(url).pathname}`)
  }
}

async function hyperping(path) {
  return curlJson({
    url: `https://api.hyperping.io${path}`,
    headers: [['Authorization', `Bearer ${hyperpingKey}`]],
  })
}

async function openstatus(service, method, body) {
  return curlJson({
    url: `${openstatusBase}/rpc/${service}/${method}`,
    method: 'POST',
    body,
    openstatus: true,
    headers: [
      ['x-openstatus-key', openstatusKey],
      ['Content-Type', 'application/json'],
    ],
  })
}

async function listHyperpingStatusPages() {
  const pages = []
  let page = 0

  while (true) {
    const response = await hyperping(`/v2/statuspages?page=${page}`)
    pages.push(...(response.statuspages || []))
    if (!response.hasNextPage)
      return pages
    page += 1
  }
}

async function listHyperpingMaintenances() {
  const windows = []
  let page = 0

  while (true) {
    const suffix = page ? `?page=${page}` : ''
    const response = await hyperping(`/v1/maintenance-windows${suffix}`)
    windows.push(...(response.maintenanceWindows || []))
    if (!response.hasNextPage)
      return windows
    page += 1
  }
}

async function listOpenStatus(service, field, extra = {}) {
  const records = []
  let offset = 0

  while (true) {
    const response = await openstatus(service, service.includes('StatusReport') ? 'ListStatusReports' : 'ListMaintenances', {
      limit: 100,
      offset,
      ...extra,
    })
    const page = response[field] || []
    records.push(...page)

    if (page.length < 100)
      return records
    offset += page.length
  }
}

async function readLedger() {
  const file = Bun.file(ledgerPath)
  if (!await file.exists())
    return null

  try {
    return JSON.parse(await file.text())
  }
  catch {
    fail(`Ledger at ${ledgerPath} is not valid JSON.`)
  }
}

async function writeLedger(ledger) {
  await Bun.write(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`)
}

function newLedger(sourcePageIds) {
  return {
    version: 1,
    targetPageId,
    sourcePageIds,
    createdAt: new Date().toISOString(),
    incidents: {},
    maintenances: {},
  }
}

async function getStatusReport(id) {
  const response = await openstatus(
    'openstatus.status_report.v1.StatusReportService',
    'GetStatusReport',
    { id },
  )
  return response.statusReport || response
}

async function getMaintenance(id) {
  const response = await openstatus(
    'openstatus.maintenance.v1.MaintenanceService',
    'GetMaintenance',
    { id },
  )
  return response.maintenance || response
}

function hasEvent(report, event) {
  return (report.updates || []).some(update => (
    update.status === event.status
    && sameInstant(update.date, event.date)
    && update.message === event.message
  ))
}

function assertReport(plan, report) {
  if (report.title !== plan.title)
    fail(`Read-back title mismatch for incident ${plan.id}.`)
  if (!sameIds(report.pageComponentIds || [], plan.componentIds))
    fail(`Read-back component mismatch for incident ${plan.id}.`)
  if (report.status !== plan.events.at(-1).status)
    fail(`Read-back final status mismatch for incident ${plan.id}.`)
  for (const event of plan.events) {
    if (!hasEvent(report, event))
      fail(`Read-back timeline mismatch for incident ${plan.id} at ${event.date}.`)
  }
}

function assertMaintenance(plan, maintenance) {
  if (maintenance.title !== plan.title)
    fail(`Read-back title mismatch for maintenance ${plan.id}.`)
  if (!sameInstant(maintenance.from, plan.from) || !sameInstant(maintenance.to, plan.to))
    fail(`Read-back schedule mismatch for maintenance ${plan.id}.`)
  if (!sameIds(maintenance.pageComponentIds || [], plan.componentIds))
    fail(`Read-back component mismatch for maintenance ${plan.id}.`)
}

async function recoverStatusReport(plan) {
  const summaries = await listOpenStatus(
    'openstatus.status_report.v1.StatusReportService',
    'statusReports',
  )
  let bestMatch

  for (const summary of summaries) {
    if (summary.title !== plan.title || !sameIds(summary.pageComponentIds || [], plan.componentIds))
      continue

    const report = await getStatusReport(summary.id)
    if (!hasEvent(report, plan.events[0]))
      continue

    const appliedEventIds = plan.events.filter(event => hasEvent(report, event)).map(event => event.id)
    if (!bestMatch || appliedEventIds.length > bestMatch.appliedEventIds.length)
      bestMatch = { statusReportId: summary.id, appliedEventIds, completed: false }
  }

  return bestMatch
}

async function recoverMaintenance(plan) {
  const summaries = await listOpenStatus(
    'openstatus.maintenance.v1.MaintenanceService',
    'maintenances',
    { pageId: targetPageId },
  )

  const match = summaries.find(maintenance => (
    maintenance.title === plan.title
    && sameInstant(maintenance.from, plan.from)
    && sameInstant(maintenance.to, plan.to)
    && sameIds(maintenance.pageComponentIds || [], plan.componentIds)
  ))

  return match ? { maintenanceId: match.id, completed: false } : null
}
async function migrateIncident(plan, ledger) {
  let record = ledger.incidents[plan.id]

  if (!record?.statusReportId) {
    record = await recoverStatusReport(plan)

    if (record) {
      ledger.incidents[plan.id] = record
      await writeLedger(ledger)
    }
    else {
      const response = await openstatus(
        'openstatus.status_report.v1.StatusReportService',
        'CreateStatusReport',
        {
          title: plan.title,
          status: plan.events[0].status,
          message: plan.events[0].message,
          date: plan.events[0].date,
          pageId: targetPageId,
          pageComponentIds: plan.componentIds,
          notify: false,
        },
      )
      const statusReportId = response.statusReport?.id
      if (!statusReportId)
        fail(`OpenStatus did not return an ID for incident ${plan.id}.`)

      record = {
        statusReportId,
        appliedEventIds: [plan.events[0].id],
        completed: false,
      }
      ledger.incidents[plan.id] = record
      await writeLedger(ledger)
    }
  }

  for (const event of plan.events.slice(1)) {
    if (record.appliedEventIds.includes(event.id))
      continue

    const report = await getStatusReport(record.statusReportId)
    if (hasEvent(report, event)) {
      record.appliedEventIds.push(event.id)
      await writeLedger(ledger)
      continue
    }

    await openstatus(
      'openstatus.status_report.v1.StatusReportService',
      'AddStatusReportUpdate',
      {
        statusReportId: record.statusReportId,
        status: event.status,
        message: event.message,
        date: event.date,
        notify: false,
      },
    )
    record.appliedEventIds.push(event.id)
    await writeLedger(ledger)
  }

  const report = await getStatusReport(record.statusReportId)
  assertReport(plan, report)
  record.completed = true
  await writeLedger(ledger)
}

async function migrateMaintenance(plan, ledger) {
  let record = ledger.maintenances[plan.id]

  if (!record?.maintenanceId) {
    record = await recoverMaintenance(plan)

    if (record) {
      ledger.maintenances[plan.id] = record
      await writeLedger(ledger)
    }
    else {
      const response = await openstatus(
        'openstatus.maintenance.v1.MaintenanceService',
        'CreateMaintenance',
        {
          title: plan.title,
          message: plan.message,
          from: plan.from,
          to: plan.to,
          pageId: targetPageId,
          pageComponentIds: plan.componentIds,
          notify: false,
        },
      )
      const maintenanceId = response.maintenance?.id
      if (!maintenanceId)
        fail(`OpenStatus did not return an ID for maintenance ${plan.id}.`)

      record = { maintenanceId, completed: false }
      ledger.maintenances[plan.id] = record
      await writeLedger(ledger)
    }
  }

  const maintenance = await getMaintenance(record.maintenanceId)
  assertMaintenance(plan, maintenance)
  record.completed = true
  await writeLedger(ledger)
}

async function main() {
  const existingLedger = await readLedger()
  const [targetOverview, sourcePages, sourceIncidents, sourceMaintenances] = await Promise.all([
    openstatus('openstatus.status_page.v1.StatusPageService', 'GetStatusPageOverview', { id: targetPageId }),
    listHyperpingStatusPages(),
    hyperping('/v3/incidents'),
    listHyperpingMaintenances(),
  ])

  const targetPage = targetOverview.statusPage
  if (!targetPage)
    fail(`OpenStatus page ${targetPageId} was not returned.`)

  const requestedSourcePageIds = (process.env.HYPERPING_STATUS_PAGE_IDS || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean)
  const sourcePagesForTarget = sourcePages.filter((page) => {
    if (requestedSourcePageIds.length)
      return requestedSourcePageIds.includes(page.uuid)
    return normaliseName(page.name) === normaliseName(targetPage.title)
  })

  if (!sourcePagesForTarget.length)
    fail('No Hyperping status page matched the destination page. Set HYPERPING_STATUS_PAGE_IDS explicitly.')

  const sourcePageIds = sourcePagesForTarget.map(page => page.uuid)
  const sourcePageDetails = await Promise.all(sourcePageIds.map(async id => {
    const response = await hyperping(`/v2/statuspages/${id}`)
    return response.statuspage
  }))

  const targetComponents = targetOverview.components || []
  const targetComponentsByName = new Map()
  for (const component of targetComponents) {
    const key = normaliseName(component.name)
    if (!key)
      continue
    if (targetComponentsByName.has(key))
      fail(`Duplicate OpenStatus component name prevents a safe mapping: ${component.name}`)
    targetComponentsByName.set(key, component.id)
  }

  const sourceToTargetComponents = new Map()
  for (const page of sourcePageDetails) {
    for (const section of page.sections || []) {
      for (const service of section.services || []) {
        const sourceName = localized(service.name, service.uuid)
        const targetId = targetComponentsByName.get(normaliseName(sourceName))
        if (targetId)
          sourceToTargetComponents.set(service.uuid, targetId)
      }
    }
  }

  const relevantIncidents = (sourceIncidents || []).filter(incident => (
    (incident.statuspages || []).some(id => sourcePageIds.includes(id))
  ))
  const relevantMaintenances = (sourceMaintenances || []).filter(maintenance => (
    (maintenance.statuspages || []).some(id => sourcePageIds.includes(id))
  ))
  const incidentPlans = sortByDate(relevantIncidents).map(incident => incidentPlan(incident, sourceToTargetComponents))
  const maintenancePlans = sortByDate(relevantMaintenances, 'start_date')
    .map(maintenance => maintenancePlan(maintenance, sourceToTargetComponents))
  const unmapped = [
    ...incidentPlans.flatMap(plan => plan.unmappedComponentIds.map(id => ({ kind: 'incident', sourceId: plan.id, componentId: id }))),
    ...maintenancePlans.flatMap(plan => plan.unmappedComponentIds.map(id => ({ kind: 'maintenance', sourceId: plan.id, componentId: id }))),
  ]

  const [targetReports, targetMaintenances] = await Promise.all([
    listOpenStatus('openstatus.status_report.v1.StatusReportService', 'statusReports'),
    listOpenStatus('openstatus.maintenance.v1.MaintenanceService', 'maintenances', { pageId: targetPageId }),
  ])

  const summary = {
    mode: apply ? 'apply' : 'dry-run',
    target: {
      pageId: targetPageId,
      pageTitle: targetPage.title,
      componentCount: targetComponents.length,
      existingStatusReports: targetReports.length,
      existingMaintenances: targetMaintenances.length,
    },
    source: {
      statusPageIds: sourcePageIds,
      incidentCount: relevantIncidents.length,
      incidentUpdateCount: relevantIncidents.reduce((total, incident) => total + (incident.updates || []).length, 0),
      syntheticIncidentStartCount: incidentPlans.reduce((total, plan) => total + Number(plan.events[0].synthetic), 0),
      laterIncidentTimestampOmittedCount: incidentPlans.reduce((total, plan) => total + Number(plan.sourceTimestampAfterFirstUpdate), 0),
      maintenanceCount: relevantMaintenances.length,
      maintenanceUpdateCount: maintenancePlans.reduce((total, plan) => total + plan.sourceUpdateCount, 0),
    },
    mapping: {
      sourceComponentsMapped: sourceToTargetComponents.size,
      unmapped,
    },
    fidelity: {
      statusReportUpdates: 'preserved as OpenStatus timeline entries',
      maintenanceUpdates: 'preserved in the OpenStatus maintenance message because the target has no maintenance-update timeline API',
      maintenanceStatus: 'derived from the historical from/to schedule',
      notifications: 'disabled for imported historical records',
    },
    ledgerPath: basename(ledgerPath),
  }
  console.log(JSON.stringify(summary, null, 2))

  if (!apply)
    return

  if (unmapped.length)
    fail('Refusing to apply: one or more source components have no mapped OpenStatus component.')
  if (existingLedger && existingLedger.targetPageId !== targetPageId)
    fail('Ledger targetPageId does not match OPENSTATUS_PAGE_ID.')
  if (!existingLedger && (targetReports.length || targetMaintenances.length))
    fail('Refusing to apply against a non-empty target history without a migration ledger.')

  const ledger = existingLedger || newLedger(sourcePageIds)
  if (!existingLedger)
    await writeLedger(ledger)

  for (const plan of incidentPlans)
    await migrateIncident(plan, ledger)

  for (const plan of maintenancePlans)
    await migrateMaintenance(plan, ledger)

  console.log(JSON.stringify({
    result: 'complete',
    statusReports: Object.keys(ledger.incidents).length,
    maintenances: Object.keys(ledger.maintenances).length,
    ledgerPath,
  }, null, 2))
}

await main()
