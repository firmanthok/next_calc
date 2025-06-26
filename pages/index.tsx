import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Trash2, Target, DollarSign, TrendingUp, BarChart3, Percent } from 'lucide-react';

const MarketplaceCalculator = () => {
  const [formData, setFormData] = useState({
    targetProfit: '',
    hargaJual: '',
    hpp: '',
    biayaMarketing: '',
    biayaOperasional: ''
  });


    type HasilPerhitungan = {
    targetUnit: number;
    targetOmset: number;
    totalBiayaMarketing: number;
    totalBiayaAdmin: number;
    totalHPP: number;
    totalBiayaOperasional: number;
    nmv: number;
    finalProfit: number;
    marginPerUnit: number;
    totalBiayaAdminPerUnit: number;
  };

  type BiayaAdmin = {
  id: number;
  nama: string;
  nilai: number;
  tipe: 'persen' | 'nominal';
};

const [biayaAdmin, setBiayaAdmin] = useState<BiayaAdmin[]>([
  { id: 1, nama: 'Komisi Platform', nilai: 2.5, tipe: 'persen' }
]);

  const [results, setResults] = useState<HasilPerhitungan | null>(null);

  const addBiayaAdmin = () => {
    const newId = Math.max(...biayaAdmin.map(b => b.id), 0) + 1;
    setBiayaAdmin([...biayaAdmin, { 
      id: newId, 
      nama: '', 
      nilai: 0, 
      tipe: 'persen' 
    }]);
  };

  const updateBiayaAdmin = (id:number, field:keyof BiayaAdmin, value:string) => {
    setBiayaAdmin(biayaAdmin.map(biaya => 
      biaya.id === id ? { ...biaya, [field]: value } : biaya
    ));
  };

  const deleteBiayaAdmin = (id:number) => {
    setBiayaAdmin(biayaAdmin.filter(biaya => biaya.id !== id));
  };


const toSafeNumber = (value: string | number): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

const calculateResults = () => {
  const targetProfit = toSafeNumber(formData.targetProfit);
  const hargaJual = toSafeNumber(formData.hargaJual);
  const hpp = toSafeNumber(formData.hpp);
  const biayaMarketing = toSafeNumber(formData.biayaMarketing);
  const biayaOperasional = toSafeNumber(formData.biayaOperasional);

  if (hargaJual <= 0) {
    setResults(null);
    return;
  }

  let totalBiayaAdminPerUnit = 0;
  biayaAdmin.forEach(biaya => {
    if (biaya.tipe === 'persen') {
      totalBiayaAdminPerUnit += (hargaJual * biaya.nilai) / 100;
    } else {
      totalBiayaAdminPerUnit += biaya.nilai;
    }
  });

  const marginPerUnit = hargaJual - totalBiayaAdminPerUnit - hpp - biayaMarketing - biayaOperasional;
  const targetUnit = marginPerUnit > 0 ? Math.ceil(targetProfit / marginPerUnit) : 0;
  const targetOmset = targetUnit * hargaJual;
  const totalBiayaMarketing = targetUnit * biayaMarketing;
  const totalBiayaAdmin = targetUnit * totalBiayaAdminPerUnit;
  const totalHPP = targetUnit * hpp;
  const totalBiayaOperasional = targetUnit * biayaOperasional;
  const nmv = targetOmset - totalBiayaAdmin;
  const finalProfit = nmv - totalHPP - totalBiayaMarketing - totalBiayaOperasional;

  setResults({
    targetUnit,
    targetOmset,
    totalBiayaMarketing,
    totalBiayaAdmin,
    totalHPP,
    totalBiayaOperasional,
    nmv,
    finalProfit,
    marginPerUnit,
    totalBiayaAdminPerUnit
  });
};


  useEffect(() => {
    calculateResults();
  }, [formData, biayaAdmin]);

  const formatCurrency = (amount:number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num:number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Kalkulator Target Marketplace</h1>
          </div>
          <p className="text-gray-600">Hitung target omset berdasarkan profit yang diinginkan</p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Target & Harga
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Profit (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.targetProfit}
                    onChange={(e) => setFormData({ ...formData, targetProfit: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Harga Jual per Unit (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.hargaJual}
                    onChange={(e) => setFormData({...formData, hargaJual:e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Biaya Admin */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Percent className="w-5 h-5 text-indigo-600" />
                  Biaya Admin
                </h3>
                <button
                  onClick={addBiayaAdmin}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Tambah
                </button>
              </div>
              
              <div className="space-y-3">
                {biayaAdmin.map((biaya) => (
                  <div key={biaya.id} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={biaya.nama}
                        onChange={(e) => updateBiayaAdmin(biaya.id, 'nama', e.target.value)}
                        placeholder="Nama biaya"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-black"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        value={biaya.nilai}
                        onChange={(e) => updateBiayaAdmin(biaya.id, 'nilai', e.target.value)}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-black"
                        step="0.1"
                        min="0"
                      />
                    </div>
                    <div className="col-span-3">
                      <select
                        value={biaya.tipe}
                        onChange={(e) => updateBiayaAdmin(biaya.id, 'tipe', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      >
                        <option value="persen">%</option>
                        <option value="nominal">Rp</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <button
                        onClick={() => deleteBiayaAdmin(biaya.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Costs */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-600" />
                Biaya Lainnya per Unit
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    HPP per Unit (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.hpp}
                    onChange={(e) => setFormData({...formData, hpp: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biaya Marketing per Unit (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.biayaMarketing}
                    onChange={(e) => setFormData({...formData, biayaMarketing: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Biaya Operasional per Unit (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.biayaOperasional}
                    onChange={(e) => setFormData({...formData, biayaOperasional: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {results && results.targetUnit > 0 ? (
              <>
                {/* Key Metrics */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Target & Proyeksi
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Target Unit Terjual</p>
                      <p className="text-2xl font-bold text-blue-600">{formatNumber(results.targetUnit)}</p>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Target Omset</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(results.targetOmset)}</p>
                    </div>
                    
                    <div className="bg-orange-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Total Biaya Marketing</p>
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(results.totalBiayaMarketing)}</p>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600 mb-1">Margin per Unit</p>
                      <p className="text-2xl font-bold text-purple-600">{formatCurrency(results.marginPerUnit)}</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    Breakdown Proyeksi
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="font-semibold text-gray-800 mb-3">Revenue & NMV</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Omset</span>
                          <span className="font-medium text-green-600">{formatCurrency(results.targetOmset)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Biaya Admin</span>
                          <span className="font-medium text-red-600">-{formatCurrency(results.totalBiayaAdmin)}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t pt-2">
                          <span className="text-gray-800">NMV (Net Merchandise Value)</span>
                          <span className="text-blue-600">{formatCurrency(results.nmv)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Final Profit Calculation</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">NMV</span>
                          <span className="font-medium text-blue-600">{formatCurrency(results.nmv)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total HPP</span>
                          <span className="font-medium text-red-600">-{formatCurrency(results.totalHPP)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Biaya Marketing</span>
                          <span className="font-medium text-red-600">-{formatCurrency(results.totalBiayaMarketing)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Biaya Operasional</span>
                          <span className="font-medium text-red-600">-{formatCurrency(results.totalBiayaOperasional)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span className="text-gray-800">Final Profit</span>
                          <span className={results.finalProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {formatCurrency(results.finalProfit)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className={`rounded-xl shadow-lg p-6 ${results.finalProfit >= parseInt(formData.targetProfit) ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="text-center">
                    <p className="text-lg font-semibold mb-2">
                      {results.finalProfit >= parseInt(formData.targetProfit) ? '✅ Target Profit Tercapai' : '❌ Target Profit Belum Tercapai'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Target: {formatCurrency(parseInt(formData.targetProfit))} | 
                      Actual: {formatCurrency(results.finalProfit)} | 
                      Selisih: {formatCurrency(results.finalProfit - parseInt(formData.targetProfit))}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <Calculator className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">Masukkan Data</h3>
                <p className="text-gray-500">Isi semua field untuk melihat hasil perhitungan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCalculator;