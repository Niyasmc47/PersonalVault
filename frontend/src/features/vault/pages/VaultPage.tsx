import { useState, useEffect, useCallback } from 'react';
import { useVaultLock } from '../contexts/VaultLockContext';
import { vaultService } from '../services/vaultService';
import type {
  CredentialItem,
  IdentityDocumentItem,
  FinancialAccountItem,
  VaultDocumentItem,
  VaultDocumentPayload,
  CredentialPayload,
  IdentityDocumentPayload,
  FinancialAccountPayload,
  
  
} from '../types';

import VaultHeader from '../components/VaultHeader';
import VaultUnlockCard from '../components/VaultUnlockCard';
import CredentialSection from '../components/CredentialSection';
import IdentitySection from '../components/IdentitySection';
import FinancialSection from '../components/FinancialSection';
import DocumentSection from '../components/DocumentSection';
import VaultDocumentViewerModal from '../components/VaultDocumentViewerModal';
import DeleteVaultItemDialog from '../components/DeleteVaultItemDialog';

import CredentialFormModal from '../components/CredentialFormModal';
import IdentityFormModal from '../components/IdentityFormModal';
import FinancialFormModal from '../components/FinancialFormModal';
import DocumentFormModal from '../components/DocumentFormModal';
import { Loader2 } from 'lucide-react';

