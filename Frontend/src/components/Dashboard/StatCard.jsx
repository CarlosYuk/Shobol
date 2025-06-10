import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500 text-emerald-600 bg-emerald-50',
    lime: 'bg-lime-500 text-lime-600 bg-lime-50',
    amber: 'bg-amber-500 text-amber-600 bg-amber-50',
    red: 'bg-red-500 text-red-600 bg-red-50',
    teal: 'bg-teal-500 text-teal-600 bg-teal-50'
  };

  const [bgColor, textColor, lightBg] = colorClasses[color].split(' ');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-stone-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-stone-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-stone-500 ml-1">vs mes anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${lightBg}`}>
          <Icon className={`h-6 w-6 ${textColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;