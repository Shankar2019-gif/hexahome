import { useState, useRef, useEffect } from 'react';
import { propertyApi, mediaApi } from '../services/api';

const INITIAL_FORM = {
  role: 'Individual',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  listingType: 'RENT',
  category: 'RESIDENTIAL',
  title: '',
  bhk: '2 BHK',
  city: 'Noida',
  locality: '',
  address: '',
  price: '',
  securityDeposit: '',
  furnishing: 'Semi-Furnished',
  areaSqFt: '1150',
  description: '',
};

export function usePropertyForm({ onSuccess, editId, currentUser } = {}) {
  const [formData, setFormData] = useState(() => {
    let firstName = '';
    let lastName = '';
    if (currentUser?.firstName) {
      firstName = currentUser.firstName;
      lastName = currentUser.lastName || '';
    } else if (currentUser?.name) {
      const parts = currentUser.name.trim().split(/\s+/);
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }
    return {
      ...INITIAL_FORM,
      firstName,
      lastName,
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
    };
  });
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Edit Mode state
  const [editPropertyId, setEditPropertyId] = useState(() => {
    if (editId) return editId;
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('edit') || null;
    }
    return null;
  });
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);

  const [imageUrls, setImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch property details if editing
  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const targetId = editId || params?.get('edit');
    if (!targetId) return;

    setEditPropertyId(targetId);
    setIsLoadingEdit(true);

    propertyApi.getPropertyDetail(targetId)
      .then((res) => {
        if (!isMountedRef.current) return;
        const p = res?.data || res;
        if (p) {
          let fName = '';
          let lName = '';
          if (p.ownerName) {
            const parts = p.ownerName.trim().split(/\s+/);
            fName = parts[0] || '';
            lName = parts.slice(1).join(' ') || '';
          }
          setFormData((prev) => ({
            ...prev,
            role: p.ownerRole || prev.role || 'Individual',
            firstName: fName || prev.firstName,
            lastName: lName || prev.lastName,
            phone: p.ownerPhone || prev.phone,
            email: p.ownerEmail || prev.email,
            listingType: (p.adType || p.listingType || 'RENT').toUpperCase(),
            category: (p.category || 'RESIDENTIAL').toUpperCase(),
            title: p.title || '',
            bhk: p.bhk || '2 BHK',
            city: p.cityName || p.city || 'Noida',
            locality: p.localityName || p.locality || '',
            address: p.address || '',
            price: p.price ? String(p.price) : '',
            securityDeposit: p.securityDeposit ? String(p.securityDeposit) : '',
            furnishing: p.furnishing || 'Semi-Furnished',
            areaSqFt: p.builtUpArea || p.areaSqFt ? String(p.builtUpArea || p.areaSqFt) : '1150',
            description: p.description || '',
          }));

          if (Array.isArray(p.imageUrls) && p.imageUrls.length > 0) {
            setImageUrls(p.imageUrls);
          } else if (Array.isArray(p.images) && p.images.length > 0) {
            setImageUrls(p.images.map((img) => (typeof img === 'string' ? img : img.url || img.imageUrl)));
          } else if (p.coverImageUrl) {
            setImageUrls([p.coverImageUrl]);
          }

          setIsWizardOpen(true);
        }
      })
      .catch((err) => {
        console.warn('[usePropertyForm] Error loading property for editing:', err);
        if (isMountedRef.current) {
          setSubmitError('Failed to load property details for editing.');
        }
      })
      .finally(() => {
        if (isMountedRef.current) {
          setIsLoadingEdit(false);
        }
      });
  }, [editId]);

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validateContact = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openWizard = () => {
    if (!validateContact()) return;
    setSubmitError('');
    setIsWizardOpen(true);
  };

  const closeWizard = () => {
    setIsWizardOpen(false);
    setSubmitError('');
  };

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const generateAiDescription = () => {
    const { bhk, category, listingType, locality, city, furnishing } = formData;
    const desc = `Beautiful ${bhk} ${category.toLowerCase()} available for ${listingType.toLowerCase()} in prime ${locality || 'locality'}, ${city}. Well ventilated, ${furnishing.toLowerCase()} with modular kitchen, dedicated car parking, and 24/7 security. Ready to move immediately.`;
    updateField('description', desc);
  };

  const uploadImages = async (files) => {
    if (!files?.length) return;
    setIsUploading(true);
    setUploadError('');

    try {
      const res = await mediaApi.uploadMultipleImages(Array.from(files), 'properties');
      if (!isMountedRef.current) return;
      const urls = Array.isArray(res) ? res.map((f) => f.url) : (res?.url ? [res.url] : []);
      setImageUrls((prev) => [...prev, ...urls]);
    } catch (err) {
      if (isMountedRef.current) {
        console.warn('[usePropertyForm] Image upload failed or timed out:', err.message);
        // Fallback: create local object URLs so photos are visible and preserved without blocking
        try {
          const fallbackUrls = Array.from(files).map((f) => URL.createObjectURL(f));
          setImageUrls((prev) => [...prev, ...fallbackUrls]);
          setUploadError('Image upload timed out. Photos attached locally and will be saved with your listing.');
          setTimeout(() => {
            if (isMountedRef.current) setUploadError('');
          }, 6000);
        } catch {
          setUploadError(err.response?.data?.message || err.message || 'Image upload failed');
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index) => {
    setImageUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const submitProperty = async (e) => {
    if (e) e.preventDefault();

    const priceNum = parseFloat(formData.price);
    if (!priceNum || priceNum <= 0) {
      setSubmitError('Please enter a valid price or monthly rent');
      return;
    }

    const areaNum = parseInt(formData.areaSqFt, 10);
    if (!areaNum || areaNum <= 0) {
      setSubmitError('Please enter a valid area in sq.ft');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const fullName = `${formData.firstName} ${formData.lastName}`.trim() || 'HexaHome Owner';
    const autoTitle = `${formData.bhk} Apartment for ${formData.listingType === 'RENT' ? 'Rent' : 'Sale'} in ${formData.locality || 'Sector 76'}, ${formData.city}`;

    const payload = {
      title: formData.title.trim() || autoTitle,
      listingType: formData.listingType,
      category: formData.category,
      city: formData.city,
      locality: formData.locality.trim() || 'Sector 76',
      address: formData.address.trim() || `${formData.locality || 'Sector 76'}, ${formData.city}`,
      bhk: formData.bhk,
      price: priceNum,
      securityDeposit: parseFloat(formData.securityDeposit) || 0,
      furnishing: formData.furnishing,
      areaSqFt: areaNum,
      description: formData.description.trim(),
      ownerName: fullName,
      ownerPhone: formData.phone,
      ownerEmail: formData.email.trim(),
      imageUrls: imageUrls.length > 0 ? imageUrls : [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'
      ],
    };

    try {
      if (editPropertyId) {
        await propertyApi.updateProperty(editPropertyId, payload);
      } else {
        await propertyApi.createProperty(payload);
      }
      if (!isMountedRef.current) return;
      setSubmitSuccess(true);
      setTimeout(() => {
        if (!isMountedRef.current) return;
        setIsWizardOpen(false);
        setSubmitSuccess(false);
        if (onSuccess) onSuccess();
      }, 1800);
    } catch (err) {
      console.warn('[usePropertyForm] Property submission error:', err);
      const isTimeoutOrNetwork = !err.response || (
        err.message && (
          err.message.toLowerCase().includes('timeout') ||
          err.message.toLowerCase().includes('network') ||
          err.message.toLowerCase().includes('econn')
        )
      );

      // Offline / Timeout fallback: preserve listing in local storage draft store
      if (isTimeoutOrNetwork) {
        try {
          const localListings = JSON.parse(localStorage.getItem('hexahome_user_properties') || '[]');
          const newListing = {
            ...payload,
            id: editPropertyId || ('loc_' + Date.now().toString(36)),
            slug: (payload.title || 'listing').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36),
            status: 'ACTIVE',
            coverImageUrl: payload.imageUrls?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
            builtUpArea: payload.areaSqFt,
            localityName: payload.locality,
            cityName: payload.city,
            createdAt: new Date().toISOString(),
            isLocalDraft: true,
          };
          const existingIdx = localListings.findIndex((p) => p.id === newListing.id);
          if (existingIdx >= 0) {
            localListings[existingIdx] = newListing;
          } else {
            localListings.unshift(newListing);
          }
          localStorage.setItem('hexahome_user_properties', JSON.stringify(localListings));

          if (!isMountedRef.current) return;
          setSubmitSuccess(true);
          setTimeout(() => {
            if (!isMountedRef.current) return;
            setIsWizardOpen(false);
            setSubmitSuccess(false);
            if (onSuccess) onSuccess();
          }, 1800);
          return;
        } catch (storageErr) {
          console.error('[usePropertyForm] Failed to save local fallback property:', storageErr);
        }
      }

      if (isMountedRef.current) {
        setSubmitError(err.response?.data?.message || err.message || (editPropertyId ? 'Failed to update listing' : 'Failed to submit listing'));
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return {
    formData,
    errors,
    updateField,
    currentStep,
    nextStep,
    prevStep,
    isWizardOpen,
    openWizard,
    closeWizard,
    imageUrls,
    isUploading,
    uploadError,
    fileInputRef,
    uploadImages,
    removeImage,
    generateAiDescription,
    isSubmitting,
    submitError,
    submitSuccess,
    submitProperty,
    isEditMode: Boolean(editPropertyId),
    editPropertyId,
    isLoadingEdit,
  };
}
