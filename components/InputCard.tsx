import React from 'react';
import { Floor, Room } from '../types';
import { PlusIcon, TrashIcon } from './icons';

const ROOM_PRESETS: { [key: string]: number } = {
  'Khách': 30,
  'Bếp + ăn': 50,
  'Master': 50,
  'Ngủ lớn': 20,
  'Ngủ nhỏ': 15,
  'Wc lớn': 10,
  'Wc nhỏ': 5,
  'SHC': 25,
  'Thư phòng': 15,
  'Thờ': 20,
  'Kho': 10,
  'Giặt phơi': 10,
  'Cầu thang': 10,
  'Thang máy': 5,
  'Thông tầng': 25,
  'Giải trí': 25,
  'Gara kín': 20,
  'Sauna': 10,
};


interface InputCardProps {
  floors: Floor[];
  setFloors: React.Dispatch<React.SetStateAction<Floor[]>>;
}

const InputCard: React.FC<InputCardProps> = ({
  floors,
  setFloors
}) => {
  const addFloor = () => {
    const newFloor: Floor = {
      id: `floor-${Date.now()}`,
      rooms: [{ id: `room-${Date.now()}`, name: '', area: '' }],
    };
    setFloors([...floors, newFloor]);
  };

  const removeFloor = (floorId: string) => {
    setFloors(floors.filter(floor => floor.id !== floorId));
  };

  const addRoom = (floorId: string) => {
    const newFloors = floors.map(floor => {
      if (floor.id === floorId) {
        const newRoom: Room = { id: `room-${Date.now()}`, name: '', area: '' };
        return { ...floor, rooms: [...floor.rooms, newRoom] };
      }
      return floor;
    });
    setFloors(newFloors);
  };

  const removeRoom = (floorId: string, roomId: string) => {
    const newFloors = floors.map(floor => {
      if (floor.id === floorId) {
        return { ...floor, rooms: floor.rooms.filter(room => room.id !== roomId) };
      }
      return floor;
    });
    setFloors(newFloors);
  };

  const handleRoomChange = (floorId: string, roomId: string, field: 'name' | 'area', value: string) => {
      const newFloors = floors.map(floor => {
        if (floor.id === floorId) {
          const newRooms = floor.rooms.map(room => {
            if (room.id === roomId) {
              if (field === 'name') {
                const newName = value;
                const presetArea = ROOM_PRESETS[newName];
                if (presetArea !== undefined) {
                  // It's a preset
                  return { ...room, name: newName, area: presetArea };
                } else {
                  // It's a custom name
                  return { ...room, name: newName };
                }
              }
              if (field === 'area') {
                return { ...room, area: value === '' ? '' : Math.max(0, parseFloat(value) || 0) };
              }
            }
            return room;
          });
          return { ...floor, rooms: newRooms };
        }
        return floor;
      });
      setFloors(newFloors);
    };

  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-2xl space-y-6 h-full border border-gray-700 flex flex-col">
      <h2 className="text-2xl font-bold text-yellow-400 border-b border-gray-600 pb-4 mb-4">Yêu Cầu Thiết Kế Chi Tiết</h2>
      
      <div className="flex-grow space-y-6 overflow-y-auto pr-2 max-h-[calc(100vh-320px)] lg:max-h-full">
          {floors.map((floor, floorIndex) => {
            const floorArea = floor.rooms.reduce((sum, room) => sum + (Number(room.area) || 0), 0);
            const totalFloorAreaWithFactor = floorArea * 1.2;

            return (
              <div key={floor.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-baseline gap-3">
                        <h4 className="font-bold text-yellow-500">Tầng {floorIndex + 1}</h4>
                        <span className="text-sm font-medium text-gray-400">
                          (Tổng cộng: {totalFloorAreaWithFactor.toLocaleString('vi-VN', {maximumFractionDigits: 2})} m²)
                        </span>
                    </div>
                    <button onClick={() => removeFloor(floor.id)} className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-900/20">
                        <TrashIcon />
                    </button>
                  </div>
                  <div className="space-y-3">
                  {floor.rooms.map((room) => {
                    const isPreset = ROOM_PRESETS.hasOwnProperty(room.name);
                    
                    return (
                      <div key={room.id} className="grid grid-cols-12 gap-2 items-start">
                        <div className="col-span-6">
                            <input
                                type="text"
                                list="room-presets"
                                value={room.name}
                                onChange={e => handleRoomChange(floor.id, room.id, 'name', e.target.value)}
                                placeholder="Nhập hoặc chọn phòng"
                                className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 text-white rounded-md text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition"
                              />
                        </div>
                        <div className="col-span-5">
                            <input 
                              type="number" 
                              value={room.area} 
                              onChange={e => handleRoomChange(floor.id, room.id, 'area', e.target.value)} 
                              placeholder="Diện tích (m²)" 
                              disabled={isPreset}
                              className="w-full px-3 py-1.5 bg-gray-700 border border-gray-600 text-white rounded-md text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition disabled:bg-gray-800 disabled:cursor-not-allowed disabled:text-gray-400"
                            />
                        </div>
                        <div className="col-span-1 text-right pt-1.5">
                            {floor.rooms.length > 1 && (
                                <button onClick={() => removeRoom(floor.id, room.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                      </div>
                    )
                  })}
                  </div>
                  <button onClick={() => addRoom(floor.id)} className="mt-4 flex items-center gap-2 text-sm text-yellow-500 hover:text-yellow-400 font-medium transition-colors">
                      <PlusIcon className="h-4 w-4"/> Thêm phòng
                  </button>
              </div>
            )
          })}
           <datalist id="room-presets">
              {Object.keys(ROOM_PRESETS).map(presetName => (
                <option key={presetName} value={presetName} />
              ))}
            </datalist>
      </div>
      <button onClick={addFloor} className="w-full flex justify-center items-center gap-2 py-2.5 px-4 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-600 transition-transform active:scale-95 font-bold shadow-lg shadow-yellow-500/10 mt-6">
          <PlusIcon /> Thêm tầng
      </button>
    </div>
  );
};

export default InputCard;