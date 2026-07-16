import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'
import { renderMigrationMatrix } from './build-migration-matrix.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const skillsRoot = join(root, 'skills')
const providersPath = join(root, 'providers', 'providers.json')
const matrixPath = join(root, 'MIGRATION-MATRIX.md')
const errors = []
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const capabilityStatuses = new Set(['supported', 'manual', 'unsupported', 'not-applicable'])
const accessMethods = new Set(['api', 'browser', 'cli', 'repo', 'manual', 'none'])
const providerAccessMethods = new Set(['api', 'browser', 'cli', 'repo'])
const applyMethods = new Set(['agent', 'human', 'none'])
const secretPatterns = [
  /\b(?:sk|os)_[A-Za-z0-9]{20,}\b/,
  /\bgh[opsu]_[A-Za-z0-9]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
]

function isWebUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  }
  catch {
    return false
  }
}

function includesSecret(value) {
  return secretPatterns.some(pattern => pattern.test(value))
}

function supportsMethod(provider, method) {
  return method === 'none' || method === 'manual' || provider?.methods.includes(method)
}

const providers = new Map()
if (!existsSync(providersPath)) {
  errors.push('Missing providers/providers.json')
}
else {
  try {
    const registry = JSON.parse(readFileSync(providersPath, 'utf8'))
    if (registry.version !== 1 || !Array.isArray(registry.providers)) {
      errors.push('providers/providers.json: expected version 1 and providers array')
    }
    else {
      for (const provider of registry.providers) {
        if (!provider || typeof provider.id !== 'string' || !namePattern.test(provider.id)) {
          errors.push('providers/providers.json: each provider needs a lowercase-hyphen ID')
          continue
        }
        if (providers.has(provider.id))
          errors.push('providers/providers.json: duplicate provider ID ' + provider.id)
        providers.set(provider.id, provider)
        if (typeof provider.name !== 'string' || provider.name.trim() === '')
          errors.push('providers/providers.json: ' + provider.id + ' needs a name')
        if (!Array.isArray(provider.domains) || provider.domains.length === 0)
          errors.push('providers/providers.json: ' + provider.id + ' needs at least one domain')
        if (!Array.isArray(provider.methods) || provider.methods.length === 0 || provider.methods.some(method => !providerAccessMethods.has(method)))
          errors.push('providers/providers.json: ' + provider.id + ' needs documented api/browser/cli/repo methods')
        else if (new Set(provider.methods).size !== provider.methods.length)
          errors.push('providers/providers.json: ' + provider.id + ' has duplicate methods')
        if (!Array.isArray(provider.documentation) || provider.documentation.length === 0 || provider.documentation.some(documentation => typeof documentation !== 'string' || !isWebUrl(documentation)))
          errors.push('providers/providers.json: ' + provider.id + ' needs at least one valid documentation URL')
      }
    }
  }
  catch {
    errors.push('providers/providers.json: invalid JSON')
  }
}

