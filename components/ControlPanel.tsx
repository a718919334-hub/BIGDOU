import React, { useRef } from 'react';
import { PatternConfig, BeadBrand, BeadSize, BeadColor } from '../types';
import { BRAND_DISPLAY_NAMES, MIN_PIXELS, MAX_PIXELS } from '../constants';

interface ControlPanelProps {
  config: PatternConfig;
  onChange: (config: PatternConfig) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageGenerated: (url: string) => void;
  onDownload: () => void;
  originalImageSrc?: string | null;
  beadColors: BeadColor[];
  onCloseMobile?: () => void;
}

// 0 = Off (Original), 10 = Max Merging (Levels=2)
const POSTERIZE_LEVELS = [0, 40, 30, 24, 18, 14, 10, 7, 5, 3, 2];

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  config, 
  onChange, 
  onFileUpload, 
  onImageGenerated,
  onDownload,
  originalImageSrc,
  beadColors,
  onCloseMobile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateConfig = (key: keyof PatternConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const brands: BeadBrand[] = ['Original', 'Mard', 'Coco', 'Manman', 'Panpan', 'Mixiaowo'];
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const totalBeads = beadColors.reduce((acc, curr) => acc + curr.count, 0);

  // Reusable Section Header Component
  const SectionHeader = ({ num, title }: { num: string, title: string }) => (
    <div className="flex items-center gap-2 mb-3">
      <span className="flex items-center justify-center w-5 h-5 rounded-md bg-slate-100 text-[10px] font-black text-slate-500 border border-slate-200">
        {num}
      </span>
      <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">{title}</h3>
    </div>
  );

  // Helper for Posterize Slider
  const currentPosterizeIndex = POSTERIZE_LEVELS.indexOf(config.posterizeLevels);
  const sliderValue = currentPosterizeIndex === -1 ? 0 : currentPosterizeIndex;

  const handlePosterizeChange = (newIndex: number) => {
    const safeIndex = Math.max(0, Math.min(POSTERIZE_LEVELS.length - 1, newIndex));
    updateConfig('posterizeLevels', POSTERIZE_LEVELS[safeIndex]);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-lg font-black text-slate-800 tracking-tight">参数配置</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Control Panel</p>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 bg-slate-50 border border-slate-200 rounded-xl active:scale-95 transition-transform">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* 1. Upload Section */}
        <div>
          <SectionHeader num="1" title="图片来源" />
          <div className="relative">
            <input type="file" ref={fileInputRef} accept="image/*" onChange={onFileUpload} className="hidden" />
            <div 
              onClick={triggerFileUpload}
              className={`group relative w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center active:scale-[0.99]
                ${originalImageSrc 
                  ? 'h-32 border-indigo-200 bg-indigo-50/30' 
                  : 'h-36 border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-slate-50/80'
                }`}
            >
              {originalImageSrc ? (
                <>
                  <img src={originalImageSrc} className="w-full h-full object-cover opacity-100 group-hover:opacity-40 transition-all duration-300" alt="预览图" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/60 backdrop-blur-sm">
                    <span className="text-xs font-bold text-indigo-600 bg-white px-4 py-2 rounded-xl border border-indigo-100 shadow-sm">
                      更换图片
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center p-4 flex flex-col items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-600">点击上传</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">支持 JPG / PNG</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Brand Selection */}
        <div>
          <SectionHeader num="2" title="品牌与算法" />
          <div className="space-y-3">
            <div className="relative">
              <select 
                  value={config.selectedBrand}
                  onChange={(e) => updateConfig('selectedBrand', e.target.value as BeadBrand)}
                  className="w-full bg-slate-50 border-2 border-slate-100 hover:border-slate-200 rounded-xl py-3.5 pl-4 pr-10 text-xs font-bold text-slate-700 appearance-none focus:border-indigo-500 focus:ring-0 outline-none transition-colors cursor-pointer"
              >
                  {brands.map(brand => (
                  <option key={brand} value={brand}>{BRAND_DISPLAY_NAMES[brand]}</option>
                  ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              <button 
                  onClick={() => updateConfig('showLabels', !config.showLabels)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all active:scale-95 border
                  ${config.showLabels 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
              >
                  显示色号
              </button>
              <button 
                  onClick={() => updateConfig('ditheringEnabled', !config.ditheringEnabled)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all active:scale-95 border
                  ${config.ditheringEnabled 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
              >
                  抖动算法
              </button>
            </div>
          </div>
        </div>

        {/* 3. Canvas Adjustment (Width & Grid) */}
        <div className="pt-2">
          <SectionHeader num="3" title="画布调整" />
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-5">
            
            {/* Width Control */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">拼豆数量</span>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{config.pixelWidth} px</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400">{MIN_PIXELS}</span>
                <input 
                    type="range" 
                    min={MIN_PIXELS} 
                    max={MAX_PIXELS} 
                    value={config.pixelWidth} 
                    onChange={(e) => updateConfig('pixelWidth', parseInt(e.target.value))} 
                    className="flex-1 h-2 bg-slate-200 rounded-full appearance-none accent-indigo-500 cursor-pointer" 
                />
                <span className="text-[10px] font-bold text-slate-400">{MAX_PIXELS}</span>
              </div>
            </div>

            {/* Grid Opacity Control */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">网格透明度</span>
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">{Math.round(config.gridOpacity * 100)}%</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400">0%</span>
                <input 
                    type="range" 
                    min={0} 
                    max={1} 
                    step={0.05}
                    value={config.gridOpacity} 
                    onChange={(e) => updateConfig('gridOpacity', parseFloat(e.target.value))} 
                    className="flex-1 h-2 bg-slate-200 rounded-full appearance-none accent-indigo-500 cursor-pointer" 
                />
                <span className="text-[10px] font-bold text-slate-400">100%</span>
              </div>
            </div>

          </div>
        </div>

        {/* 4. Color Processing */}
        <div className="pt-2">
           <SectionHeader num="4" title="色彩处理" />
           <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
             <div className="flex items-center justify-between mb-3">
               <span className="text-xs font-bold text-slate-500">色彩拼合度</span>
               <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">Lv. {sliderValue}</span>
             </div>
             <div className="flex items-center gap-3">
               <span className="text-[10px] font-bold text-slate-400">原图</span>
               <input 
                  type="range" 
                  min={0} 
                  max={POSTERIZE_LEVELS.length - 1} 
                  step={1}
                  value={sliderValue} 
                  onChange={(e) => handlePosterizeChange(parseInt(e.target.value))} 
                  className="flex-1 h-2 bg-slate-200 rounded-full appearance-none accent-indigo-500 cursor-pointer" 
               />
               <span className="text-[10px] font-bold text-slate-400">极简</span>
             </div>
           </div>
        </div>

        {/* Sidebar Material List Preview */}
        {beadColors.length > 0 && (
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-800">色彩预览</span>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{totalBeads} 颗</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {beadColors.sort((a, b) => b.count - a.count).slice(0, 30).map((color, idx) => (
                <div key={idx} className="aspect-square rounded-md border border-slate-100/50 shadow-sm relative overflow-hidden group cursor-default" style={{ backgroundColor: color.hex }}>
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
              ))}
              {beadColors.length > 30 && (
                 <div className="aspect-square rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-400">
                    +{beadColors.length - 30}
                 </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;