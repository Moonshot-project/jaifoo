export interface GameResultUI {
  id: string // result id (e.g. "knight", "sage", "explorer")
  title: string // short headline/quote
  description: string // longer reflection text
  imageUrl: string // dynamic image path
  themeColors: [string, string] // up to 2 theme colors (e.g., gradient start/end)
  stats: {
    stressScore: number
    happinessScore: number
    cash: number
  }
}
