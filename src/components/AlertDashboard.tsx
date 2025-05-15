import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AlertDashboard = () => {
  return (
    <div className="bg-cyber-darker p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-cyber-blue" />
        Alert Dashboard
      </h2>
      <div className="space-y-4">
        <div className="bg-cyber-dark p-4 rounded-lg">
          <p className="text-gray-300">Alert dashboard component</p>
        </div>
      </div>
    </div>
  );
};

export default AlertDashboard;