export default function VaultPage() {
  const { isConfigured, isUnlocked, isLoading, activeTab, setActiveTab } = useVaultLock();

  const [searchTerm, setSearchTerm] = useState('');

  // Lists
  const [credentials, setCredentials] = useState<CredentialItem[]>([]);
  const [identities, setIdentities] = useState<IdentityDocumentItem[]>([]);
  const [financials, setFinancials] = useState<FinancialAccountItem[]>([]);
  const [educations, setEducations] = useState<VaultDocumentItem[]>([]);
  const [others, setOthers] = useState<VaultDocumentItem[]>([]);

  // Modals visibility
  const [showCredForm, setShowCredForm] = useState(false);
  const [showIdForm, setShowIdForm] = useState(false);
  const [showFinForm, setShowFinForm] = useState(false);
  const [showDocForm, setShowDocForm] = useState(false);

  // Selected item for edit
  const [selectedCred, setSelectedCred] = useState<CredentialItem | null>(null);
  const [selectedId, setSelectedId] = useState<IdentityDocumentItem | null>(null);
  const [selectedFin, setSelectedFin] = useState<FinancialAccountItem | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<VaultDocumentItem | null>(null);

  // Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerTitle, setViewerTitle] = useState('');
  const [viewerMimeType, setViewerMimeType] = useState<string | undefined>();
  const [viewerFileName, setViewerFileName] = useState('');
  const [viewerLoadBlob, setViewerLoadBlob] = useState<(() => Promise<Blob>) | null>(null);

  // Delete state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: number; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCredentials = useCallback(async () => {
    if (!isUnlocked) return;
    try {
      const data = await vaultService.getCredentials();
      setCredentials(data);
    } catch (err) {
      console.error(err);
    }
  }, [isUnlocked]);

  const fetchIdentities = useCallback(async () => {
    if (!isUnlocked) return;
    try {
      const data = await vaultService.getIdentityDocuments();
      setIdentities(data);
    } catch (err) {
      console.error(err);
    }
  }, [isUnlocked]);

  const fetchFinancials = useCallback(async () => {
    if (!isUnlocked) return;
    try {
      const data = await vaultService.getFinancialAccounts();
      setFinancials(data);
    } catch (err) {
      console.error(err);
    }
  }, [isUnlocked]);

  const fetchEducations = useCallback(async () => {
    if (!isUnlocked) return;
    try {
      const data = await vaultService.getDocuments('EDUCATION');
      setEducations(data);
    } catch (err) {
      console.error(err);
    }
  }, [isUnlocked]);

  const fetchOthers = useCallback(async () => {
    if (!isUnlocked) return;
    try {
      const data = await vaultService.getDocuments('OTHER');
      setOthers(data);
    } catch (err) {
      console.error(err);
    }
  }, [isUnlocked]);

  // Fetch active tab data
  useEffect(() => {
    if (!isUnlocked) return;
    switch (activeTab) {
      case 'passwords':
        fetchCredentials();
        break;
      case 'identity':
        fetchIdentities();
        break;
      case 'finance':
        fetchFinancials();
        break;
      case 'education':
        fetchEducations();
        break;
      case 'other':
        fetchOthers();
        break;
    }
  }, [isUnlocked, activeTab, fetchCredentials, fetchIdentities, fetchFinancials, fetchEducations, fetchOthers]);

  // Save Handlers
  const handleSaveCredential = async (payload: CredentialPayload) => {
    if (selectedCred) {
      await vaultService.updateCredential(selectedCred.id, payload);
    } else {
      await vaultService.createCredential(payload);
    }
    await fetchCredentials();
  };

  const handleSaveIdentity = async (payload: IdentityDocumentPayload) => {
    if (selectedId) {
      await vaultService.updateIdentityDocument(selectedId.id, payload);
    } else {
      await vaultService.createIdentityDocument(payload);
    }
    await fetchIdentities();
  };

  const handleSaveFinancial = async (payload: FinancialAccountPayload) => {
    if (selectedFin) {
      await vaultService.updateFinancialAccount(selectedFin.id, payload);
    } else {
      await vaultService.createFinancialAccount(payload);
    }
    await fetchFinancials();
  };

  const handleSaveDocument = async (payload: VaultDocumentPayload) => {
    if (selectedDoc) {
      await vaultService.updateDocument(selectedDoc.id, payload);
    } else {
      await vaultService.createDocument(payload);
    }
    if (payload.section === 'EDUCATION') {
      await fetchEducations();
    } else {
      await fetchOthers();
    }
  };

  // Delete Handlers
  const requestDelete = (type: string, id: number, name: string) => {
    setItemToDelete({ type, id, name });
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      switch (itemToDelete.type) {
        case 'credential':
          await vaultService.deleteCredential(itemToDelete.id);
          await fetchCredentials();
          break;
        case 'identity':
          await vaultService.deleteIdentityDocument(itemToDelete.id);
          await fetchIdentities();
          break;
        case 'financial':
          await vaultService.deleteFinancialAccount(itemToDelete.id);
          await fetchFinancials();
          break;
        case 'education':
          await vaultService.deleteDocument(itemToDelete.id);
          await fetchEducations();
          break;
        case 'other':
          await vaultService.deleteDocument(itemToDelete.id);
          await fetchOthers();
          break;
      }
      setDeleteOpen(false);
      setItemToDelete(null);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const openViewer = (title: string, mimeType: string | undefined, fileName: string, loadBlob: () => Promise<Blob>) => {
    setViewerTitle(title);
    setViewerMimeType(mimeType);
    setViewerFileName(fileName);
    setViewerLoadBlob(() => loadBlob);
    setViewerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="pv-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
        <Loader2 size={32} className="pv-spin" color="var(--color-carbon)" />
      </div>
    );
  }

  if (!isConfigured || !isUnlocked) {
    return (
      <div className="pv-container">
        <VaultUnlockCard />
      </div>
    );
  }

  return (
    <div className="pv-container">
      <VaultHeader
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setSearchTerm('');
        }}
        onAddNew={() => {
          if (activeTab === 'passwords') { setSelectedCred(null); setShowCredForm(true); }
          else if (activeTab === 'identity') { setSelectedId(null); setShowIdForm(true); }
          else if (activeTab === 'finance') { setSelectedFin(null); setShowFinForm(true); }
          else if (activeTab === 'education' || activeTab === 'other') { setSelectedDoc(null); setShowDocForm(true); }
        }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div style={{ marginTop: '20px' }}>
        {activeTab === 'passwords' && (
          <CredentialSection
            credentials={credentials}
            searchTerm={searchTerm}
            onEdit={(item) => { setSelectedCred(item); setShowCredForm(true); }}
            onDelete={(item) => requestDelete('credential', item.id, item.name)}
            onAddNew={() => { setSelectedCred(null); setShowCredForm(true); }}
          />
        )}
        {activeTab === 'identity' && (
          <IdentitySection
            documents={identities}
            searchTerm={searchTerm}
            onEdit={(item) => { setSelectedId(item); setShowIdForm(true); }}
            onDelete={(item) => requestDelete('identity', item.id, `${item.type} (${item.maskedNumber})`)}
            onAddNew={() => { setSelectedId(null); setShowIdForm(true); }}
            onPreview={openViewer}
          />
        )}
        {activeTab === 'finance' && (
          <FinancialSection
            accounts={financials}
            searchTerm={searchTerm}
            onEdit={(item) => { setSelectedFin(item); setShowFinForm(true); }}
            onDelete={(item) => requestDelete('financial', item.id, `${item.bankName} Account`)}
            onAddNew={() => { setSelectedFin(null); setShowFinForm(true); }}
            onPreview={openViewer}
          />
        )}
        {activeTab === 'education' && (
          <DocumentSection
            documents={educations}
            section="EDUCATION"
            searchTerm={searchTerm}
            onEdit={(item) => { setSelectedDoc(item); setShowDocForm(true); }}
            onDelete={(item) => requestDelete('education', item.id, item.title)}
            onAddNew={() => { setSelectedDoc(null); setShowDocForm(true); }}
            onPreview={openViewer}
          />
        )}
        {activeTab === 'other' && (
          <DocumentSection
            documents={others}
            section="OTHER"
            searchTerm={searchTerm}
            onEdit={(item) => { setSelectedDoc(item); setShowDocForm(true); }}
            onDelete={(item) => requestDelete('other', item.id, item.title)}
            onAddNew={() => { setSelectedDoc(null); setShowDocForm(true); }}
            onPreview={openViewer}
          />
        )}
      </div>

      <CredentialFormModal
        isOpen={showCredForm}
        credential={selectedCred}
        onSave={handleSaveCredential}
        onClose={() => setShowCredForm(false)}
      />
      <IdentityFormModal
        isOpen={showIdForm}
        document={selectedId}
        onSave={handleSaveIdentity}
        onClose={() => setShowIdForm(false)}
      />
      <FinancialFormModal
        isOpen={showFinForm}
        account={selectedFin}
        onSave={handleSaveFinancial}
        onClose={() => setShowFinForm(false)}
      />
      <DocumentFormModal
        isOpen={showDocForm}
        document={selectedDoc}
        section={activeTab === 'education' ? 'EDUCATION' : 'OTHER'}
        onSave={handleSaveDocument}
        onClose={() => setShowDocForm(false)}
      />

      <VaultDocumentViewerModal
        isOpen={viewerOpen}
        title={viewerTitle}
        mimeType={viewerMimeType}
        fileName={viewerFileName}
        loadBlob={viewerLoadBlob || (async () => new Blob())}
        onClose={() => setViewerOpen(false)}
      />

      <DeleteVaultItemDialog
        isOpen={deleteOpen}
        title={`Delete ${itemToDelete?.type}`}
        itemDescription={itemToDelete?.name || ''}
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
