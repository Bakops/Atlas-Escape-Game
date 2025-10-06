"use client";
import { GameHeader } from "@/components/game-header";
import { PuzzleScreen, type Puzzle } from "@/components/puzzle-screen";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { WorldMap, type Continent } from "@/components/world-map";
import { Play, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";

type GameScreen =
  | "welcome"
  | "lobby"
  | "map"
  | "puzzle"
  | "meta"
  | "finale"
  | "debrief";

const PUZZLES: Record<string, Puzzle> = {
  europe: {
    id: "europe",
    continent: "Europe",
    type: "word",
    question:
      "Dans quelle langue dit-on 'Bonjour' de cette façon : 'Guten Tag' ? Entrez le nom du pays en 9 lettres.",
    clues: [
      "Ce pays est situé au centre de l'Europe",
      "Sa capitale est Berlin",
      "Le mot recherché commence par A",
    ],
    answer: "ALLEMAGNE",
    decoy: "AUTRICHE (7 lettres, pas 5)",
    culturalFacts: [
      "L'allemand est parlé dans plusieurs pays européens",
      "Les salutations varient selon les régions",
    ],
  },
  asia: {
    id: "asia",
    continent: "Asie",
    type: "number",
    question:
      "Combien de fuseaux horaires traverse la Chine ? (Entrez un chiffre)",
    clues: [
      "La Chine est le 3e plus grand pays du monde",
      "Officiellement, elle n'utilise qu'un seul fuseau",
    ],
    answer: "1",
    culturalFacts: [
      "Malgré sa taille, la Chine utilise un seul fuseau horaire officiel : UTC+8",
    ],
  },
  africa: {
    id: "africa",
    continent: "Afrique",
    type: "word",
    question:
      "Quel instrument à percussion est originaire d'Afrique de l'Ouest ? (5 lettres)",
    clues: [
      "C'est un tambour en forme de calice",
      "On le joue avec les mains",
      "Son nom commence par D",
    ],
    answer: "DJEMBÉ",
    culturalFacts: [
      "Le djembé est un symbole culturel important en Afrique de l'Ouest",
    ],
  },
};

export default function Home() {
  const [screen, setScreen] = useState<GameScreen>("welcome");
  const [playerName, setPlayerName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(1500);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [fragments, setFragments] = useState<string[]>([]);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);

  const [continents, setContinents] = useState<Continent[]>([
    {
      id: "europe",
      name: "Europe",
      emoji: "🏰",
      position: { x: 30, y: 25 },
      locked: false,
      completed: false,
      image: "/european-landmarks.jpg",
    },
    {
      id: "asia",
      name: "Asie",
      emoji: "🏯",
      position: { x: 70, y: 30 },
      locked: true,
      completed: false,
      image: "/asian-temples.jpg",
    },
    {
      id: "africa",
      name: "Afrique",
      emoji: "🦁",
      position: { x: 40, y: 60 },
      locked: true,
      completed: false,
      image: "/african-safari.png",
    },
    {
      id: "america",
      name: "Amérique",
      emoji: "🦁",
      position: { x: 70, y: 80 },
      locked: true,
      completed: false,
      image: "/african-safari.png",
    },
  ]);

  useEffect(() => {
    if (screen === "map" || screen === "puzzle") {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            setScreen("debrief");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [screen]);

  const handleContinentSelect = (continentId: string) => {
    const puzzle = PUZZLES[continentId];
    if (puzzle) {
      setCurrentPuzzle(puzzle);
      setScreen("puzzle");
    }
  };

  const handlePuzzleSolve = (fragment: string) => {
    setFragments([...fragments, fragment]);
    setContinents((prev) =>
      prev.map((c) => {
        if (c.id === currentPuzzle?.id) {
          return { ...c, completed: true };
        }
        const currentIndex = prev.findIndex(
          (cont) => cont.id === currentPuzzle?.id
        );
        if (prev.indexOf(c) === currentIndex + 1) {
          return { ...c, locked: false };
        }
        return c;
      })
    );

    if (fragments.length + 1 >= 3) {
      setScreen("meta");
    } else {
      setScreen("map");
    }
  };

  const handleUseHint = () => {
    setHintsUsed(hintsUsed + 1);
    setTimeRemaining((prev) => Math.max(0, prev - 60));
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-primary">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <GameHeader
        timeRemaining={
          screen === "map" || screen === "puzzle" ? timeRemaining : undefined
        }
        currentStep={
          screen === "map"
            ? `${fragments.length}/3 continents`
            : screen === "puzzle"
            ? currentPuzzle?.continent
            : undefined
        }
      />

      {screen === "welcome" && (
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-24">
          <Card className="w-full max-w-md p-8 bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-[2rem] shadow-2xl">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-4xl font-bold text-primary">Bienvenue !</h2>
                <p className="text-muted-foreground text-lg">
                  Prêt à explorer les continents ?
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Votre pseudo
                  </label>
                  <Input
                    placeholder="Entrez votre pseudo"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="rounded-full border-2 border-primary/20 focus:border-primary h-12 text-foreground bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button
                    size="lg"
                    className="rounded-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    onClick={() => setScreen("lobby")}
                    disabled={!playerName}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Créer
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full h-14 border-2 border-primary text-primary hover:bg-primary/10 font-semibold bg-transparent"
                    onClick={() => setScreen("lobby")}
                    disabled={!playerName}
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Rejoindre
                  </Button>
                </div>

                <div className="pt-4">
                  <Input
                    placeholder="Code de la partie (optionnel)"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="rounded-full border-2 border-primary/20 focus:border-primary h-12 text-center font-mono text-lg text-foreground bg-background"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="pt-6 space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>2-4 joueurs • 20-25 min</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {screen === "lobby" && (
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-24">
          <Card className="w-full max-w-2xl p-8 bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-[2rem] shadow-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-primary">
                  Briefing de Mission
                </h2>
                <p className="text-muted-foreground">
                  Code de partie:{" "}
                  <span className="font-mono font-bold text-primary">
                    ATLAS-
                    {Math.random().toString(36).substring(2, 6).toUpperCase()}
                  </span>
                </p>
              </div>

              <div className="bg-primary/5 rounded-3xl p-6 space-y-4">
                <p className="text-foreground leading-relaxed">
                  Le{" "}
                  <strong className="text-primary">Cartographe Fantôme</strong>{" "}
                  a brouillé les cartes du monde ! Votre mission : explorer 3
                  continents, résoudre leurs énigmes et reconstituer la clé
                  globale avant qu'il ne soit trop tard.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {[
                    "Navigateur·rice",
                    "Archiviste",
                    "Linguiste",
                    "Opérateur·rice",
                  ].map((role) => (
                    <div
                      key={role}
                      className="bg-card rounded-2xl p-3 border border-primary/10"
                    >
                      <span className="text-sm font-medium text-foreground">
                        {role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  size="lg"
                  className="rounded-full h-14 px-12 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg"
                  onClick={() => setScreen("map")}
                >
                  Commencer l'aventure
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {screen === "map" && (
        <div className="relative z-10 min-h-screen pt-[9rem] pb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-card mb-2">
              Choisissez votre destination
            </h2>
            <p className="text-card/80">
              Explorez les continents et résolvez leurs énigmes
            </p>
          </div>
          <WorldMap
            continents={continents}
            onContinentSelect={handleContinentSelect}
          />
        </div>
      )}

      {screen === "puzzle" && currentPuzzle && (
        <PuzzleScreen
          puzzle={currentPuzzle}
          onSolve={handlePuzzleSolve}
          onBack={() => setScreen("map")}
          hintsUsed={hintsUsed}
          onUseHint={handleUseHint}
        />
      )}

      {screen === "meta" && (
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-24">
          <Card className="w-full max-w-2xl p-8 bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-[2rem] shadow-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Trophy className="w-16 h-16 text-accent mx-auto" />
                <h2 className="text-3xl font-bold text-primary">Méta-Énigme</h2>
                <p className="text-muted-foreground">
                  Combinez vos fragments pour former la clé finale
                </p>
              </div>

              <div className="bg-primary/5 rounded-3xl p-6 space-y-4">
                <h3 className="text-lg font-bold text-primary">
                  Fragments collectés :
                </h3>
                <div className="flex justify-center gap-4">
                  {fragments.map((fragment, index) => (
                    <div
                      key={index}
                      className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-2xl font-bold text-accent-foreground shadow-lg"
                    >
                      {fragment}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Entrez la clé finale"
                  className="rounded-full border-2 border-primary/20 focus:border-primary h-14 text-center font-bold text-xl text-foreground bg-background"
                />
                <Button
                  className="w-full rounded-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
                  onClick={() => setScreen("debrief")}
                >
                  Valider la clé
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {screen === "debrief" && (
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-24">
          <Card className="w-full max-w-2xl p-8 bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-[2rem] shadow-2xl">
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <Trophy className="w-20 h-20 text-accent mx-auto" />
                <h2 className="text-4xl font-bold text-primary">
                  Mission accomplie !
                </h2>
                <p className="text-muted-foreground text-lg">
                  Vous avez déjoué le Cartographe Fantôme
                </p>
              </div>

              <div className="bg-primary/5 rounded-3xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {Math.floor(timeRemaining / 60)}:
                      {(timeRemaining % 60).toString().padStart(2, "0")}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Temps restant
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {hintsUsed}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Indices utilisés
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 rounded-3xl p-6 space-y-3">
                <h3 className="text-lg font-bold text-accent">
                  Ce que vous avez appris :
                </h3>
                <ul className="space-y-2 text-foreground text-sm">
                  {continents
                    .filter((c) => c.completed)
                    .map((c) => (
                      <li key={c.id}>
                        <strong>{c.name}</strong> :{" "}
                        {PUZZLES[c.id]?.culturalFacts[0]}
                      </li>
                    ))}
                </ul>
              </div>

              <Button
                className="w-full rounded-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
                onClick={() => {
                  setScreen("welcome");
                  setFragments([]);
                  setTimeRemaining(1500);
                  setHintsUsed(0);
                  setContinents((prev) =>
                    prev.map((c, i) => ({
                      ...c,
                      locked: i !== 0,
                      completed: false,
                    }))
                  );
                }}
              >
                Nouvelle partie
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
