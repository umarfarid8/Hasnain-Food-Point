import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
  LogOut,
  RefreshCw,
  Search,
  Sparkles,
  ArrowLeft,
  Loader2,
  Check,
} from 'lucide-react';
import { adminLogin, fetchAdminMenuItems, updateAdminMenuItem } from '../../lib/api';

const TOKEN_KEY = 'hfp_admin_token';
const EXPIRY_KEY = 'hfp_admin_token_expiry';

// Category visual icon mapping
const CATEGORY_ICONS = {
  fries: '🍟',
  burger: '🍔',
  samosa: '🥟',
  roll: '🌯',
  naan: '🫓',
  'cold drinks & juices': '🥤',
  'cold drinks': '🥤',
};

export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [items, setItems] = useState([]);
  const [editedItems, setEditedItems] = useState({});
  const [savingItemIds, setSavingItemIds] = useState({});
  const [savedSuccessIds, setSavedSuccessIds] = useState({});
  const [loadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState('');
  const [globalFeedback, setGlobalFeedback] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Validate existing token
  useEffect(() => {
    if (token) {
      const expiry = sessionStorage.getItem(EXPIRY_KEY);
      if (expiry && new Date().getTime() > Number(expiry)) {
        handleLogout();
      }
    }
  }, [token]);

  // Load menu items when authenticated
  const loadItems = useCallback(async () => {
    if (!token) return;
    setLoadingItems(true);
    setItemsError('');
    try {
      const data = await fetchAdminMenuItems(token);
      setItems(data);
      // Initialize edit state cache
      const initialEdits = {};
      data.forEach((item) => {
        initialEdits[item.id] = {
          price: item.price,
          isAvailable: item.isAvailable,
        };
      });
      setEditedItems(initialEdits);
    } catch (err) {
      if (err.status === 401) {
        handleLogout();
        setLoginError('Session expired. Please log in again.');
      } else {
        setItemsError(err.message || 'Failed to load menu items.');
      }
    } finally {
      setLoadingItems(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadItems();
    }
  }, [token, loadItems]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setLoginError('Please enter the admin password.');
      return;
    }

    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await adminLogin(password);
      if (res.token) {
        const expiryTime = new Date().getTime() + (res.expiresIn || 7200) * 1000;
        sessionStorage.setItem(TOKEN_KEY, res.token);
        sessionStorage.setItem(EXPIRY_KEY, expiryTime.toString());
        setToken(res.token);
        setPassword('');
      } else {
        setLoginError('Authentication failed.');
      }
    } catch (err) {
      if (err.status === 401) {
        setLoginError('Incorrect admin password. Please try again.');
      } else {
        setLoginError(err.message || 'Login failed. Please check network/server.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRY_KEY);
    setToken('');
    setItems([]);
    setEditedItems({});
    setGlobalFeedback(null);
  };

  const handlePriceChange = (id, newPrice) => {
    setEditedItems((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        price: newPrice,
      },
    }));
  };

  const handleToggleAvailability = (id) => {
    setEditedItems((prev) => {
      const current = prev[id] || {};
      return {
        ...prev,
        [id]: {
          ...current,
          isAvailable: !current.isAvailable,
        },
      };
    });
  };

  const handleSaveItem = async (id) => {
    const edit = editedItems[id];
    if (!edit) return;

    setSavingItemIds((prev) => ({ ...prev, [id]: true }));
    try {
      const updated = await updateAdminMenuItem(id, edit, token);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updated } : item)));
      setSavedSuccessIds((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setSavedSuccessIds((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      }, 2500);

      setGlobalFeedback({
        type: 'success',
        message: `Updated "${updated.name}" successfully!`,
      });
      setTimeout(() => setGlobalFeedback(null), 3500);
    } catch (err) {
      if (err.status === 401) {
        handleLogout();
        setLoginError('Session expired while saving. Please log in again.');
      } else {
        setGlobalFeedback({
          type: 'error',
          message: `Failed to save item: ${err.message}`,
        });
      }
    } finally {
      setSavingItemIds((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  };

  const handleSaveAll = async () => {
    const changedItems = items.filter((item) => {
      const edit = editedItems[item.id];
      return (
        edit &&
        (Number(edit.price) !== Number(item.price) ||
          Boolean(edit.isAvailable) !== Boolean(item.isAvailable))
      );
    });

    if (changedItems.length === 0) {
      setGlobalFeedback({
        type: 'info',
        message: 'No changes detected to save.',
      });
      setTimeout(() => setGlobalFeedback(null), 2500);
      return;
    }

    setGlobalFeedback({
      type: 'info',
      message: `Saving ${changedItems.length} items...`,
    });

    let successCount = 0;
    for (const item of changedItems) {
      try {
        const edit = editedItems[item.id];
        const updated = await updateAdminMenuItem(item.id, edit, token);
        setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, ...updated } : i)));
        setSavedSuccessIds((prev) => ({ ...prev, [item.id]: true }));
        successCount++;
      } catch (err) {
        console.error('Failed updating item:', item.name, err);
      }
    }

    setTimeout(() => {
      setSavedSuccessIds({});
    }, 2500);

    setGlobalFeedback({
      type: 'success',
      message: `Saved ${successCount} of ${changedItems.length} modified items!`,
    });
    setTimeout(() => setGlobalFeedback(null), 4000);
  };

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach((item) => {
      if (item.categoryName) set.add(item.categoryName);
    });
    return Array.from(set);
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        item.categoryName?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Changed items count
  const modifiedCount = useMemo(() => {
    return items.filter((item) => {
      const edit = editedItems[item.id];
      return (
        edit &&
        (Number(edit.price) !== Number(item.price) ||
          Boolean(edit.isAvailable) !== Boolean(item.isAvailable))
      );
    }).length;
  }, [items, editedItems]);

  const availableCount = items.filter((i) => editedItems[i.id]?.isAvailable ?? i.isAvailable).length;
  const soldOutCount = items.length - availableCount;

  // Render Login Form if unauthenticated
  if (!token) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center p-4 font-body">
        <div className="w-full max-w-md bg-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary shadow-lg shadow-accent-primary/10">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-text-primary tracking-tight">
              Admin Portal
            </h1>
            <p className="text-sm text-text-secondary">
              Hasnain Food Point • <span className="font-urdu">ایڈمن لاگ ان</span>
            </p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-password" className="block text-xs font-semibold text-text-secondary">
                Admin Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  required
                  autoFocus
                  className="w-full min-h-[48px] px-4 pr-12 rounded-2xl bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full min-h-[48px] rounded-2xl bg-accent-primary hover:bg-accent-primary/90 active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-accent-primary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Log In to Admin Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Back link */}
          <div className="text-center pt-2">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-secondary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Hasnain Food Point Website</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Render Authenticated Admin Management Interface
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-body selection:bg-accent-primary selection:text-white">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-bg-surface/95 backdrop-blur-md border-b border-border-subtle shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-heading font-bold text-text-primary leading-tight">
                Hasnain Food Point
              </h1>
              <p className="text-xs text-accent-secondary font-medium">
                Admin Panel • <span className="font-urdu">مینو مینجمنٹ</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-primary border border-border-subtle transition-all"
            >
              <span>View Public Site</span>
            </a>

            <button
              type="button"
              onClick={handleLogout}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Global Alert Notification */}
        {globalFeedback && (
          <div
            className={`p-4 rounded-2xl border text-sm flex items-center gap-3 transition-all duration-300 ${
              globalFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : globalFeedback.type === 'error'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
            }`}
          >
            {globalFeedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : globalFeedback.type === 'error' ? (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
            )}
            <span className="font-medium">{globalFeedback.message}</span>
          </div>
        )}

        {/* Stats & Actions Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Total Items
            </span>
            <span className="text-2xl font-bold font-heading text-text-primary mt-1">
              {items.length}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Available 🟢
            </span>
            <span className="text-2xl font-bold font-heading text-emerald-400 mt-1">
              {availableCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Sold Out 🔴
            </span>
            <span className="text-2xl font-bold font-heading text-amber-400 mt-1">
              {soldOutCount}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle flex flex-col justify-between">
            <span className="text-xs font-semibold text-accent-primary uppercase tracking-wider">
              Unsaved Changes
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-bold font-heading text-accent-primary">
                {modifiedCount}
              </span>
              {modifiedCount > 0 && (
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-2.5 py-1 rounded-lg bg-accent-primary hover:bg-accent-primary/90 text-white text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Save className="w-3 h-3" />
                  <span>Save All</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-bg-surface border border-border-subtle space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items by name..."
                className="w-full min-h-[42px] pl-10 pr-4 rounded-xl bg-bg-primary border border-border-subtle text-text-primary placeholder:text-text-secondary/50 text-xs sm:text-sm focus:outline-none focus:border-accent-primary"
              />
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={loadItems}
              disabled={loadingItems}
              className="min-h-[42px] px-4 rounded-xl bg-bg-primary hover:bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loadingItems ? 'animate-spin text-accent-primary' : ''}`} />
              <span>Refresh Menu</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-accent-primary text-white border-accent-primary shadow-md shadow-accent-primary/20'
                  : 'bg-bg-primary text-text-secondary border-border-subtle hover:text-text-primary hover:border-accent-primary/40'
              }`}
            >
              <span>All Categories ({items.length})</span>
            </button>

            {categories.map((cat) => {
              const icon = CATEGORY_ICONS[cat.toLowerCase()] || '🍽️';
              const count = items.filter((i) => i.categoryName?.toLowerCase() === cat.toLowerCase()).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-accent-primary text-white border-accent-primary shadow-md shadow-accent-primary/20'
                      : 'bg-bg-primary text-text-secondary border-border-subtle hover:text-text-primary hover:border-accent-primary/40'
                  }`}
                >
                  <span>{icon}</span>
                  <span>{cat}</span>
                  <span className="opacity-70 text-[11px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Spinner */}
        {loadingItems && items.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-accent-primary mx-auto" />
            <p className="text-sm text-text-secondary">Loading menu items from API...</p>
          </div>
        )}

        {/* Items Error */}
        {itemsError && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-center space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto" />
            <p className="text-sm">{itemsError}</p>
            <button
              type="button"
              onClick={loadItems}
              className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 font-semibold text-xs transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Menu Items Table / Cards Grid */}
        {!loadingItems && filteredItems.length > 0 && (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const edit = editedItems[item.id] || {
                price: item.price,
                isAvailable: item.isAvailable,
              };
              const isSaving = Boolean(savingItemIds[item.id]);
              const isSavedSuccess = Boolean(savedSuccessIds[item.id]);
              const isModified =
                Number(edit.price) !== Number(item.price) ||
                Boolean(edit.isAvailable) !== Boolean(item.isAvailable);
              const icon = CATEGORY_ICONS[item.categoryName?.toLowerCase()] || '🍽️';

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl bg-bg-surface border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isModified
                      ? 'border-accent-primary/60 bg-accent-primary/[0.02] shadow-md shadow-accent-primary/5'
                      : isSavedSuccess
                      ? 'border-emerald-500/50 bg-emerald-500/[0.02]'
                      : 'border-border-subtle hover:border-border-subtle/80'
                  }`}
                >
                  {/* Left: Item Info */}
                  <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-bg-primary border border-border-subtle flex items-center justify-center text-xl flex-shrink-0 overflow-hidden relative">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>{icon}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-text-primary truncate">
                          {item.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-bg-primary border border-border-subtle text-[11px] font-semibold text-text-secondary">
                          {item.categoryName}
                        </span>
                        {!edit.isAvailable && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-400">
                            Sold Out
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-text-secondary truncate mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Price, Availability Toggle, and Save Button */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap sm:flex-nowrap border-t sm:border-t-0 border-border-subtle/60 pt-3 sm:pt-0">
                    {/* Price Input */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-text-secondary">Rs.</span>
                      <input
                        type="number"
                        min="0"
                        step="5"
                        value={edit.price}
                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                        className="w-24 sm:w-28 min-h-[40px] px-3 rounded-xl bg-bg-primary border border-border-subtle text-text-primary font-bold text-sm focus:outline-none focus:border-accent-primary"
                        placeholder="Price"
                      />
                    </div>

                    {/* Availability Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleAvailability(item.id)}
                      className={`min-h-[40px] px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                        edit.isAvailable
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          edit.isAvailable ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <span>{edit.isAvailable ? 'Available' : 'Sold Out'}</span>
                    </button>

                    {/* Save Button */}
                    <button
                      type="button"
                      onClick={() => handleSaveItem(item.id)}
                      disabled={isSaving || (!isModified && !isSavedSuccess)}
                      className={`min-h-[40px] min-w-[90px] px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                        isSavedSuccess
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : isModified
                          ? 'bg-accent-primary hover:bg-accent-primary/90 text-white shadow-md shadow-accent-primary/20 scale-102'
                          : 'bg-bg-primary border border-border-subtle text-text-secondary/50 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : isSavedSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved ✓</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty Search Results */}
        {!loadingItems && filteredItems.length === 0 && items.length > 0 && (
          <div className="text-center py-12 rounded-2xl bg-bg-surface border border-border-subtle p-6 space-y-2">
            <p className="text-sm text-text-secondary">No items match your filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              className="text-xs text-accent-secondary hover:underline font-semibold cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
