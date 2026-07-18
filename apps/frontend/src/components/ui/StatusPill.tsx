import React from 'react';

interface StatusPillProps {
  status: 'Open' | 'Breaching' | 'Acknowledged' | 'Monitoring' | 'Investigating' | 'Resolved' | 'Online' | 'Offline' | 'Warning' | 'Critical' | string;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'md' }) => {
  let bgColor = 'bg-surface-container-highest';
  let textColor = 'text-on-surface-variant';
  
  const normalizedStatus = status.toLowerCase();

  if (['open', 'breaching', 'critical', 'offline'].includes(normalizedStatus)) {
    bgColor = 'bg-functional-red/20';
    textColor = 'text-functional-red';
  } else if (['acknowledged', 'monitoring', 'investigating', 'warning'].includes(normalizedStatus)) {
    bgColor = 'bg-functional-amber/20';
    textColor = 'text-functional-amber';
  } else if (['resolved', 'online', 'active'].includes(normalizedStatus)) {
    bgColor = 'bg-primary-container/20';
    textColor = 'text-primary-container';
  }

  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs';
  const padding = size === 'sm' ? 'px-2 py-0.5' : 'px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${textSize} ${padding} ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};