if (!existsSync(skillsRoot)) {
  errors.push('Missing skills/ directory')
}
else {
  for (const entry of readdirSync(skillsRoot)) {
    const directory = join(skillsRoot, entry)
    if (!statSync(directory).isDirectory())
      continue

    const skillPath = join(directory, 'SKILL.md')
    const contractPath = join(directory, 'migration.json')
    if (!existsSync(skillPath)) {
      errors.push(entry + ': missing SKILL.md')
      continue
    }

    const source = readFileSync(skillPath, 'utf8')
    const match = source.match(/^---\n([\s\S]*?)\n---\n/)
    if (!match) {
      errors.push(entry + ': SKILL.md must start with YAML frontmatter')
      continue
    }

    const frontmatter = match[1]
    const name = frontmatter.match(/^name:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '')
    const description = frontmatter.match(/^description:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '')

    if (!name) {
      errors.push(entry + ': missing frontmatter name')
    }
    else if (!namePattern.test(name) || name.length > 64) {
      errors.push(entry + ': name must be 1-64 lowercase alphanumeric/hyphen characters without consecutive hyphens')
    }
    else if (name !== entry) {
      errors.push(entry + ': frontmatter name must match its directory (' + name + ')')
    }

    if (!description) {
      errors.push(entry + ': missing frontmatter description')
    }
    else if (description.length > 1024) {
      errors.push(entry + ': description must be at most 1024 characters')
    }

    if (source.split('\n').length > 500)
      errors.push(entry + ': SKILL.md exceeds 500 lines; move detail into references/')

    if (includesSecret(source))
      errors.push(entry + ': contains a credential-shaped string')

    if (!existsSync(contractPath)) {
      errors.push(entry + ': missing migration.json')
      continue
    }

    try {
      const contractSource = readFileSync(contractPath, 'utf8')
      const contract = JSON.parse(contractSource)
      if (includesSecret(contractSource))
        errors.push(entry + ': migration.json contains a credential-shaped string')
      if (contract.version !== 1)
        errors.push(entry + ': migration.json must declare version 1')
      if (contract.skill !== entry)
        errors.push(entry + ': migration.json skill must match its directory')
      if (typeof contract.summary !== 'string' || contract.summary.trim() === '')
        errors.push(entry + ': migration.json needs a summary')
      for (const side of ['source', 'target']) {
        if (typeof contract[side] !== 'string' || !providers.has(contract[side]))
          errors.push(entry + ': unknown ' + side + ' provider ' + String(contract[side]))
      }
      if (contract.source === contract.target)
        errors.push(entry + ': source and target provider must differ')

      const sourceProvider = providers.get(contract.source)
      const targetProvider = providers.get(contract.target)
      if (!Array.isArray(contract.capabilities) || contract.capabilities.length === 0) {
        errors.push(entry + ': migration.json needs at least one capability')
      }
      else {
        const capabilityIds = new Set()
        for (const capability of contract.capabilities) {
          const label = entry + ': capability ' + String(capability?.id)
          if (!capability || typeof capability.id !== 'string' || !namePattern.test(capability.id))
            errors.push(label + ' needs a lowercase-hyphen ID')
          else if (capabilityIds.has(capability.id))
            errors.push(label + ' is duplicated')
          else
            capabilityIds.add(capability.id)

          const status = capability?.status
          const sourceMethod = capability?.source_method
          const targetMethod = capability?.target_method
          const apply = capability?.apply
          if (!capabilityStatuses.has(status))
            errors.push(label + ' has invalid status')
          if (!accessMethods.has(sourceMethod))
            errors.push(label + ' has invalid source_method')
          else if (!supportsMethod(sourceProvider, sourceMethod))
            errors.push(label + ' source_method is not available for ' + String(contract.source))
          if (!accessMethods.has(targetMethod))
            errors.push(label + ' has invalid target_method')
          else if (!supportsMethod(targetProvider, targetMethod))
            errors.push(label + ' target_method is not available for ' + String(contract.target))
          if (!applyMethods.has(apply))
            errors.push(label + ' has invalid apply value')
          if (!Array.isArray(capability?.verification) || capability.verification.length === 0 || capability.verification.some(gate => typeof gate !== 'string' || gate.trim() === ''))
            errors.push(label + ' needs non-empty verification gates')
          if (typeof capability?.notes !== 'string' || capability.notes.trim() === '')
            errors.push(label + ' needs notes')

          if ((status === 'unsupported' || status === 'not-applicable') && (targetMethod !== 'none' || apply !== 'none'))
            errors.push(label + ' ' + status + ' capabilities must use target_method none and apply none')
          if (targetMethod === 'none' && apply !== 'none')
            errors.push(label + ' with target_method none must use apply none')
          if (status === 'supported' && (targetMethod === 'none' || apply === 'none'))
            errors.push(label + ' supported capabilities need a target path and an actor')
          if (status === 'manual' && (targetMethod === 'none' || apply === 'none'))
            errors.push(label + ' manual capabilities need a target path and an actor')
        }
      }
    }
    catch {
      errors.push(entry + ': invalid migration.json')
    }
  }
}

try {
  const expectedMatrix = renderMigrationMatrix(root)
  if (!existsSync(matrixPath) || readFileSync(matrixPath, 'utf8') !== expectedMatrix)
    errors.push('MIGRATION-MATRIX.md is missing or stale; run node scripts/build-migration-matrix.mjs')
}
catch {
  errors.push('Could not render MIGRATION-MATRIX.md from migration contracts')
}

if (errors.length > 0) {
  process.stderr.write('Skill validation failed:\n' + errors.map(error => '- ' + error).join('\n') + '\n')
  process.exit(1)
}

process.stdout.write('Skill validation passed.\n')
