import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell
} from 'recharts';

const FinancialChart = ({ type = 'bar', data = [], title }) => {
  if (!data || data.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1625] border border-primary/30 p-3 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="text-xs font-black text-primary uppercase tracking-widest mb-1">{label}</p>
          <p className="text-sm font-bold text-white">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full mt-4 p-4 rounded-2xl bg-black/20 border border-white/5 animate-in fade-in zoom-in duration-500">
      {title && (
        <h4 className="text-xs font-black text-text-secondary/50 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {title}
        </h4>
      )}
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B5CF0" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7B5CF0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 10}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 10}}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#7B5CF0" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1500}
              />
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 10}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 10}}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(123, 92, 240, 0.05)'}} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === data.length - 1 ? '#1EAEDB' : '#7B5CF0'} 
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-between text-[10px] text-text-secondary/40 font-bold uppercase tracking-widest px-2">
        <span>Real-time Simulation Data</span>
        <span className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-emerald-500" />
            Live Analysis
        </span>
      </div>
    </div>
  );
};

export default FinancialChart;
