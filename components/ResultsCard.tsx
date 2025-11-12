import React from 'react';

interface ResultsCardProps {
  constructionArea: number;
  totalFloorArea: number;
  investmentLevel: number;
  segment: string;
  roughInvestment: number;
  finishingInvestment: number;
  interiorInvestment: number;
}

const ResultItem: React.FC<{ label: string; value: string; unit: string; highlight?: boolean;}> = ({ label, value, unit, highlight = false }) => (
    <div className={`p-4 rounded-lg flex justify-between items-baseline border ${highlight ? 'bg-yellow-900/20 border-yellow-800' : 'bg-gray-700/50 border-gray-700'}`}>
        <div>
            <p className="text-sm font-medium text-gray-400">{label}</p>
            <p className={`text-2xl font-bold ${highlight ? 'text-yellow-300' : 'text-yellow-400'}`}>{value}</p>
        </div>
        <span className="text-sm font-semibold text-gray-400">{unit}</span>
    </div>
);


const ResultsCard: React.FC<ResultsCardProps> = ({ 
    constructionArea, 
    totalFloorArea, 
    investmentLevel,
    segment,
    roughInvestment,
    finishingInvestment,
    interiorInvestment
}) => {

    const formatNumber = (num: number, precision: number = 2): string => {
        if (isNaN(num) || !isFinite(num)) {
            return '0';
        }
        return num.toLocaleString('vi-VN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: precision,
        });
    }

    const formatCurrency = (num: number): string => {
        if (isNaN(num) || !isFinite(num) || num === 0) {
            return '0';
        }
        return (num / 1_000_000).toLocaleString('vi-VN', {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        });
    }

  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 h-full border border-gray-700">
      <h2 className="text-2xl font-bold text-yellow-400 border-b border-gray-600 pb-4">Kết Quả Tính Toán</h2>
      <div className="space-y-4">
        <ResultItem 
            label="Diện tích xây dựng"
            value={formatNumber(constructionArea)}
            unit="m²"
        />
        <ResultItem 
            label="Tổng diện tích sàn"
            value={formatNumber(totalFloorArea)}
            unit="m²"
        />
        <ResultItem 
            label="Mức đầu tư trên mỗi m²"
            value={formatCurrency(investmentLevel)}
            unit="triệu/m²"
        />

        <div className="pt-2">
            <hr className="border-gray-700/50" />
            <p className="text-center text-xs text-gray-500 bg-gray-800 px-2 -mt-2.5 mx-auto w-fit">Tham chiếu (Nội suy)</p>
        </div>

        <ResultItem 
            label="Phân khúc"
            value={segment}
            unit=""
            highlight={true}
        />
        <ResultItem 
            label="Mức đầu tư phần thô"
            value={roughInvestment > 0 ? formatNumber(roughInvestment, 1) : '-'}
            unit="triệu/m²"
        />
         <ResultItem 
            label="Mức đầu tư phần hoàn thiện"
            value={finishingInvestment > 0 ? formatNumber(finishingInvestment, 1) : '-'}
            unit="triệu/m²"
        />
         <ResultItem 
            label="Mức đầu tư nội thất"
            value={interiorInvestment > 0 ? formatNumber(interiorInvestment, 1) : '-'}
            unit="triệu/m²"
        />

      </div>
       <div className="pt-4 text-xs text-gray-500 italic">
            <p>* Diện tích xây dựng = Diện tích đất × Mật độ xây dựng</p>
            <p>* Tổng diện tích sàn = Tổng diện tích các phòng × 1.2 (hệ số)</p>
            <p>* Mức đầu tư = Chi phí đầu tư / Tổng diện tích sàn</p>
            <p>* Mức tham chiếu được nội suy dựa trên phân khúc từ mức đầu tư.</p>
        </div>
    </div>
  );
};

export default ResultsCard;