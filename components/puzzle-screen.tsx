"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Lightbulb, ArrowLeft, CheckCircle2, XCircle } from "lucide-react"

export interface Puzzle {
  id: string
  continent: string
  type: "word" | "number" | "directions" | "clock"
  question: string
  clues: string[]
  answer: string
  decoy?: string
  culturalFacts: string[]
}

interface PuzzleScreenProps {
  puzzle: Puzzle
  onSolve: (fragment: string) => void
  onBack: () => void
  hintsUsed: number
  onUseHint: () => void
}

export function PuzzleScreen({ puzzle, onSolve, onBack, hintsUsed, onUseHint }: PuzzleScreenProps) {
  const [userAnswer, setUserAnswer] = useState("")
  const [showClues, setShowClues] = useState(false)
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)

  const handleSubmit = () => {
    if (userAnswer.toUpperCase() === puzzle.answer.toUpperCase()) {
      setFeedback("correct")
      setTimeout(() => {
        onSolve(puzzle.answer.charAt(0))
      }, 1500)
    } else {
      setFeedback("incorrect")
      setTimeout(() => setFeedback(null), 2000)
    }
  }

  const handleUseHint = () => {
    onUseHint()
    setShowClues(true)
  }

  return (
    <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-24 pb-8">
      <Card className="w-full max-w-2xl p-8 bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-[2rem] shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div className="bg-primary/10 px-4 py-2 rounded-full">
              <span className="text-sm font-bold text-primary">{puzzle.continent}</span>
            </div>
          </div>

          {/* Question */}
          <div className="bg-primary/5 rounded-3xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-primary">Énigme</h3>
            <p className="text-foreground leading-relaxed text-lg">{puzzle.question}</p>
          </div>

          {/* Clues */}
          {showClues && (
            <div className="bg-accent/10 rounded-3xl p-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
              <h4 className="text-sm font-bold text-accent flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Indices
              </h4>
              <ul className="space-y-2">
                {puzzle.clues.slice(0, hintsUsed).map((clue, index) => (
                  <li key={index} className="text-foreground text-sm leading-relaxed">
                    • {clue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Answer input */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {puzzle.type === "word" && "Entrez le mot (5 lettres)"}
                {puzzle.type === "number" && "Entrez les chiffres"}
                {puzzle.type === "directions" && "Entrez la séquence (↑↓←→)"}
                {puzzle.type === "clock" && "Entrez l'heure (HH:MM)"}
              </label>
              <Input
                placeholder={
                  puzzle.type === "word"
                    ? "XXXXX"
                    : puzzle.type === "number"
                      ? "1234"
                      : puzzle.type === "clock"
                        ? "12:00"
                        : "↑↓←→"
                }
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="rounded-full border-2 border-primary/20 focus:border-primary h-14 text-center font-bold text-xl text-foreground bg-background"
                maxLength={puzzle.type === "word" ? 5 : puzzle.type === "clock" ? 5 : 10}
              />
            </div>

            {/* Feedback */}
            {feedback && (
              <div
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl animate-in fade-in zoom-in duration-300 ${
                  feedback === "correct" ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
                }`}
              >
                {feedback === "correct" ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold">Correct ! Fragment obtenu</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    <span className="font-bold">Incorrect, réessayez</span>
                  </>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-full h-12 border-2 border-accent text-accent hover:bg-accent/10 font-semibold bg-transparent"
                onClick={handleUseHint}
                disabled={hintsUsed >= puzzle.clues.length || showClues}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Indice (-60s)
              </Button>
              <Button
                className="flex-1 rounded-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                onClick={handleSubmit}
                disabled={!userAnswer || feedback === "correct"}
              >
                Valider
              </Button>
            </div>
          </div>

          {/* Decoy warning */}
          {puzzle.decoy && (
            <div className="bg-muted/50 rounded-2xl p-4 text-center">
              <p className="text-xs text-muted-foreground">
                Attention : un élément peut être trompeur. Vérifiez vos indices !
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
