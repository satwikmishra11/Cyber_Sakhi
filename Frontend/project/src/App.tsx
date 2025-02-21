import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Bell, User, Lock, ExternalLink, Search, Settings, HelpCircle, Moon, Sun } from 'lucide-react';

interface Alert {
  id: string;
  type: 'data_misuse' | 'harassment' | 'privacy_breach';
  platform: string;
  description: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'low';
  status?: 'new' | 'in_progress' | 'resolved';
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'data_misuse',
      platform: 'Instagram',
      description: 'Your personal photos are being shared without permission',
      timestamp: '2024-03-15T10:30:00',
      severity: 'high',
      status: 'new'
    },
    {
      id: '2',
      type: 'harassment',
      platform: 'Twitter',
      description: 'Detected potential cyberbullying content targeting your profile',
      timestamp: '2024-03-15T09:15:00',
      severity: 'high',
      status: 'in_progress'
    },
    {
      id: '3',
      type: 'privacy_breach',
      platform: 'Facebook',
      description: 'Your contact information appears in a suspicious dataset',
      timestamp: '2024-03-14T18:45:00',
      severity: 'medium',
      status: 'new'
    }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setShowStats(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
      case 'in_progress':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800';
      case 'resolved':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700';
    }
  };

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      alert('Scan complete! No new threats detected.');
    }, 3000);
  };

  const handleTakeAction = (alertId: string) => {
    alert(`Taking action on alert ${alertId}. Redirecting to detailed view...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800 backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <Shield className="h-8 w-8 text-primary-600 dark:text-primary-400 transition-transform duration-300 group-hover:scale-110" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400 bg-clip-text text-transparent">
                  CyberSakhi
                </h1>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">AI-Powered Protection</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="text-secondary-600 hover:text-secondary-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
              <button 
                onClick={() => setShowHelp(!showHelp)} 
                className="text-secondary-600 hover:text-secondary-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 relative"
              >
                <HelpCircle className="h-5 w-5" />
                {showHelp && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-4 animate-scale-in">
                    <h3 className="font-medium text-primary-900 dark:text-gray-200 mb-2">Help Center</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Need assistance? Check our documentation or contact support.</p>
                  </div>
                )}
              </button>
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="text-secondary-600 hover:text-secondary-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 relative"
              >
                <Settings className="h-5 w-5" />
                {showSettings && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-4 animate-scale-in">
                    <h3 className="font-medium text-primary-900 dark:text-gray-200 mb-2">Settings</h3>
                    <div className="space-y-2">
                      <button className="block w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 py-1">
                        Account Settings
                      </button>
                      <button className="block w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 py-1">
                        Notification Preferences
                      </button>
                      <button className="block w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 py-1">
                        Privacy Settings
                      </button>
                    </div>
                  </div>
                )}
              </button>
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative group"
                >
                  <Bell className="h-6 w-6 text-secondary-500 dark:text-gray-400 cursor-pointer transition-colors duration-200 hover:text-secondary-700 dark:hover:text-gray-200" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse-custom"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 overflow-hidden animate-scale-in">
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                      <h3 className="font-medium text-primary-900 dark:text-gray-200">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {alerts.map(alert => (
                        <div key={alert.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <p className="text-sm text-gray-900 dark:text-gray-200">{alert.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div 
                onClick={() => setShowProfile(!showProfile)}
                className="relative h-8 w-8 rounded-full bg-primary-100 dark:bg-gray-700 flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 hover-glow"
              >
                <User className="h-5 w-5 text-primary-600 dark:text-gray-300" />
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-4 animate-scale-in">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-gray-700 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary-600 dark:text-gray-300" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary-900 dark:text-gray-200">John Doe</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">john.doe@example.com</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <button className="block w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 py-1">
                        View Profile
                      </button>
                      <button className="block w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 py-1">
                        Security Settings
                      </button>
                      <button className="block w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 py-1">
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" onClick={() => {
        setShowHelp(false);
        setShowSettings(false);
        setShowNotifications(false);
        setShowProfile(false);
      }}>
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {showStats && ['Active Monitors', 'Active Alerts', 'Protected Accounts'].map((title, index) => (
            <div
              key={title}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-gray-700 transition-all duration-300 p-6 hover-glow cursor-pointer ${
                selectedCard === title 
                  ? 'ring-2 ring-primary-500 dark:ring-primary-400 transform scale-105' 
                  : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCard(selectedCard === title ? null : title);
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600 dark:text-gray-400">{title}</p>
                  <p className="text-2xl font-semibold text-primary-900 dark:text-gray-200">
                    {title === 'Active Alerts' ? alerts.length : title === 'Active Monitors' ? 3 : 4}
                  </p>
                  <p className="text-xs text-secondary-400 dark:text-gray-500 mt-1">
                    {index === 0 ? 'Real-time tracking' : index === 1 ? 'Requires attention' : 'Under protection'}
                  </p>
                </div>
                {index === 0 && <Search className="h-8 w-8 text-primary-500 dark:text-primary-400 group-hover:animate-bounce-slow" />}
                {index === 1 && <AlertTriangle className="h-8 w-8 text-yellow-500 dark:text-yellow-400 group-hover:animate-pulse" />}
                {index === 2 && <Lock className="h-8 w-8 text-green-500 dark:text-green-400" />}
              </div>
            </div>
          ))}
        </div>

        {/* Scan Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleScan}
            disabled={scanning}
            className={`px-8 py-4 rounded-full text-white font-medium flex items-center space-x-3 transform transition-all duration-300 hover:scale-105 hover-glow ${
              scanning 
                ? 'bg-secondary-400 dark:bg-secondary-600 animate-pulse-custom cursor-not-allowed' 
                : 'bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-500 dark:to-secondary-500 hover:shadow-lg hover:from-primary-700 hover:to-secondary-700 dark:hover:from-primary-600 dark:hover:to-secondary-600'
            }`}
          >
            <Search className={`h-5 w-5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Scanning...' : 'Scan Now'}</span>
          </button>
        </div>

        {/* Alerts Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-700 overflow-hidden hover-glow">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-700 dark:to-gray-900">
            <h2 className="text-lg font-medium text-primary-900 dark:text-gray-200">Recent Alerts</h2>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {alerts.map((alert, index) => (
              <div 
                key={alert.id} 
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 animate-fade-in group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm transition-all duration-200 hover:scale-105 ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(alert.status)}`}>
                        {alert.status?.replace('_', ' ').toUpperCase() || 'PENDING'}
                      </span>
                      <span className="text-sm font-medium text-secondary-600 dark:text-gray-400">{alert.platform}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-900 dark:text-gray-200">{alert.description}</p>
                    <p className="mt-2 text-xs text-secondary-500 dark:text-gray-400">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleTakeAction(alert.id)}
                    className="ml-4 flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 opacity-0 group-hover:opacity-100 animate-fade-in"
                  >
                    Take Action
                    <ExternalLink className="ml-1 h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <span className="text-sm text-secondary-600 dark:text-gray-400">CyberSakhi</span>
            </div>
            <div className="text-sm text-secondary-500 dark:text-gray-500">
              © {new Date().getFullYear()} CyberSakhi by Satwik Mishra. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;