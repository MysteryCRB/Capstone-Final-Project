import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Search, 
  BarChart2, 
  Settings,
  Users,
  FileText,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const menuItems = [
    { icon: Shield, label: 'Dashboard', active: true },
    { icon: AlertTriangle, label: 'Alerts', badge: 5 },
    { icon: Search, label: 'IOC Analysis' },
    { icon: BarChart2, label: 'Metrics' },
    { icon: FileText, label: 'Reports' },
    { icon: Terminal, label: 'Playbooks' },
    { icon: Users, label: 'Team' },
    { icon: Settings, label: 'Settings' }
  ];

  return (
    <motion.div
      initial={{ width: isOpen ? 240 : 80 }}
      animate={{ width: isOpen ? 240 : 80 }}
      className="bg-cyber-darker h-screen p-4 flex flex-col gap-8 border-r border-cyber-blue/10"
    >
      <div className="flex items-center gap-3 px-2">
        <Shield className="w-8 h-8 text-cyber-blue" />
        {isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-bold text-cyber-blue"
          >
            SecOps
          </motion.span>
        )}
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.li
              key={item.label}
              whileHover={{ x: 5 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                ${item.active ? 'bg-cyber-blue/10 text-cyber-blue' : 'hover:bg-cyber-blue/5'}`}
            >
              <item.icon className="w-6 h-6" />
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1"
                >
                  {item.label}
                </motion.span>
              )}
              {isOpen && item.badge && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-cyber-red px-2 py-0.5 rounded-full text-xs"
                >
                  {item.badge}
                </motion.span>
              )}
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-cyber-blue/10 pt-4">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-cyber-purple/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-cyber-purple" />
          </div>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-gray-400">SOC Analyst L1</div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;