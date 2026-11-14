// Dot colours for project languages (same idea as GitHub's language dots).
const COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00add8',
  Rust: '#dea584',
  Java: '#b07219',
  Kotlin: '#a97bff',
  Swift: '#f05138',
  Dart: '#00b4ab',
  Ruby: '#701516',
  PHP: '#4f5d95',
  HTML: '#e34c26',
  CSS: '#663399',
  Shell: '#89e051',
  SQL: '#e38c00',
}

export function languageColor(language: string) {
  return COLORS[language] ?? '#8b949e'
}
