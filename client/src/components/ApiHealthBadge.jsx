import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import api from '../services/api';

/**
 * Component to monitor and display backend API connectivity status
 */
const ApiHealthBadge = () => {
  const [status, setStatus] = useState('checking'); // 'connected' | 'disconnected' | 'checking'

  const checkHealth = async () => {
    setStatus('checking');
    try {
      const response = await api.get('/health');
      if (response.data && response.data.success) {
        setStatus('connected');
      } else {
        setStatus('disconnected');
      }
    } catch {
      setStatus('disconnected');
    }
  };

  useEffect(() => {
    let isMounted = true;
    api
      .get('/health')
      .then((res) => {
        if (isMounted) {
          setStatus(res.data?.success ? 'connected' : 'disconnected');
        }
      })
      .catch(() => {
        if (isMounted) {
          setStatus('disconnected');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors bg-white shadow-xs">
      {status === 'checking' && (
        <>
          <RefreshCw className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span className="text-slate-600">Checking API Status...</span>
        </>
      )}

      {status === 'connected' && (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-700 font-medium">Backend Operational</span>
        </>
      )}

      {status === 'disconnected' && (
        <>
          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          <span className="text-rose-700">Backend Offline</span>
          <button
            onClick={checkHealth}
            title="Retry connection"
            className="text-slate-400 hover:text-slate-600 ml-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </>
      )}
    </div>
  );
};

export default ApiHealthBadge;
