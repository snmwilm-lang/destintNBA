import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { MainMenu } from './screens/MainMenu';
import { CharacterCreation } from './screens/CharacterCreation';
import { GameScreen } from './screens/GameScreen';
import { AchievementsScreen } from './screens/AchievementsScreen';

type View = 'menu' | 'create' | 'achievements';

function App() {
  const [view, setView] = useState<View>('menu');
  const activeCareerId = useGameStore((s) => s.activeCareerId);
  const careers = useGameStore((s) => s.careers);
  const exitToMenu = useGameStore((s) => s.exitToMenu);

  const activeCareer = careers.find((c) => c.id === activeCareerId);

  if (activeCareer) {
    return (
      <GameScreen
        career={activeCareer}
        onOpenMenu={() => {
          exitToMenu();
          setView('menu');
        }}
        onRestart={() => {
          exitToMenu();
          setView('create');
        }}
      />
    );
  }

  if (view === 'create') {
    return <CharacterCreation onCancel={() => setView('menu')} onCreated={() => setView('menu')} />;
  }

  if (view === 'achievements') {
    return <AchievementsScreen onBack={() => setView('menu')} />;
  }

  return <MainMenu onNewCareer={() => setView('create')} onOpenAchievements={() => setView('achievements')} />;
}

export default App;
