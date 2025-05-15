import React from 'react';
import { Search, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const IOCAnalysis = () => {
  return (
    <div className="bg-cyber-darker p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Search className="w-6 h-6 text-cyber-blue" />
        IOC Analysis
      </h2>
      <div className="space-y-4">
        <div className="bg-cyber-dark p-4 rounded-lg">
          <p className="text-gray-300">IOC Analysis dashboard component</p>
        </div>
      </div>
    </div>
  );
};

export default IOCAnalysis;