import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const skillsRoot = join(root, 'skills')
const errors = []
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const secretPatterns = [
  /\b(?:sk|os)_[A-Za-z0-9]{20,}\b/,
  /\bgh[opsu]_[A-Za-z0-9]{20,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
]

if (!existsSync(skillsRoot)) {
  errors.push('Missing skills/ directory')
}
else {
  for (const entry of readdirSync(skillsRoot)) {
    const directory = join(skillsRoot, entry)
    if (!statSync(directory).isDirectory())
      continue

    const skillPath = join(directory, 'SKILL.md')
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

    if (secretPatterns.some(pattern => pattern.test(source)))
      errors.push(entry + ': contains a credential-shaped string')
  }
}

if (errors.length > 0) {
  process.stderr.write('Skill validation failed:\n' + errors.map(error => '- ' + error).join('\n') + '\n')
  process.exit(1)
}

process.stdout.write('Skill validation passed.\n')
