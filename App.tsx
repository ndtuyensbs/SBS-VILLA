import React, { useState, useMemo, useEffect } from 'react';
import pako from 'pako';
import { Floor } from './types';
import InputCard from './components/InputCard';
import ResultsCard from './components/ResultsCard';
import { InstallIcon } from './components/icons';

const initialFloors: Floor[] = [
    // Tầng 1
    {
      id: `floor-1620000000000`,
      rooms: [
        { id: `room-1620000000000-1`, name: 'Khách', area: 30 },
        { id: `room-1620000000000-2`, name: 'Bếp + ăn', area: 50 },
        { id: `room-1620000000000-3`, name: 'Ngủ nhỏ', area: 15 },
        { id: `room-1620000000000-4`, name: 'Wc nhỏ', area: 5 },
        { id: `room-1620000000000-5`, name: 'Wc nhỏ', area: 5 },
        { id: `room-1620000000000-6`, name: 'Cầu thang', area: 10 },
        { id: `room-1620000000000-7`, name: 'Thang máy', area: 5 },
      ]
    },
    // Tầng 2
    {
      id: `floor-1620000000001`,
      rooms: [
        { id: `room-1620000000001-8`, name: 'Master', area: 50 },
        { id: `room-1620000000001-9`, name: 'Giải trí', area: 25 },
        { id: `room-1620000000001-10`, name: 'Wc nhỏ', area: 5 },
        { id: `room-1620000000001-11`, name: 'Cầu thang', area: 10 },
        { id: `room-1620000000001-12`, name: 'Thang máy', area: 5 },
        { id: `room-1620000000001-13`, name: 'Thông tầng', area: 25 },
      ]
    },
    // Tầng 3
    {
      id: `floor-1620000000002`,
      rooms: [
        { id: `room-1620000000002-14`, name: 'Master', area: 50 },
        { id: `room-1620000000002-15`, name: 'Master', area: 50 },
        { id: `room-1620000000002-16`, name: 'SHC', area: 25 },
        { id: `room-1620000000002-17`, name: 'Cầu thang', area: 10 },
        { id: `room-1620000000002-18`, name: 'Thang máy', area: 5 },
      ]
    },
    // Tầng 4
    {
      id: `floor-1620000000003`,
      rooms: [
        { id: `room-1620000000003-19`, name: 'Thờ', area: 20 },
        { id: `room-1620000000003-20`, name: 'Kho', area: 10 },
        { id: `room-1620000000003-21`, name: 'Giặt phơi', area: 10 },
        { id: `room-1620000000003-22`, name: 'Cầu thang', area: 10 },
        { id: `room-1620000000003-23`, name: 'Thang máy', area: 5 },
      ]
    }
  ];

