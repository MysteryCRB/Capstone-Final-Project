import React from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Search, Bell, Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import IOCAnalysis from './components/IOCAnalysis';
import AlertDashboard from './components/AlertDashboard';
import ThreatIntel from './components/ThreatIntel';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-cyber-dark text-gray-100">
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 p-6">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-cyber-darker rounded-lg"
              >
                <Menu className="w-6 h-6 text-cyber-blue" />
              </motion.button>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-8 h-8 text-cyber-blue" />
                SOC Command Center
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="relative p-2 hover:bg-cyber-darker rounded-lg"
              >
                <Bell className="w-6 h-6 text-cyber-blue" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-cyber-red rounded-full" />
              </motion.button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-2"
            >
              <AlertDashboard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <IOCAnalysis />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ThreatIntel />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;