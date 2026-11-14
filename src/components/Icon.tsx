import { HugeiconsIcon } from '@hugeicons/react'
import * as Solid from '@hugeicons-pro/core-solid-rounded'
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  ArrowUp01Icon,
  Briefcase01Icon,
  Calendar03Icon,
  Clock01Icon,
  Cancel01Icon,
  Copy01Icon,
  Download01Icon,
  File02Icon,
  GithubIcon,
  Linkedin01Icon,
  Location01Icon,
  Mail01Icon,
  Menu01Icon,
  Mortarboard01Icon,
  NewTwitterIcon,
  QuillWrite01Icon,
  RepositoryIcon,
  Search01Icon,
  SentIcon,
  SourceCodeIcon,
  TestTube01Icon,
  Tick02Icon,
  UserIcon,
  ApiIcon,
  ArrowReloadHorizontalIcon,
  Home01Icon,
  CodeIcon,
  ContainerIcon,
  CssThreeIcon,
  DashboardSpeed01Icon,
  Database01Icon,
  DatabaseIcon,
  FigmaIcon,
  GitBranchIcon,
  HtmlFiveIcon,
  Idea01Icon,
  JavaIcon,
  JavaScriptIcon,
  Layers01Icon,
  Layout01Icon,
  NpmIcon,
  PythonIcon,
  ReactIcon,
  ServerStack01Icon,
  TailwindcssIcon,
  TerminalIcon,
  Typescript01Icon,
} from '@hugeicons/core-free-icons'

// Short names → Hugeicons (free, stroke-rounded). Add more by importing from
// @hugeicons/core-free-icons and listing them here.
const ICONS = {
  repo: RepositoryIcon,
  beaker: TestTube01Icon,
  person: UserIcon,
  location: Location01Icon,
  mail: Mail01Icon,
  search: Search01Icon,
  code: SourceCodeIcon,
  briefcase: Briefcase01Icon,
  mortarboard: Mortarboard01Icon,
  external: ArrowUpRight01Icon,
  menu: Menu01Icon,
  close: Cancel01Icon,
  flip: ArrowReloadHorizontalIcon,
  home: Home01Icon,
  arrowRight: ArrowRight01Icon,
  arrowLeft: ArrowLeft01Icon,
  download: Download01Icon,
  file: File02Icon,
  copy: Copy01Icon,
  check: Tick02Icon,
  arrowUp: ArrowUp01Icon,
  send: SentIcon,
  quill: QuillWrite01Icon,
  calendar: Calendar03Icon,
  clock: Clock01Icon,
  github: GithubIcon,
  linkedin: Linkedin01Icon,
  x: NewTwitterIcon,
  // Toolbox / skills
  typescript: Typescript01Icon,
  javascript: JavaScriptIcon,
  react: ReactIcon,
  python: PythonIcon,
  java: JavaIcon,
  figma: FigmaIcon,
  tailwind: TailwindcssIcon,
  npm: NpmIcon,
  html: HtmlFiveIcon,
  css: CssThreeIcon,
  server: ServerStack01Icon,
  container: ContainerIcon,
  database: DatabaseIcon,
  databases: Database01Icon,
  sql: Database01Icon,
  git: GitBranchIcon,
  layers: Layers01Icon,
  layout: Layout01Icon,
  api: ApiIcon,
  speed: DashboardSpeed01Icon,
  idea: Idea01Icon,
  terminal: TerminalIcon,
  codeSimple: CodeIcon,
} as const

export type IconName = keyof typeof ICONS
type IconData = (typeof ICONS)[IconName]

