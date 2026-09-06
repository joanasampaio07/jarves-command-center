import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';
import { Layout, PageName } from './components/Layout';
import { VoiceModal } from './components/VoiceModal';
import { QuickActionModal } from './components/QuickActionModal';

// Pages
import { CommandCenter } from './pages/CommandCenter';
import { VoiceChat } from './pages/VoiceChat';
import { TextChat } from './pages/TextChat';
import { Tasks } from './pages/Tasks';
import { Finances } from './pages/Finances';
import { Habits } from './pages/Habits';
import { Projects } from './pages/Projects';
import { Calendar } from './pages/Calendar';
import { Integrations } from './pages/Integrations';
import { Personalization } from './pages/Personalization';
import { Analytics } from './pages/Analytics';
import { HowToUse } from './pages/HowToUse';
import { News } from './pages/News';
import { Settings } from './pages/Settings';
import { Admin } from './pages/Admin';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageName>('VoiceChat');
  const { isVoiceListening, setIsVoiceListening, activeQuickAction, setActiveQuickAction } = useApp();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'Dashboard':
      case 'CommandCenter':
        return <CommandCenter onNavigate={setCurrentPage} />;
      case 'VoiceChat':
        return <VoiceChat />;
      case 'TextChat':
        return <TextChat />;
      case 'Tasks':
        return <Tasks />;
      case 'Finances':
        return <Finances />;
      case 'Habits':
        return <Habits />;
      case 'Projects':
        return <Projects />;
      case 'Calendar':
        return <Calendar />;
      case 'Integrations':
        return <Integrations />;
      case 'Personalization':
        return <Personalization />;
      case 'Analytics':
        return <Analytics />;
      case 'HowToUse':
        return <HowToUse />;
      case 'News':
        return <News />;
      case 'Settings':
        return <Settings />;
      case 'Admin':
        return <Admin />;
      default:
        return <VoiceChat />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderCurrentPage()}

      {/* Global Voice Modal */}
      <VoiceModal
        isOpen={isVoiceListening}
        onClose={() => setIsVoiceListening(false)}
        onCommandProcessed={(cmd) => {
          console.log('Voice command:', cmd);
        }}
      />

      {/* Global Quick Action Creation Modal */}
      <QuickActionModal
        isOpen={activeQuickAction !== null}
        defaultTab={activeQuickAction}
        onClose={() => setActiveQuickAction(null)}
      />
    </Layout>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;
