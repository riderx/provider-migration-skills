import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function markdownCell(value) {
  return String(value).replaceAll('|', '\\|').replaceAll('\n', '<br>')
}

export function renderMigrationMatrix(repositoryRoot = root) {
  const registryPath = join(repositoryRoot, 'providers', 'providers.json')
  const skillsRoot = join(repositoryRoot, 'skills')
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'))
  const names = new Map(registry.providers.map(provider => [provider.id, provider.name]))
  const contracts = readdirSync(skillsRoot)
    .map(entry => join(skillsRoot, entry))
    .filter(directory => statSync(directory).isDirectory())
    .map(directory => join(directory, 'migration.json'))
    .filter(existsSync)
    .map(path => JSON.parse(readFileSync(path, 'utf8')))
    .sort((left, right) => left.skill.localeCompare(right.skill))

  const rows = contracts.flatMap(contract => contract.capabilities.map(capability => [
    '[' + contract.skill + '](skills/' + contract.skill + '/SKILL.md)',
    (names.get(contract.source) || contract.source) + ' → ' + (names.get(contract.target) || contract.target),
    capability.id,
    capability.status,
    capability.source_method,
    capability.target_method,
    capability.apply,
    capability.verification.join(', '),
    capability.notes,
  ]))

  const body = rows.map(row => '| ' + row.map(markdownCell).join(' | ') + ' |').join('\n')
  return [
    '# Provider Migration Matrix',
    '',
    '> Generated from `providers/providers.json` and each skill’s `migration.json`. Do not edit by hand; run `node scripts/build-migration-matrix.mjs`.',
    '',
    '| Skill | Route | Capability | Status | Source path | Target path | Apply | Verification | Notes |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    body,
    '',
    'Status meanings: `supported` has a documented target path; `manual` requires a deliberate human decision or browser action; `unsupported` has no warranted migration path; `not-applicable` is intentionally outside the pair’s scope.',
    '',
  ].join('\n')
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) {
  const expected = renderMigrationMatrix(root)
  const outputPath = join(root, 'MIGRATION-MATRIX.md')
  if (process.argv.includes('--check')) {
    if (!existsSync(outputPath) || readFileSync(outputPath, 'utf8') !== expected) {
      process.stderr.write('MIGRATION-MATRIX.md is stale. Run node scripts/build-migration-matrix.mjs\n')
      process.exit(1)
    }
    process.stdout.write('Migration matrix is current.\n')
  }
  else {
    writeFileSync(outputPath, expected)
    process.stdout.write('Wrote MIGRATION-MATRIX.md.\n')
  }
}
