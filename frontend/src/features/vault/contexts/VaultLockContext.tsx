import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { VaultTab } from '../types';
import { vaultService } from '../services/vaultService';

interface VaultLockContextType {
  isConfigured: boolean;
  isUnlocked: boolean;
  isLoading: boolean;
  vaultToken: string | null;
  passwordHint?: string;
  autoLockMinutes: number;
  activeTab: VaultTab;
  setActiveTab: (tab: VaultTab) => void;
  unlockVault: (masterPassword: string) => Promise<void>;
  setupVault: (masterPassword: string, confirmPassword: string, passwordHint?: string) => Promise<void>;
  lockVault: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

const VaultLockContext = createContext<VaultLockContextType | undefined>(undefined);

export function VaultLockProvider({ children }: { children: ReactNode }) {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [vaultToken, setVaultToken] = useState<string | null>(null);
  const [passwordHint, setPasswordHint] = useState<string | undefined>(undefined);
  const [autoLockMinutes, setAutoLockMinutes] = useState<number>(15);
  const [activeTab, setActiveTab] = useState<VaultTab>('passwords');

  const lastActivityRef = useRef<number>(Date.now());
  const autoLockTimerRef = useRef<NodeJS.Timeout | null>(null);

  const refreshStatus = useCallback(async () => {
    try {
      const status = await vaultService.getStatus(vaultToken);
      setIsConfigured(status.configured);
      setIsUnlocked(status.unlocked);
      setPasswordHint(status.passwordHint);
      if (status.autoLockMinutes) {
        setAutoLockMinutes(status.autoLockMinutes);
      }
    } catch {
      setIsConfigured(false);
      setIsUnlocked(false);
    } finally {
      setIsLoading(false);
    }
  }, [vaultToken]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const lockVault = useCallback(async () => {
    try {
      await vaultService.lock();
    } catch {
      // Best-effort lock
    } finally {
      setVaultToken(null);
      setIsUnlocked(false);
    }
  }, []);

  // ── Auto-lock inactivity detector ──
  useEffect(() => {
    if (!isUnlocked || !vaultToken) {
      if (autoLockTimerRef.current) {
        clearInterval(autoLockTimerRef.current);
        autoLockTimerRef.current = null;
      }
      return;
    }

    lastActivityRef.current = Date.now();

    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('mousedown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    const checkIntervalMs = 15000; // Check every 15 seconds
    const timeoutMs = autoLockMinutes * 60 * 1000;

    autoLockTimerRef.current = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= timeoutMs) {
        console.log('Secure Vault auto-locked due to inactivity.');
        lockVault();
      }
    }, checkIntervalMs);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('mousedown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      if (autoLockTimerRef.current) {
        clearInterval(autoLockTimerRef.current);
        autoLockTimerRef.current = null;
      }
    };
  }, [isUnlocked, vaultToken, autoLockMinutes, lockVault]);

  const unlockVault = async (masterPassword: string) => {
    const res = await vaultService.unlock(masterPassword);
    setVaultToken(res.vaultToken);
    setIsUnlocked(true);
    lastActivityRef.current = Date.now();
  };

  const setupVault = async (masterPassword: string, confirmPassword: string, hint?: string) => {
    const res = await vaultService.setup(masterPassword, confirmPassword, hint);
    setVaultToken(res.vaultToken);
    setIsConfigured(true);
    setIsUnlocked(true);
    setPasswordHint(hint);
    lastActivityRef.current = Date.now();
  };

  return (
    <VaultLockContext.Provider
      value={{
        isConfigured,
        isUnlocked,
        isLoading,
        vaultToken,
        passwordHint,
        autoLockMinutes,
        activeTab,
        setActiveTab,
        unlockVault,
        setupVault,
        lockVault,
        refreshStatus,
      }}
    >
      {children}
    </VaultLockContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useVaultLock() {
  const context = useContext(VaultLockContext);
  if (!context) {
    throw new Error('useVaultLock must be used within a VaultLockProvider');
  }
  return context;
}
