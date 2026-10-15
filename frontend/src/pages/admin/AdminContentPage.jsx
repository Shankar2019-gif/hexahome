import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  HelpCircle,
  AlertTriangle,
  UploadCloud,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  Eye,
  FileCheck,
} from 'lucide-react';
import { adminContentApi } from '../../services/adminApi';
import AdminDataTable from '../../components/admin/common/AdminDataTable';
import AdminFilterBar from '../../components/admin/common/AdminFilterBar';
import AdminStatusBadge from '../../components/admin/common/AdminStatusBadge';
import AdminModal from '../../components/admin/common/AdminModal';
import AdminRoleGuard from '../../components/admin/common/AdminRoleGuard';

// ============================================================================
// Content, Geographies & Media Workspace
// Cities, Localities, FAQs, Listing Abuse Reports, S3 Presigned Uploads
// ============================================================================

export default function AdminContentPage() {
  const [activeTab, setActiveTab] = useState('cities'); // 'cities' | 'faqs' | 'reports' | 'media'

  // Notifications
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // 1. Cities & Localities State
  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [localities, setLocalities] = useState([]);
  const [localitiesLoading, setLocalitiesLoading] = useState(false);

  // Modals for City & Locality
  const [cityModal, setCityModal] = useState({ isOpen: false, city: null, name: '', state: '', active: true, displayOrder: 0, imageUrl: '', error: '' });
  const [localityModal, setLocalityModal] = useState({ isOpen: false, locality: null, cityId: null, name: '', pincode: '', active: true, displayOrder: 0, error: '' });

  // 2. FAQs State
  const [faqs, setFaqs] = useState([]);
  const [faqsLoading, setFaqsLoading] = useState(false);
  const [faqModal, setFaqModal] = useState({ isOpen: false, faq: null, question: '', answer: '', category: 'General', active: true, displayOrder: 0, error: '' });

  // 3. Abuse Reports State
  const [reports, setReports] = useState([]);
  const [reportTotal, setReportTotal] = useState(0);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportPage, setReportPage] = useState(0);
  const [reportSize, setReportSize] = useState(20);
  const [reportStatus, setReportStatus] = useState('');
  const [reportModal, setReportModal] = useState({ isOpen: false, reportId: null, status: 'RESOLVED', resolutionNotes: '', error: '' });

  // 4. Media Presigned Generator State
  const [mediaForm, setMediaForm] = useState({ fileName: 'property-photo.jpg', contentType: 'image/jpeg', folder: 'properties', fileSize: 1048576 });
  const [mediaResult, setMediaResult] = useState(null);
  const [mediaLoading, setMediaLoading] = useState(false);

  // Load Cities
  const loadCities = useCallback(async () => {
    setCitiesLoading(true);
    try {
      const data = await adminContentApi.getCities();
      setCities(data || []);
      if (data && data.length > 0 && !selectedCity) {
        setSelectedCity(data[0]);
      }
    } catch (err) {
      setActionError(err.message || 'Failed to load cities');
    } finally {
      setCitiesLoading(false);
    }
  }, [selectedCity]);

  // Load Localities
  const loadLocalities = useCallback(async (cityId) => {
    if (!cityId) return;
    setLocalitiesLoading(true);
    try {
      const data = await adminContentApi.getLocalities(cityId);
      setLocalities(data || []);
    } catch (err) {
      setActionError(err.message || 'Failed to load localities');
    } finally {
      setLocalitiesLoading(false);
    }
  }, []);

  // Load FAQs
  const loadFaqs = useCallback(async () => {
    setFaqsLoading(true);
    try {
      const data = await adminContentApi.getFaqs();
      setFaqs(data || []);
    } catch (err) {
      setActionError(err.message || 'Failed to load FAQs');
    } finally {
      setFaqsLoading(false);
    }
  }, []);

  // Load Reports
  const loadReports = useCallback(async () => {
    setReportLoading(true);
    try {
      const res = await adminContentApi.searchReports({
        status: reportStatus || undefined,
        page: reportPage,
        size: reportSize,
      });
      if (res && res.content) {
        setReports(res.content);
        setReportTotal(res.totalElements || 0);
      } else {
        setReports([]);
        setReportTotal(0);
      }
    } catch (err) {
      setActionError(err.message || 'Failed to load abuse reports');
    } finally {
      setReportLoading(false);
    }
  }, [reportStatus, reportPage, reportSize]);

  useEffect(() => {
    if (activeTab === 'cities') {
      loadCities();
    } else if (activeTab === 'faqs') {
      loadFaqs();
    } else if (activeTab === 'reports') {
      loadReports();
    }
  }, [activeTab, loadCities, loadFaqs, loadReports]);

  useEffect(() => {
    if (selectedCity && selectedCity.id) {
      loadLocalities(selectedCity.id);
    }
  }, [selectedCity, loadLocalities]);

  // Save City (Create or Update)
  const handleSaveCity = async () => {
    if (!cityModal.name.trim()) {
      setCityModal((prev) => ({ ...prev, error: 'City name is required.' }));
      return;
    }
    try {
      if (cityModal.city) {
        await adminContentApi.updateCity(cityModal.city.id, {
          name: cityModal.name.trim(),
          state: cityModal.state.trim(),
          active: cityModal.active,
          displayOrder: Number(cityModal.displayOrder),
          imageUrl: cityModal.imageUrl,
        });
        setActionSuccess(`City ${cityModal.name} updated.`);
      } else {
        await adminContentApi.createCity({
          name: cityModal.name.trim(),
          state: cityModal.state.trim(),
          active: cityModal.active,
          displayOrder: Number(cityModal.displayOrder),
          imageUrl: cityModal.imageUrl,
        });
        setActionSuccess(`City ${cityModal.name} created.`);
      }
      setCityModal({ isOpen: false, city: null, name: '', state: '', active: true, displayOrder: 0, imageUrl: '', error: '' });
      loadCities();
    } catch (err) {
      setCityModal((prev) => ({ ...prev, error: err.message || 'Failed to save city' }));
    }
  };

  // Save Locality (Create or Update)
  const handleSaveLocality = async () => {
    if (!localityModal.name.trim()) {
      setLocalityModal((prev) => ({ ...prev, error: 'Locality name is required.' }));
      return;
    }
    try {
      if (localityModal.locality) {
        await adminContentApi.updateLocality(localityModal.locality.id, {
          name: localityModal.name.trim(),
          pincode: localityModal.pincode.trim(),
          active: localityModal.active,
          displayOrder: Number(localityModal.displayOrder),
        });
        setActionSuccess(`Locality ${localityModal.name} updated.`);
      } else {
        await adminContentApi.createLocality({
          cityId: selectedCity.id,
          name: localityModal.name.trim(),
          pincode: localityModal.pincode.trim(),
          active: localityModal.active,
          displayOrder: Number(localityModal.displayOrder),
        });
        setActionSuccess(`Locality ${localityModal.name} created.`);
      }
      setLocalityModal({ isOpen: false, locality: null, cityId: null, name: '', pincode: '', active: true, displayOrder: 0, error: '' });
      loadLocalities(selectedCity.id);
    } catch (err) {
      setLocalityModal((prev) => ({ ...prev, error: err.message || 'Failed to save locality' }));
    }
  };

  // Save FAQ
  const handleSaveFaq = async () => {
    if (!faqModal.question.trim() || !faqModal.answer.trim()) {
      setFaqModal((prev) => ({ ...prev, error: 'Question and answer are both required.' }));
      return;
    }
    try {
      if (faqModal.faq) {
        await adminContentApi.updateFaq(faqModal.faq.id, {
          question: faqModal.question.trim(),
          answer: faqModal.answer.trim(),
          category: faqModal.category,
          active: faqModal.active,
          displayOrder: Number(faqModal.displayOrder),
        });
        setActionSuccess('FAQ updated successfully.');
      } else {
        await adminContentApi.createFaq({
          question: faqModal.question.trim(),
          answer: faqModal.answer.trim(),
          category: faqModal.category,
          active: faqModal.active,
          displayOrder: Number(faqModal.displayOrder),
        });
        setActionSuccess('FAQ created successfully.');
      }
      setFaqModal({ isOpen: false, faq: null, question: '', answer: '', category: 'General', active: true, displayOrder: 0, error: '' });
      loadFaqs();
    } catch (err) {
      setFaqModal((prev) => ({ ...prev, error: err.message || 'Failed to save FAQ' }));
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ entry?')) return;
    try {
      await adminContentApi.deleteFaq(id);
      setActionSuccess('FAQ deleted.');
      loadFaqs();
    } catch (err) {
      setActionError(err.message || 'Failed to delete FAQ');
    }
  };

  // Resolve Abuse Report
  const handleResolveReport = async () => {
    try {
      await adminContentApi.updateReportStatus(
        reportModal.reportId,
        reportModal.status,
        reportModal.resolutionNotes
      );
      setActionSuccess(`Report updated to ${reportModal.status}.`);
      setReportModal({ isOpen: false, reportId: null, status: 'RESOLVED', resolutionNotes: '', error: '' });
      loadReports();
    } catch (err) {
      setReportModal((prev) => ({ ...prev, error: err.message || 'Failed to update report' }));
    }
  };

  // Generate Presigned Upload URL
  const handleGeneratePresignedUrl = async (e) => {
    e.preventDefault();
    setMediaLoading(true);
    setMediaResult(null);
    try {
      const res = await adminContentApi.generatePresignedUploadUrl({
        fileName: mediaForm.fileName,
        contentType: mediaForm.contentType,
        folder: mediaForm.folder,
        fileSize: Number(mediaForm.fileSize),
      });
      setMediaResult(res);
      setActionSuccess('Presigned PUT upload URL successfully minted.');
    } catch (err) {
      setActionError(err.message || 'Presigned URL generation failed');
    } finally {
      setMediaLoading(false);
    }
  };

  return (
    <div>
      {/* Sub-Tabs Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '0.75rem',
        }}
      >
        <button
          type="button"
          className={`admin-btn ${activeTab === 'cities' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('cities')}
        >
          <MapPin size={16} />
          <span>Cities & Localities</span>
        </button>

        <button
          type="button"
          className={`admin-btn ${activeTab === 'faqs' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('faqs')}
        >
          <HelpCircle size={16} />
          <span>Platform FAQs</span>
        </button>

        <button
          type="button"
          className={`admin-btn ${activeTab === 'reports' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('reports')}
        >
          <AlertTriangle size={16} />
          <span>Listing Abuse Reports</span>
        </button>

        <button
          type="button"
          className={`admin-btn ${activeTab === 'media' ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
          onClick={() => setActiveTab('media')}
        >
          <UploadCloud size={16} />
          <span>S3 Presigned Engine</span>
        </button>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div
          style={{
            backgroundColor: '#dcfce7',
            border: '1px solid #86efac',
            color: '#15803d',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{actionSuccess}</span>
          <button
            type="button"
            onClick={() => setActionSuccess('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#15803d' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {actionError && (
        <div
          style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* TAB 1: CITIES & LOCALITIES */}
      {activeTab === 'cities' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
          {/* Cities Panel */}
          <div className="admin-table-wrapper" style={{ padding: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Cities</h3>
              <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'CONTENT']}>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary admin-btn-sm"
                  onClick={() =>
                    setCityModal({
                      isOpen: true,
                      city: null,
                      name: '',
                      state: 'Karnataka',
                      active: true,
                      displayOrder: 0,
                      imageUrl: '',
                      error: '',
                    })
                  }
                >
                  <Plus size={14} />
                  <span>Add City</span>
                </button>
              </AdminRoleGuard>
            </div>

            {citiesLoading ? (
              <div>Loading cities...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {cities.map((c) => {
                  const isSelected = selectedCity?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCity(c)}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '6px',
                        backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                        border: isSelected ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: isSelected ? '#033487' : '#0f172a' }}>
                          {c.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.state}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <AdminStatusBadge status={c.active ? 'ACTIVE' : 'INACTIVE'} showDot={false} />
                        <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'CONTENT']}>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            style={{ padding: '4px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCityModal({
                                isOpen: true,
                                city: c,
                                name: c.name,
                                state: c.state,
                                active: c.active,
                                displayOrder: c.displayOrder || 0,
                                imageUrl: c.imageUrl || '',
                                error: '',
                              });
                            }}
                          >
                            <Edit size={12} />
                          </button>
                        </AdminRoleGuard>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Localities Panel */}
          <div className="admin-table-wrapper" style={{ padding: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                Localities in {selectedCity ? selectedCity.name : 'Selected City'}
              </h3>
              {selectedCity && (
                <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'CONTENT']}>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() =>
                      setLocalityModal({
                        isOpen: true,
                        locality: null,
                        cityId: selectedCity.id,
                        name: '',
                        pincode: '',
                        active: true,
                        displayOrder: 0,
                        error: '',
                      })
                    }
                  >
                    <Plus size={14} />
                    <span>Add Locality</span>
                  </button>
                </AdminRoleGuard>
              )}
            </div>

            {localitiesLoading ? (
              <div>Loading localities...</div>
            ) : localities.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                No localities created under this city yet.
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Locality Name</th>
                    <th>Pincode</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {localities.map((loc) => (
                    <tr key={loc.id}>
                      <td style={{ fontWeight: 600 }}>{loc.name}</td>
                      <td>{loc.pincode || '—'}</td>
                      <td>{loc.displayOrder || 0}</td>
                      <td><AdminStatusBadge status={loc.active ? 'ACTIVE' : 'INACTIVE'} /></td>
                      <td>
                        <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'CONTENT']}>
                          <button
                            type="button"
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                            onClick={() =>
                              setLocalityModal({
                                isOpen: true,
                                locality: loc,
                                cityId: selectedCity.id,
                                name: loc.name,
                                pincode: loc.pincode || '',
                                active: loc.active,
                                displayOrder: loc.displayOrder || 0,
                                error: '',
                              })
                            }
                          >
                            <Edit size={13} />
                          </button>
                        </AdminRoleGuard>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FAQS */}
      {activeTab === 'faqs' && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Platform FAQs</h3>
            <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'CONTENT']}>
              <button
                type="button"
                className="admin-btn admin-btn-primary"
                onClick={() =>
                  setFaqModal({
                    isOpen: true,
                    faq: null,
                    question: '',
                    answer: '',
                    category: 'General',
                    active: true,
                    displayOrder: 0,
                    error: '',
                  })
                }
              >
                <Plus size={16} />
                <span>Add FAQ</span>
              </button>
            </AdminRoleGuard>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Order</th>
                  <th>Category</th>
                  <th>Question & Answer</th>
                  <th style={{ width: '100px' }}>Status</th>
                  <th style={{ width: '120px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faqsLoading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading FAQs...</td>
                  </tr>
                ) : faqs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="admin-table-empty">No FAQs available.</td>
                  </tr>
                ) : (
                  faqs.map((f) => (
                    <tr key={f.id}>
                      <td style={{ fontWeight: 700, color: '#64748b' }}>#{f.displayOrder}</td>
                      <td>
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#f1f5f9',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          {f.category || 'General'}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{f.question}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                          {f.answer}
                        </div>
                      </td>
                      <td><AdminStatusBadge status={f.active ? 'ACTIVE' : 'INACTIVE'} /></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'CONTENT']}>
                            <button
                              type="button"
                              className="admin-btn admin-btn-secondary admin-btn-sm"
                              onClick={() =>
                                setFaqModal({
                                  isOpen: true,
                                  faq: f,
                                  question: f.question,
                                  answer: f.answer,
                                  category: f.category || 'General',
                                  active: f.active,
                                  displayOrder: f.displayOrder || 0,
                                  error: '',
                                })
                              }
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn-danger admin-btn-sm"
                              onClick={() => handleDeleteFaq(f.id)}
                            >
                              <Trash2 size={13} />
                            </button>
                          </AdminRoleGuard>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ABUSE REPORTS */}
      {activeTab === 'reports' && (
        <div>
          <AdminFilterBar
            searchPlaceholder="Filter reports..."
            filters={[
              {
                id: 'reportStatus',
                label: 'All Report States',
                value: reportStatus,
                options: [
                  { label: 'Pending Review', value: 'PENDING' },
                  { label: 'Reviewed', value: 'REVIEWED' },
                  { label: 'Resolved', value: 'RESOLVED' },
                  { label: 'Dismissed', value: 'DISMISSED' },
                ],
                onChange: (val) => {
                  setReportStatus(val);
                  setReportPage(0);
                },
              },
            ]}
            onReset={() => {
              setReportStatus('');
              setReportPage(0);
            }}
          />

          <AdminDataTable
            columns={[
              {
                header: 'Listing ID',
                key: 'propertyId',
                render: (row) => <code>{String(row.propertyId).slice(0, 8)}...</code>,
              },
              {
                header: 'Reporter',
                key: 'reporterName',
                render: (row) => (
                  <div>
                    <div style={{ fontWeight: 600 }}>{row.reporterName || 'Anonymous'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.reporterEmail || '—'}</div>
                  </div>
                ),
              },
              {
                header: 'Reason',
                key: 'reason',
                render: (row) => (
                  <div>
                    <strong style={{ color: '#b91c1c' }}>{row.reason}</strong>
                    {row.description && (
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{row.description}</div>
                    )}
                  </div>
                ),
              },
              {
                header: 'Status',
                key: 'status',
                render: (row) => <AdminStatusBadge status={row.status} />,
              },
              {
                header: 'Reported At',
                key: 'createdAt',
                render: (row) => (
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '—'}
                  </span>
                ),
              },
              {
                header: 'Action',
                key: 'actions',
                render: (row) => (
                  <AdminRoleGuard allowedRoles={['SUPER_ADMIN', 'MODERATOR']}>
                    <button
                      type="button"
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      onClick={() =>
                        setReportModal({
                          isOpen: true,
                          reportId: row.id,
                          status: 'RESOLVED',
                          resolutionNotes: '',
                          error: '',
                        })
                      }
                    >
                      <span>Moderate</span>
                    </button>
                  </AdminRoleGuard>
                ),
              },
            ]}
            data={reports}
            loading={reportLoading}
            totalItems={reportTotal}
            page={reportPage}
            pageSize={reportSize}
            onPageChange={setReportPage}
            onPageSizeChange={(newSize) => {
              setReportSize(newSize);
              setReportPage(0);
            }}
            emptyMessage="No abuse reports found."
          />
        </div>
      )}

      {/* TAB 4: S3 PRESIGNED ENGINE */}
      {activeTab === 'media' && (
        <div style={{ maxWidth: '680px' }}>
          <div className="admin-activity-card">
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700 }}>
              S3 Presigned Upload URL Generator
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Test and generate direct-to-S3 / local-disk presigned PUT upload URLs with AWS SDK v2 presigning.
            </p>

            <form onSubmit={handleGeneratePresignedUrl}>
              <div className="admin-form-group">
                <label className="admin-label">File Name</label>
                <input
                  type="text"
                  className="admin-input"
                  value={mediaForm.fileName}
                  onChange={(e) => setMediaForm({ ...mediaForm, fileName: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Content Type (MIME)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={mediaForm.contentType}
                  onChange={(e) => setMediaForm({ ...mediaForm, contentType: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Storage Folder</label>
                <select
                  className="admin-select-input"
                  style={{ width: '100%' }}
                  value={mediaForm.folder}
                  onChange={(e) => setMediaForm({ ...mediaForm, folder: e.target.value })}
                >
                  <option value="properties">properties</option>
                  <option value="avatars">avatars</option>
                  <option value="banners">banners</option>
                  <option value="documents">documents</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">File Size (Bytes)</label>
                <input
                  type="number"
                  className="admin-input"
                  value={mediaForm.fileSize}
                  onChange={(e) => setMediaForm({ ...mediaForm, fileSize: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={mediaLoading}
              >
                <UploadCloud size={16} />
                <span>{mediaLoading ? 'Generating...' : 'Generate Presigned PUT URL'}</span>
              </button>
            </form>

            {mediaResult && (
              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ fontWeight: 700, color: '#033487', marginBottom: '0.5rem' }}>
                  Presigned Upload Token Ready:
                </div>
                <div style={{ marginBottom: '0.35rem' }}>
                  <strong>Upload Key:</strong> <code>{mediaResult.fileKey || mediaResult.key}</code>
                </div>
                <div style={{ wordBreak: 'break-all' }}>
                  <strong>Upload URL:</strong>{' '}
                  <a
                    href={mediaResult.uploadUrl || mediaResult.presignedUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#2563eb' }}
                  >
                    {mediaResult.uploadUrl || mediaResult.presignedUrl}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* City Modal */}
      <AdminModal
        isOpen={cityModal.isOpen}
        onClose={() => setCityModal((prev) => ({ ...prev, isOpen: false }))}
        title={cityModal.city ? 'Edit City' : 'Create City'}
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setCityModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </button>
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleSaveCity}>
              Save City
            </button>
          </>
        }
      >
        {cityModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <span>{cityModal.error}</span>
          </div>
        )}
        <div className="admin-form-group">
          <label className="admin-label">City Name</label>
          <input
            type="text"
            className="admin-input"
            value={cityModal.name}
            onChange={(e) => setCityModal({ ...cityModal, name: e.target.value, error: '' })}
            required
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">State</label>
          <input
            type="text"
            className="admin-input"
            value={cityModal.state}
            onChange={(e) => setCityModal({ ...cityModal, state: e.target.value })}
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Display Order</label>
          <input
            type="number"
            className="admin-input"
            value={cityModal.displayOrder}
            onChange={(e) => setCityModal({ ...cityModal, displayOrder: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
          <input
            type="checkbox"
            id="city-active"
            checked={cityModal.active}
            onChange={(e) => setCityModal({ ...cityModal, active: e.target.checked })}
          />
          <label htmlFor="city-active" style={{ fontSize: '0.85rem' }}>Active & Visible on Portal</label>
        </div>
      </AdminModal>

      {/* Locality Modal */}
      <AdminModal
        isOpen={localityModal.isOpen}
        onClose={() => setLocalityModal((prev) => ({ ...prev, isOpen: false }))}
        title={localityModal.locality ? 'Edit Locality' : `Add Locality to ${selectedCity?.name}`}
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setLocalityModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </button>
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleSaveLocality}>
              Save Locality
            </button>
          </>
        }
      >
        {localityModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <span>{localityModal.error}</span>
          </div>
        )}
        <div className="admin-form-group">
          <label className="admin-label">Locality Name</label>
          <input
            type="text"
            className="admin-input"
            value={localityModal.name}
            onChange={(e) => setLocalityModal({ ...localityModal, name: e.target.value, error: '' })}
            required
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Postal Pincode</label>
          <input
            type="text"
            className="admin-input"
            value={localityModal.pincode}
            onChange={(e) => setLocalityModal({ ...localityModal, pincode: e.target.value })}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
          <input
            type="checkbox"
            id="loc-active"
            checked={localityModal.active}
            onChange={(e) => setLocalityModal({ ...localityModal, active: e.target.checked })}
          />
          <label htmlFor="loc-active" style={{ fontSize: '0.85rem' }}>Active & Discoverable</label>
        </div>
      </AdminModal>

      {/* FAQ Modal */}
      <AdminModal
        isOpen={faqModal.isOpen}
        onClose={() => setFaqModal((prev) => ({ ...prev, isOpen: false }))}
        title={faqModal.faq ? 'Edit Platform FAQ' : 'Create Platform FAQ'}
        maxWidth="600px"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setFaqModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </button>
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleSaveFaq}>
              Save FAQ
            </button>
          </>
        }
      >
        {faqModal.error && (
          <div className="admin-login-error" style={{ marginBottom: '0.75rem' }}>
            <span>{faqModal.error}</span>
          </div>
        )}
        <div className="admin-form-group">
          <label className="admin-label">Question</label>
          <input
            type="text"
            className="admin-input"
            value={faqModal.question}
            onChange={(e) => setFaqModal({ ...faqModal, question: e.target.value, error: '' })}
            required
          />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Category</label>
          <select
            className="admin-select-input"
            style={{ width: '100%' }}
            value={faqModal.category}
            onChange={(e) => setFaqModal({ ...faqModal, category: e.target.value })}
          >
            <option value="General">General</option>
            <option value="Renting">Renting</option>
            <option value="Buying">Buying</option>
            <option value="Selling">Selling</option>
            <option value="Subscriptions">Subscriptions</option>
          </select>
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Answer</label>
          <textarea
            className="admin-input"
            rows={4}
            value={faqModal.answer}
            onChange={(e) => setFaqModal({ ...faqModal, answer: e.target.value, error: '' })}
            required
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="faq-active"
            checked={faqModal.active}
            onChange={(e) => setFaqModal({ ...faqModal, active: e.target.checked })}
          />
          <label htmlFor="faq-active" style={{ fontSize: '0.85rem' }}>Active & Visible</label>
        </div>
      </AdminModal>

      {/* Abuse Report Moderation Modal */}
      <AdminModal
        isOpen={reportModal.isOpen}
        onClose={() => setReportModal((prev) => ({ ...prev, isOpen: false }))}
        title="Resolve Listing Abuse Report"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setReportModal((prev) => ({ ...prev, isOpen: false }))}
            >
              Cancel
            </button>
            <button type="button" className="admin-btn admin-btn-primary" onClick={handleResolveReport}>
              Update Report Status
            </button>
          </>
        }
      >
        <div className="admin-form-group">
          <label className="admin-label">Action Outcome</label>
          <select
            className="admin-select-input"
            style={{ width: '100%' }}
            value={reportModal.status}
            onChange={(e) => setReportModal({ ...reportModal, status: e.target.value })}
          >
            <option value="REVIEWED">REVIEWED</option>
            <option value="RESOLVED">RESOLVED (Listing moderated)</option>
            <option value="DISMISSED">DISMISSED (Invalid report)</option>
          </select>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Moderation Resolution Notes</label>
          <textarea
            className="admin-input"
            rows={3}
            placeholder="e.g. Verified listing documents. Issue resolved with owner."
            value={reportModal.resolutionNotes}
            onChange={(e) => setReportModal({ ...reportModal, resolutionNotes: e.target.value })}
          />
        </div>
      </AdminModal>
    </div>
  );
}
