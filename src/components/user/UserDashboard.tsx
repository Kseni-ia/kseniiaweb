import { Chat } from './Chat';
import { Calendar } from './Calendar';
import { Credits } from './Credits';

type ActiveTab = 'chat' | 'calendar' | 'credits';

interface UserDashboardProps {
  defaultTab: ActiveTab;
}

export function UserDashboard({ defaultTab }: UserDashboardProps) {
  const renderContent = () => {
    switch (defaultTab) {
      case 'chat':
        return <Chat />;
      case 'calendar':
        return <Calendar />;
      case 'credits':
        return <Credits />;
      default:
        return <Chat />;
    }
  };

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] px-4">
      <div className="bg-white rounded-lg shadow-lg p-6 h-full">
        {renderContent()}
      </div>
    </div>
  );
}