// Solid versions (Hugeicons Pro, solid-rounded) of the same icons.
const SOLID: Record<IconName, IconData> = {
  repo: Solid.RepositoryIcon,
  beaker: Solid.TestTube01Icon,
  person: Solid.UserIcon,
  location: Solid.Location01Icon,
  mail: Solid.Mail01Icon,
  search: Solid.Search01Icon,
  code: Solid.SourceCodeIcon,
  briefcase: Solid.Briefcase01Icon,
  mortarboard: Solid.Mortarboard01Icon,
  external: Solid.ArrowUpRight01Icon,
  menu: Solid.Menu01Icon,
  close: Solid.Cancel01Icon,
  flip: Solid.ArrowReloadHorizontalIcon,
  home: Solid.Home01Icon,
  arrowRight: Solid.ArrowRight01Icon,
  arrowLeft: Solid.ArrowLeft01Icon,
  download: Solid.Download01Icon,
  file: Solid.File02Icon,
  copy: Solid.Copy01Icon,
  check: Solid.Tick02Icon,
  arrowUp: Solid.ArrowUp01Icon,
  send: Solid.SentIcon,
  quill: Solid.QuillWrite01Icon,
  calendar: Solid.Calendar03Icon,
  clock: Solid.Clock01Icon,
  github: Solid.GithubIcon,
  linkedin: Solid.Linkedin01Icon,
  x: Solid.NewTwitterIcon,
  // Toolbox / skills
  typescript: Solid.Typescript01Icon,
  javascript: Solid.JavaScriptIcon,
  react: Solid.ReactIcon,
  python: Solid.PythonIcon,
  java: Solid.JavaIcon,
  figma: Solid.FigmaIcon,
  tailwind: Solid.TailwindcssIcon,
  npm: Solid.NpmIcon,
  html: Solid.HtmlFiveIcon,
  css: Solid.CssThreeIcon,
  server: Solid.ServerStack01Icon,
  container: Solid.ContainerIcon,
  database: Solid.DatabaseIcon,
  databases: Solid.Database01Icon,
  sql: Solid.Database01Icon,
  git: Solid.GitBranchIcon,
  layers: Solid.Layers01Icon,
  layout: Solid.Layout01Icon,
  api: Solid.ApiIcon,
  speed: Solid.DashboardSpeed01Icon,
  idea: Solid.Idea01Icon,
  terminal: Solid.TerminalIcon,
  codeSimple: Solid.CodeIcon,
}

type Variant = 'line' | 'solid' | 'swap'

/**
 * `variant`:
 * - "line" (default): stroke icon
 * - "solid": filled icon (Hugeicons Pro)
 * - "swap": line icon that turns solid when an ancestor with the
 *   `hover-solid` class is hovered, focused or has `.active`
 */
export function Icon({
  name,
  size = 16,
  className,
  variant = 'line',
}: {
  name: IconName
  size?: number
  className?: string
  variant?: Variant
}) {
  if (variant === 'swap') {
    return (
      <span className={`icon-pair ${className ?? ''}`} aria-hidden="true">
        <HugeiconsIcon icon={ICONS[name]} size={size} className="icon icon-line" />
        <HugeiconsIcon icon={SOLID[name]} size={size} className="icon icon-solid" />
      </span>
    )
  }
  const data = variant === 'solid' ? SOLID[name] : ICONS[name]
  return <HugeiconsIcon icon={data} size={size} className={`icon ${className ?? ''}`} aria-hidden="true" />
}

// Picks a brand icon for a social link label from content.json.
// Picks an icon for a tool / skill name from content.json (resume.tools and
// resume.skills). Matches by keyword; anything unknown gets a code icon.
const TOOL_RULES: Array<[RegExp, IconName]> = [
  [/typescript|\bts\b/i, 'typescript'],
  [/javascript|\bjs\b/i, 'javascript'],
  [/react/i, 'react'],
  [/python/i, 'python'],
  [/java\b/i, 'java'],
  [/figma/i, 'figma'],
  [/tailwind/i, 'tailwind'],
  [/\bnpm\b/i, 'npm'],
  [/html/i, 'html'],
  [/css/i, 'css'],
  [/node|express|backend|server/i, 'server'],
  [/docker|kubernetes|container/i, 'container'],
  [/postgres|mysql|sqlite|mongo|redis/i, 'database'],
  [/database|\bsql\b|data|algorithm/i, 'databases'],
  [/\bgit\b|github|version/i, 'git'],
  [/tanstack|stack|architecture/i, 'layers'],
  [/frontend|ui|design system|layout/i, 'layout'],
  [/api|rest|graphql/i, 'api'],
  [/test/i, 'beaker'],
  [/perf|speed|optimi/i, 'speed'],
  [/product|idea|thinking|strategy|math/i, 'idea'],
  [/linux|shell|bash|terminal|ci\/cd|devops/i, 'terminal'],
]

export function toolIcon(name: string): IconName {
  return TOOL_RULES.find(([re]) => re.test(name))?.[1] ?? 'codeSimple'
}
