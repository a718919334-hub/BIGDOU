
import React from 'react';
import { BeadColor, BeadSize } from '../types';

interface BeadStatisticsProps {
  colors: BeadColor[];
  selectedSize?: BeadSize;
  onDownload?: (dpi: 72 | 300) => void;
}

const BeadStatistics: React.FC<BeadStatisticsProps> = ({ colors, selectedSize, onDownload }) => {
  const totalBeads = colors.reduce((acc, curr) => acc + curr.count, 0);
  const hasData = colors.length > 0;

  return (
    <div className="bg-white p-6 h-full flex flex-col">
      {/* Header Section */}
      <div className="flex items-end justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-lg font-black text-slate-800 tracking-tight">材料清单</h1>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                {selectedSize || '2.6mm'}
             </span>
             <span className="text-[10px] font-medium text-slate-400">
                按用量排序
             </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">总数</div>
          <div className="text-2xl font-black text-indigo-600 leading-none tracking-tight">{totalBeads}</div>
        </div>
      </div>
      
      {/* Scrollable List Content */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar -mr-2 mb-4">
        {!hasData ? (
          <div className="flex flex-col items-center justify-center h-4/5 text-center opacity-60">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <svg className="w-8 h-8 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h14V5H5z"/></svg>
            </div>
            <p className="text-sm font-bold text-slate-400">暂无数据</p>
            <p className="text-xs text-slate-300 mt-1">请先生成图纸</p>
          </div>
        ) : (
          <div className="space-y-2.5 pb-2">
            {colors.sort((a, b) => b.count - a.count).map((color, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-white hover:shadow-sm transition-all group">
                {/* Bead Color Preview */}
                <div 
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex-shrink-0 relative overflow-hidden" 
                  style={{ backgroundColor: color.hex }}
                >
                   <div className="absolute top-1 left-1.5 w-3 h-3 bg-white opacity-30 rounded-full blur-[1px]"></div>
                </div>
                
                {/* Bead Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                   <div className="flex items-baseline justify-between">
                      <span className="text-xs font-black text-slate-800 tracking-wide font-pixel">{color.id}</span>
                      <span className="text-xs font-bold text-indigo-600 tabular-nums">{color.count}</span>
                   </div>
                   <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[10px] font-bold text-slate-400 truncate max-w-[80%] uppercase">
                        {color.name?.replace('颜色 ', '') || 'COLOR'}
                      </span>
                   </div>
                   {/* Mini Progress Bar */}
                   <div className="w-full bg-slate-200 h-1 mt-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-500 opacity-80" 
                        style={{ width: `${Math.max(5, (color.count / totalBeads) * 100 * 3)}%` }} // Multiplied by 3 to make smaller bars visible relative to max
                      />
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="shrink-0 pt-4 border-t border-slate-100 space-y-3">
        <div className="flex gap-3">
          <button 
            disabled={!hasData}
            onClick={() => onDownload?.(72)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold transition-all border
              ${hasData 
                ? 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 shadow-sm active:scale-[0.98]' 
                : 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'}`}
          >
            <span>预览图</span>
            <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-400 font-medium">72dpi</span>
          </button>
          
          <button 
            disabled={!hasData}
            onClick={() => onDownload?.(300)}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-[0.98]
              ${hasData 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <span>导出图纸</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeadStatistics;