function App() {
  const [contractName, setContractName] = useState<string>('209');
  const [landArea, setLandArea] = useState<number | string>(225);
  const [density, setDensity] = useState<number | string>(100);
  const [investmentCost, setInvestmentCost] = useState<number | string>(8.5); // in billions
  const [floors, setFloors] = useState<Floor[]>(initialFloors);
  const [copyButtonText, setCopyButtonText] = useState('Tạo liên kết chia sẻ');
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Effect for install prompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Load state from URL on initial render
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = params.get('data');
    if (data) {
      try {
        const decoded = atob(data);
        const decompressed = pako.inflate(decoded, { to: 'string' });
        const state = JSON.parse(decompressed);
        if (state.contractName) setContractName(state.contractName);
        if (state.landArea) setLandArea(state.landArea);
        if (state.density) setDensity(state.density);
        if (state.investmentCost) setInvestmentCost(state.investmentCost);
        if (state.floors) setFloors(state.floors);
      } catch (error) {
        console.error("Failed to parse state from URL", error);
        // Fallback to default state if parsing fails
      }
    }
  }, []);

  const constructionArea = useMemo(() => {
    const area = Number(landArea) || 0;
    const dens = Number(density) || 0;
    return (area * dens) / 100;
  }, [landArea, density]);

  const totalFloorArea = useMemo(() => {
    return floors.reduce((total, floor) => {
      const floorArea = floor.rooms.reduce((floorTotal, room) => floorTotal + (Number(room.area) || 0), 0);
      return total + (floorArea * 1.2);
    }, 0);
  }, [floors]);

  const investmentLevel = useMemo(() => {
    if (totalFloorArea === 0) return 0;
    const costInVND = (Number(investmentCost) || 0) * 1_000_000_000;
    return costInVND / totalFloorArea; // Result in VND / m²
  }, [investmentCost, totalFloorArea]);

  const investmentData = useMemo(() => {
    const levelInMillions = investmentLevel / 1_000_000;

    let segment = 'Không xác định';
    let rough = 0;
    let finishing = 0;
    let interior = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    if (levelInMillions < 12) {
      segment = 'Cơ bản';
    } else if (levelInMillions >= 12 && levelInMillions < 15) {
      segment = 'Giá cũ';
      const t = (levelInMillions - 12) / (15 - 12);
      rough = lerp(4, 5, t);
      finishing = lerp(4.5, 6, t);
      interior = lerp(3.5, 4, t);
    } else if (levelInMillions >= 15 && levelInMillions < 20) {
      segment = 'Villa';
      const t = (levelInMillions - 15) / (20 - 15);
      rough = lerp(5, 6, t);
      finishing = lerp(6, 7, t);
      interior = lerp(4, 7, t);
    } else if (levelInMillions >= 20 && levelInMillions <= 25) {
      segment = 'Cao cấp';
      const t = (levelInMillions - 20) / (25 - 20);
      rough = lerp(6, 8, t);
      finishing = lerp(7, 9, t);
      interior = lerp(7, 8, t);
    } else { // > 25
      segment = 'Siêu cao cấp';
    }

    return {
      segment,
      roughInvestment: rough,
      finishingInvestment: finishing,
      interiorInvestment: interior,
    };
  }, [investmentLevel]);

    const handleInstallClick = () => {
        if (!installPrompt) {
        return;
        }
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        } else {
            console.log('User dismissed the A2HS prompt');
        }
        setInstallPrompt(null);
        });
    };

  const handleShare = () => {
    const state = {
      contractName,
      landArea,
      density,
      investmentCost,
      floors,
    };
    const jsonString = JSON.stringify(state);
    const compressed = pako.deflate(jsonString, { to: 'string' });
    const encoded = btoa(compressed);
    
    const url = new URL(window.location.href);
    url.searchParams.set('data', encoded);
    
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopyButtonText('Đã sao chép!');
      setTimeout(() => setCopyButtonText('Tạo liên kết chia sẻ'), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      setCopyButtonText('Lỗi!');
      setTimeout(() => setCopyButtonText('Tạo liên kết chia sẻ'), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-7xl mb-8 text-center">
         {installPrompt && (
            <div className="mb-6">
                <button 
                    onClick={handleInstallClick} 
                    className="inline-flex items-center gap-2 py-2.5 px-6 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-transform active:scale-95 font-bold shadow-lg shadow-yellow-500/20"
                >
                    <InstallIcon className="h-5 w-5" />
                    Cài đặt ứng dụng lên PC
                </button>
            </div>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 leading-tight">
          <span className="block">SBS</span>
          <span className="block text-2xl md:text-3xl font-semibold mt-1">Thông tin hợp đồng {contractName}</span>
        </h1>
        <p className="mt-3 text-gray-400">Nhập thông tin hợp đồng và các thông số dự án để nhận phân tích tức thì.</p>
      </header>
      
      <main className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Project Info Card - First on mobile */}
        <div className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 border border-gray-700 lg:col-span-2">
          <h2 className="text-xl font-bold text-yellow-400 border-b border-gray-600 pb-3">Thông Tin Dự Án</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="contractName" className="block text-sm font-medium text-gray-400 mb-1">Tên hợp đồng</label>
              <input type="text" id="contractName" value={contractName} onChange={e => setContractName(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition" placeholder="VD: Hợp đồng nhà anh B" />
            </div>
            <div>
              <label htmlFor="landArea" className="block text-sm font-medium text-gray-400 mb-1">Diện tích khu đất (m²)</label>
              <input type="number" id="landArea" value={landArea} onChange={e => setLandArea(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition" placeholder="VD: 100" />
            </div>
            <div>
              <label htmlFor="density" className="block text-sm font-medium text-gray-400 mb-1">Mật độ xây dựng (%)</label>
              <input type="number" id="density" value={density} onChange={e => setDensity(e.target.value === '' ? '' : Math.max(0, Math.min(100, parseFloat(e.target.value))))} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition" placeholder="VD: 60" />
            </div>
            <div>
              <label htmlFor="investmentCost" className="block text-sm font-medium text-gray-400 mb-1">Chi phí đầu tư (tỷ VNĐ)</label>
              <input type="number" id="investmentCost" value={investmentCost} onChange={e => setInvestmentCost(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition" placeholder="VD: 5" />
            </div>
          </div>
          <div className="pt-4">
            <button onClick={handleShare} className="w-full py-2.5 px-4 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-700 transition-transform active:scale-95 font-semibold shadow-lg">
                {copyButtonText}
            </button>
          </div>
        </div>
        
        {/* Detailed Design Card - Second on mobile, main right column on desktop */}
        <div className="lg:col-span-3 lg:row-start-1 lg:row-span-2">
           <InputCard 
             floors={floors} setFloors={setFloors}
           />
        </div>

        {/* Results Card - Third on mobile, bottom-left on desktop */}
        <div className="lg:col-span-2 lg:sticky lg:top-8">
            <ResultsCard 
              constructionArea={constructionArea}
              totalFloorArea={totalFloorArea}
              investmentLevel={investmentLevel}
              segment={investmentData.segment}
              roughInvestment={investmentData.roughInvestment}
              finishingInvestment={investmentData.finishingInvestment}
              interiorInvestment={investmentData.interiorInvestment}
            />
        </div>
      </main>
       <footer className="w-full max-w-7xl mt-12 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} - Được phát triển cho mục đích trình diễn.</p>
       </footer>
    </div>
  );
}

export default App;