import React, { useState, useRef } from 'react';
import { FaCircle, FaStop, FaDownload, FaTrash, FaChevronDown, FaChevronUp, FaPlay, FaFileUpload, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRecorder } from '../context/RecorderContext';
import HeatmapOverlay from './HeatmapOverlay';

const RecorderWidget: React.FC = () => {
  const { 
    clicks, 
    isRecording, 
    startRecording, 
    stopRecording, 
    resetClicks, 
    setImportedClicks,
    scenarioName,
    setScenarioName,
    startTime,
    endTime
  } = useRecorder();

  const [showHeatmap, setShowHeatmap] = useState(false);
  const [stats, setStats] = useState({ fileCount: 0 });
  const [isMinimized, setIsMinimized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (clicks.length === 0) {
        alert("Aucune donnée à exporter.");
        return;
    }

    let durationMs = 0;
    if (startTime) {
        const end = endTime || Date.now();
        durationMs = end - startTime;
    }

    // Formatage
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const readableDuration = `${minutes}m ${remainingSeconds}s`;
    
    const dataToExport = {
        nb_clics: clicks.length,
        duree: readableDuration,
        duree_ms: durationMs,
        scenario: scenarioName || "scenario_sans_nom",
        date: new Date().toLocaleString('fr-FR'),
        screenSize: { width: window.innerWidth, height: window.innerHeight },
        clicks: clicks
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    const fileName = `heatmap_${scenarioName || 'test'}_${Date.now()}.json`;
    downloadAnchorNode.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Fonction d'importation (Met à jour le contexte global)
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPoints: any[] = [];
    let count = 0;

    for (let i = 0; i < files.length; i++) {
        const text = await files[i].text();
        try {
            const json = JSON.parse(text);
            if (Array.isArray(json.clicks)) {
                newPoints.push(...json.clicks);
                count++;
            }
        } catch (err) {
            console.error("Erreur fichier", err);
        }
    }

    // On envoie les points dans le contexte pour qu'ils persistent
    setImportedClicks(newPoints);
    setStats({ fileCount: count });
    
    if (newPoints.length > 0) setShowHeatmap(true);
    
    // Reset l'input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClearImport = () => {
    resetClicks(); // Vide le contexte
    setShowHeatmap(false);
    setStats({ fileCount: 0 });
  };

  // Handlers simples pour le recording
  const handleStart = () => startRecording();
  const handleStop = () => stopRecording();
  const handleReset = () => {
      resetClicks();
      setStats({ fileCount: 0 });
  };

  return (
    <>
      {/* AFFICHAGE DE LA HEATMAP */}
      {showHeatmap && clicks.length > 0 && (
        <HeatmapOverlay points={clicks} />
      )}

      {/* WIDGET FLOTTANT */}
      <div 
        data-ignore-clicks="true"
        className={`fixed bottom-4 right-4 z-[10000] transition-all duration-300 font-sans hidden lg:block ${
            isMinimized ? 'w-auto' : 'w-80'
        }`}
      >
        <div className="bg-zinc-800 text-white rounded-lg shadow-2xl border border-zinc-600 overflow-hidden">
            
            {/* En-tête */}
            <div 
                className={`flex items-center justify-between p-3 cursor-pointer select-none ${
                    isRecording ? 'bg-red-900/90 animate-pulse' : 'bg-zinc-700 hover:bg-zinc-600'
                }`}
                onClick={() => setIsMinimized(!isMinimized)}
            >
                <div className="flex items-center gap-2 font-bold text-sm">
                    {isRecording ? (
                        <>
                            <FaCircle size={10} className="text-red-500" /> 
                            REC ({clicks.length})
                        </>
                    ) : (
                        <span className="flex items-center gap-2">
                             Test des scénarios
                             {clicks.length > 0 && <span className="text-xs bg-blue-600 px-1.5 rounded-full">{clicks.length}pts</span>}
                        </span>
                    )}
                </div>
                <button className="text-zinc-400 hover:text-white">
                    {isMinimized ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            </div>

            {/* Corps du Widget */}
            {!isMinimized && (
                <div className="p-4 space-y-4 bg-zinc-800">    
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Enregistrement</label>
                            {clicks.length > 0 && <span className="text-xs text-zinc-500">{clicks.length} clics</span>}
                        </div>
                        <input 
                            type="text" 
                            value={scenarioName}
                            onChange={(e) => setScenarioName(e.target.value)}
                            placeholder="Nom du scénario..."
                            className="w-full mb-2 px-2 py-1.5 bg-zinc-900 border border-zinc-600 rounded text-sm focus:border-blue-500 outline-none placeholder-zinc-600"
                            disabled={isRecording}
                        />
                        <div className="flex gap-2">
                            {!isRecording ? (
                                <button 
                                    onClick={handleStart}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded text-sm flex items-center justify-center gap-2 transition"
                                >
                                    <FaPlay size={10} /> REC
                                </button>
                            ) : (
                                <button 
                                    onClick={handleStop}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-sm flex items-center justify-center gap-2 transition"
                                >
                                    <FaStop size={10} /> Stop
                                </button>
                            )}
                            
                            <button 
                                onClick={handleExport}
                                disabled={clicks.length === 0 || isRecording}
                                className={`px-3 rounded border text-sm flex items-center justify-center transition ${
                                    clicks.length === 0 || isRecording
                                    ? 'border-zinc-700 text-zinc-600 cursor-not-allowed' 
                                    : 'border-blue-600 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white'
                                }`}
                                title="Télécharger le JSON"
                            >
                                <FaDownload />
                            </button>
                            <button 
                                onClick={handleReset}
                                disabled={clicks.length === 0 || isRecording}
                                className={`px-3 rounded border text-sm flex items-center justify-center transition ${
                                    clicks.length === 0 || isRecording
                                    ? 'border-zinc-700 text-zinc-600 cursor-not-allowed' 
                                    : 'border-zinc-600 hover:bg-red-900/30 text-zinc-400 hover:text-red-400'
                                }`}
                                title="Reset"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>

                    <hr className="border-zinc-700" />

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Analyse (Heatmap)</label>
                            {/* Affichage conditionnel des stats d'import */}
                            {stats.fileCount > 0 && (
                                <span className="text-[10px] text-zinc-500">{stats.fileCount} fichiers importés</span>
                            )}
                        </div>

                        {clicks.length === 0 ? (
                            <label className="flex items-center justify-center gap-2 w-full py-2 border border-dashed border-zinc-600 rounded cursor-pointer hover:bg-zinc-700/50 hover:border-zinc-500 transition text-sm text-zinc-400">
                                <FaFileUpload /> Charger JSON
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    multiple 
                                    accept=".json" 
                                    onChange={handleImport}
                                    className="hidden" 
                                />
                            </label>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => setShowHeatmap(!showHeatmap)}
                                    className={`w-full py-1.5 rounded text-sm flex items-center justify-center gap-2 transition font-medium ${
                                        showHeatmap 
                                        ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                                        : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
                                    }`}
                                >
                                    {showHeatmap ? <><FaEyeSlash /> Masquer Heatmap</> : <><FaEye /> Afficher Heatmap</>}
                                </button>
                                
                                <div className="flex gap-2">
                                    <label className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-zinc-700 hover:bg-zinc-600 rounded cursor-pointer text-xs text-zinc-300 transition">
                                        <FaFileUpload /> Ajouter +
                                        <input 
                                            ref={fileInputRef}
                                            type="file" 
                                            multiple 
                                            accept=".json" 
                                            onChange={handleImport}
                                            className="hidden" 
                                        />
                                    </label>
                                    <button 
                                        onClick={handleClearImport}
                                        className="px-3 py-1.5 bg-zinc-700 hover:bg-red-900/50 text-zinc-400 hover:text-red-400 rounded transition"
                                        title="Effacer l'import"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </>
  );
};

export default RecorderWidget;