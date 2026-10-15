import React, { useState, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  User,
  Calendar,
  ExternalLink,
  MessageCircle,
  Copy,
  Check,
  Building,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Send,
  Inbox,
} from 'lucide-react';
import { leadApi } from '../../services/api';

export default function MyInquiriesTab({ onNavigate, currentUser }) {
  // 'received' (as Property Owner) | 'sent' (as Tenant/Buyer)
  const [subTab, setSubTab] = useState('received');
  const [leads, setLeads] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [copiedId, setCopiedId] = useState(null);

  const fetchReceivedLeads = useCallback(async (targetPage = 0) => {
    try {
      setLoading(true);
      setError('');
      const res = await leadApi.getMyLeads(targetPage, 10);
      const data = res?.data || res;
      if (data && Array.isArray(data.content)) {
        setLeads(data.content);
        setTotalPages(data.totalPages || 1);
        setPage(data.number || targetPage);
      } else if (Array.isArray(data)) {
        setLeads(data);
        setTotalPages(1);
      } else {
        setLeads([]);
      }
    } catch (err) {
      console.warn('[MyInquiriesTab] Error fetching owner leads:', err);
      setError('Failed to fetch leads for your listings.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSentInquiries = useCallback(async (targetPage = 0) => {
    try {
      setLoading(true);
      setError('');
      const res = await leadApi.getMyInquiries(targetPage, 10);
      const data = res?.data || res;
      if (data && Array.isArray(data.content)) {
        setInquiries(data.content);
        setTotalPages(data.totalPages || 1);
        setPage(data.number || targetPage);
      } else if (Array.isArray(data)) {
        setInquiries(data);
        setTotalPages(1);
      } else {
        setInquiries([]);
      }
    } catch (err) {
      console.warn('[MyInquiriesTab] Error fetching seeker inquiries:', err);
      setError('Failed to fetch your contacted properties history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (subTab === 'received') {
      fetchReceivedLeads(0);
    } else {
      fetchSentInquiries(0);
    }
  }, [subTab, fetchReceivedLeads, fetchSentInquiries]);

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return 'Recently';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="dashboard-tab-panel animate-fade-in">
      <div className="tab-header-row">
        <div>
          <h2 className="tab-main-title">Inquiries & Leads Center</h2>
          <p className="tab-subtitle">
            Track inquiries received for your listings and history of properties you have contacted.
          </p>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="sub-tab-bar">
        <button
          type="button"
          className={`sub-tab-btn ${subTab === 'received' ? 'active' : ''}`}
          onClick={() => {
            setSubTab('received');
            setPage(0);
          }}
        >
          <Inbox size={16} />
          <span>Received Inquiries (For Owners)</span>
          {leads.length > 0 && <span className="sub-tab-badge">{leads.length}</span>}
        </button>

        <button
          type="button"
          className={`sub-tab-btn ${subTab === 'sent' ? 'active' : ''}`}
          onClick={() => {
            setSubTab('sent');
            setPage(0);
          }}
        >
          <Send size={16} />
          <span>Contacted Properties (For Seekers)</span>
          {inquiries.length > 0 && <span className="sub-tab-badge">{inquiries.length}</span>}
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="inquiries-list">
          {[1, 2, 3].map((n) => (
            <div key={n} className="inquiry-card skeleton-card">
              <div className="skeleton-line" style={{ width: '45%' }} />
              <div className="skeleton-line" style={{ width: '80%' }} />
              <div className="skeleton-line" style={{ width: '35%' }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="tab-error-state">
          <AlertTriangle size={32} />
          <p>{error}</p>
          <button
            type="button"
            onClick={() => (subTab === 'received' ? fetchReceivedLeads(page) : fetchSentInquiries(page))}
            className="btn-retry"
          >
            <RefreshCw size={15} />
            <span>Retry</span>
          </button>
        </div>
      ) : subTab === 'received' ? (
        /* OWNER LEADS VIEW */
        leads.length === 0 ? (
          <div className="tab-empty-state">
            <div className="empty-state-icon">
              <Inbox size={36} />
            </div>
            <h3>No inquiries received yet</h3>
            <p>
              When interested tenants or buyers contact your listings, their details will appear here instantly.
            </p>
            <button
              type="button"
              className="dashboard-primary-btn"
              onClick={() => onNavigate?.('/post-property')}
            >
              Post a Property
            </button>
          </div>
        ) : (
          <div className="inquiries-list">
            {leads.map((lead) => {
              const seekerPhone = lead.seekerPhone || '';
              return (
                <div key={lead.id} className="inquiry-card">
                  <div className="inquiry-header">
                    <div className="seeker-info">
                      <div className="seeker-avatar">
                        {(lead.seekerName || 'S').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="seeker-name">{lead.seekerName || 'Prospective Seeker'}</h4>
                        <div className="inquiry-date">
                          <Calendar size={13} />
                          <span>{formatDate(lead.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <span className="lead-status-pill">{lead.status || 'NEW'}</span>
                  </div>

                  {/* Property Reference */}
                  <div className="inquiry-prop-ref">
                    <Building size={15} />
                    <span>Listing: <strong>{lead.propertyTitle || 'Property Listing'}</strong></span>
                    {lead.propertySlug && (
                      <button
                        type="button"
                        className="btn-inline-link"
                        onClick={() => onNavigate?.(`/properties/${lead.propertySlug}`)}
                        title="View Property"
                      >
                        <ExternalLink size={13} />
                      </button>
                    )}
                  </div>

                  {/* Message / Reveal Notification */}
                  <div className="inquiry-msg-box">
                    <p className="inquiry-msg-text">
                      "{lead.message || 'Interested in scheduling a site visit and discussing terms.'}"
                    </p>
                  </div>

                  {/* Seeker Contact & Actions */}
                  <div className="inquiry-footer">
                    <div className="seeker-phone-badge">
                      <Phone size={14} />
                      <span>{seekerPhone || '+91 XXXXX XXXXX'}</span>
                      {seekerPhone && (
                        <button
                          type="button"
                          className="btn-copy-small"
                          onClick={() => handleCopy(seekerPhone, lead.id)}
                          title="Copy phone number"
                        >
                          {copiedId === lead.id ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      )}
                    </div>

                    <div className="inquiry-action-buttons">
                      {seekerPhone && (
                        <>
                          <a
                            href={`tel:${seekerPhone.replace(/\s+/g, '')}`}
                            className="btn-dash-call"
                          >
                            <Phone size={14} />
                            <span>Call Seeker</span>
                          </a>
                          <a
                            href={`https://wa.me/${seekerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${lead.seekerName || 'there'}, regarding your inquiry on HexaHome for "${lead.propertyTitle || 'our listing'}":`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-dash-wa"
                          >
                            <MessageCircle size={14} />
                            <span>WhatsApp</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* SEEKER CONTACTED PROPERTIES VIEW */
        inquiries.length === 0 ? (
          <div className="tab-empty-state">
            <div className="empty-state-icon">
              <Send size={36} />
            </div>
            <h3>No contacted properties yet</h3>
            <p>
              When you reveal owner numbers or submit inquiries on listings, they will be archived here for easy reference.
            </p>
            <button
              type="button"
              className="dashboard-primary-btn"
              onClick={() => onNavigate?.('/search')}
            >
              Search Properties
            </button>
          </div>
        ) : (
          <div className="inquiries-list">
            {inquiries.map((inq) => {
              const ownerPhone = inq.ownerPhone || '';
              const ownerEmail = inq.ownerEmail || '';
              return (
                <div key={inq.id} className="inquiry-card seeker-inquiry-card">
                  <div className="inquiry-header">
                    <div className="seeker-info">
                      <div className="seeker-avatar owner-type">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <h4 className="seeker-name">
                          {inq.propertyTitle || 'Property Listing'}
                        </h4>
                        <div className="inquiry-date">
                          <Calendar size={13} />
                          <span>Contacted on {formatDate(inq.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {inq.propertySlug && (
                      <button
                        type="button"
                        className="btn-action view"
                        onClick={() => onNavigate?.(`/properties/${inq.propertySlug || inq.propertyId}`)}
                      >
                        <ExternalLink size={14} />
                        <span>View Listing</span>
                      </button>
                    )}
                  </div>

                  {/* Owner Unlocked Contact Info Card */}
                  <div className="unlocked-owner-box">
                    <div className="unlocked-owner-row">
                      <span className="unlocked-lbl">Property Owner:</span>
                      <strong className="unlocked-val">{inq.ownerName || 'Verified Landlord'}</strong>
                    </div>

                    {ownerPhone && (
                      <div className="unlocked-contact-chip">
                        <Phone size={14} style={{ color: '#0284c7' }} />
                        <span className="unlocked-phone">{ownerPhone}</span>
                        <button
                          type="button"
                          className="btn-copy-small"
                          onClick={() => handleCopy(ownerPhone, inq.id)}
                          title="Copy phone"
                        >
                          {copiedId === inq.id ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    )}

                    {ownerEmail && (
                      <div className="unlocked-contact-chip">
                        <Mail size={14} style={{ color: '#0284c7' }} />
                        <span>{ownerEmail}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Connect Actions */}
                  <div className="inquiry-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
                    <div className="inquiry-action-buttons">
                      {ownerPhone && (
                        <>
                          <a
                            href={`tel:${ownerPhone.replace(/\s+/g, '')}`}
                            className="btn-dash-call"
                          >
                            <Phone size={14} />
                            <span>Call Owner</span>
                          </a>
                          <a
                            href={`https://wa.me/${ownerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${inq.ownerName || 'Sir/Madam'}, I contacted you via HexaHome regarding your property "${inq.propertyTitle}".`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-dash-wa"
                          >
                            <MessageCircle size={14} />
                            <span>WhatsApp</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="dashboard-pagination">
          <button
            type="button"
            className="dash-page-btn"
            disabled={page <= 0}
            onClick={() => {
              const target = page - 1;
              if (subTab === 'received') fetchReceivedLeads(target);
              else fetchSentInquiries(target);
            }}
          >
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>
          <span className="dash-page-info">
            Page {page + 1} of {totalPages}
          </span>
          <button
            type="button"
            className="dash-page-btn"
            disabled={page >= totalPages - 1}
            onClick={() => {
              const target = page + 1;
              if (subTab === 'received') fetchReceivedLeads(target);
              else fetchSentInquiries(target);
            }}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
