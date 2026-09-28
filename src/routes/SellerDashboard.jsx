import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useIsSellerAuthenticated,
  useSellerProfile,
  useSellerProducts,
  useSellerProductActions,
  useLogoutSeller
} from "../store/index";
import Button from "../components/Button";
import { formatPrice } from "../utils/format";

// Status badge component - moved to top level for use in multiple tabs
function StatusBadge({ status }) {
  const statusConfig = {
    pending: { label: "Pending", class: "bg-amber-100 text-amber-800" },
    processing: { label: "Processing", class: "bg-blue-100 text-blue-800" },
    shipped: { label: "Shipped", class: "bg-indigo-100 text-indigo-800" },
    delivered: { label: "Delivered", class: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", class: "bg-rose-100 text-rose-800" },
  };
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${config.class}`}
    >
      {config.label}
    </span>
  );
}

const SellerDashboard = () => {
  const navigate = useNavigate();
  const sellerProfile = useSellerProfile();
  const sellerProducts = useSellerProducts();
  const { addSellerProduct, removeSellerProduct, updateSellerProduct } = useSellerProductActions();
  const logoutSeller = useLogoutSeller();
  const isAuthenticated = useIsSellerAuthenticated();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/seller/login");
    return null;
  }

  // Dashboard tabs
  const tabs = [
    { id: "overview", label: "Overview", icon: OverviewIcon },
    { id: "products", label: "Products", icon: ProductsIcon },
    { id: "orders", label: "Orders", icon: OrdersIcon },
    { id: "settings", label: "Settings", icon: SettingsIcon },
  ];

  const [activeTab, setActiveTab] = useState("overview");
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    category: "electronics",
    price: "",
    wasPrice: "",
    description: "",
    keyword: "",
    images: [],
    stock: "",
    variants: [],
  });

  const [formErrors, setFormErrors] = useState({});

  // Categories for product form
  const categories = [
    { value: "phones", label: "Phones & Tablets" },
    { value: "electronics", label: "Electronics" },
    { value: "fashion", label: "Fashion" },
    { value: "home", label: "Home & Living" },
    { value: "beauty", label: "Beauty & Grooming" },
    { value: "grocery", label: "Supermarket" },
  ];

  // Mock orders data
  const mockOrders = useMemo(
    () => [
      {
        id: "ORD-001",
        date: "2026-01-15",
        customer: "John Doe",
        email: "john@example.com",
        items: 3,
        total: 185000,
        status: "delivered",
      },
      {
        id: "ORD-002",
        date: "2026-01-14",
        customer: "Jane Smith",
        email: "jane@example.com",
        items: 1,
        total: 65000,
        status: "shipped",
      },
      {
        id: "ORD-003",
        date: "2026-01-13",
        customer: "Bob Wilson",
        email: "bob@example.com",
        items: 2,
        total: 92000,
        status: "processing",
      },
      {
        id: "ORD-004",
        date: "2026-01-12",
        customer: "Alice Brown",
        email: "alice@example.com",
        items: 5,
        total: 210000,
        status: "pending",
      },
      {
        id: "ORD-005",
        date: "2026-01-11",
        customer: "Charlie Davis",
        email: "charlie@example.com",
        items: 1,
        total: 42000,
        status: "cancelled",
      },
    ],
    [],
  );

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = sellerProducts.length;
    const totalRevenue = mockOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
    const totalOrders = mockOrders.length;
    const pendingOrders = mockOrders.filter(
      (o) => o.status === "pending" || o.status === "processing",
    ).length;

    return { totalProducts, totalRevenue, totalOrders, pendingOrders };
  }, [sellerProducts, mockOrders]);

  // Handle product form changes
  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    if (formErrors[name])
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validate product form
  const validateForm = () => {
    const errors = {};
    if (!productForm.name?.trim()) errors.name = "Product name is required";
    if (!productForm.category) errors.category = "Category is required";
    if (!productForm.price || Number(productForm.price) <= 0)
      errors.price = "Valid price is required";
    if (!productForm.description?.trim())
      errors.description = "Description is required";
    if (!productForm.stock || Number(productForm.stock) < 0)
      errors.stock = "Stock quantity is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add/edit product
  const handleSubmitProduct = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newProduct = {
      id: editingProduct ? editingProduct.id : `p${Date.now()}`,
      name: productForm.name,
      cat: productForm.category,
      price: Number(productForm.price),
      was: productForm.wasPrice ? Number(productForm.wasPrice) : null,
      rating: 0,
      reviews: 0,
      keyword:
        productForm.keyword ||
        productForm.name.toLowerCase().replace(/\s+/g, ","),
      lock: Math.floor(Math.random() * 1000),
      desc: productForm.description,
      stock: Number(productForm.stock),
    };

    if (editingProduct) {
      updateSellerProduct(newProduct);
    } else {
      addSellerProduct(newProduct);
    }

    closeProductModal();
  };

  // Open edit modal
  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.cat,
      price: product.price.toString(),
      wasPrice: product.was?.toString() || "",
      description: product.desc,
      keyword: product.keyword,
      images: [],
      stock: product.stock?.toString() || "0",
      variants: product.variants || [],
    });
    setIsAddProductModalOpen(true);
  };

  // Open add modal
  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "electronics",
      price: "",
      wasPrice: "",
      description: "",
      keyword: "",
      images: [],
      stock: "",
      variants: [],
    });
    setFormErrors({});
    setIsAddProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsAddProductModalOpen(false);
    setEditingProduct(null);
    setFormErrors({});
  };

  // Handle delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      removeSellerProduct(productId);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logoutSeller();
    navigate("/seller/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar + Main Layout */}
      <div className="flex">
        {/* Mobile sidebar overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity ${activeTab ? "" : "hidden"}`}
          onClick={() => setActiveTab("overview")}
          aria-hidden="true"
        />

        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex lg:flex-col fixed lg:static inset-y-0 left-0 z-50 w-64 bg-background-elevated border-r border-border transition-transform duration-300">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-border">
            <Link
              to="/seller/dashboard"
              className="flex items-center space-x-3"
              aria-label="Shop Izzy Seller Dashboard"
            >
              <span className="text-xl font-bold font-display text-gradient-amber">
                Shop
              </span>
              <span className="text-xl font-bold font-display text-structural">
                Izzy
              </span>
              <span className="ml-auto px-2 py-1 text-xs font-semibold text-gradient-amber bg-gradient-amber/10 rounded-full">
                Seller
              </span>
            </Link>
            <p className="mt-4 text-sm text-structural/60">
              Welcome back,{" "}
              <span className="font-semibold text-structural">
                {sellerProfile.name}
              </span>
            </p>
          </div>

          {/* Navigation Tabs */}
          <nav
            className="flex-1 p-4 space-y-1 overflow-y-auto"
            role="navigation"
            aria-label="Seller dashboard navigation"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-amber/10 text-gradient-amber border border-gradient-amber/30"
                    : "text-structural/70 hover:bg-background-muted hover:text-structural"
                }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}

            {/* Logout */}
            <div className="pt-4 border-t border-border mt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-structural/70 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen">
          {/* Mobile Header */}
          <header className="lg:hidden bg-background-elevated border-b border-border sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 py-3">
              <Link
                to="/seller/dashboard"
                className="flex items-center space-x-2"
              >
                <span className="text-xl font-bold font-display text-gradient-amber">
                  Shop
                </span>
                <span className="text-xl font-bold font-display text-structural">
                  Izzy
                </span>
              </Link>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="input-premium py-2 px-3 text-sm bg-background"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </div>
          </header>

          {/* Page Content */}
          <div className="p-4 lg:p-8 animate-fade-in">
            {/* Page Header */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-structural">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h1>
                <p className="text-structural/60 mt-1">
                  Manage your seller account and store
                </p>
              </div>
              {activeTab === "products" && (
                <Button onClick={openAddModal} size="md">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Add Product
                </Button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <OverviewTab
                stats={stats}
                sellerProfile={sellerProfile}
                recentOrders={mockOrders.slice(0, 5)}
              />
            )}

            {activeTab === "products" && (
              <ProductsTab
                products={sellerProducts}
                onEdit={openEditModal}
                onDelete={handleDeleteProduct}
                onAdd={openAddModal}
                categories={categories}
              />
            )}

            {activeTab === "orders" && <OrdersTab orders={mockOrders} />}

            {activeTab === "settings" && (
              <SettingsTab sellerProfile={sellerProfile} />
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Product Modal */}
      {isAddProductModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-background-elevated rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2
                id="modal-title"
                className="font-display text-xl font-bold text-structural"
              >
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button
                onClick={closeProductModal}
                className="btn-ghost p-2"
                aria-label="Close modal"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="p-6 space-y-5">
              {/* Product Name */}
              <div>
                <label htmlFor="name" className="label-premium">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={productForm.name}
                  onChange={handleFormChange}
                  className={`input-premium ${formErrors.name ? "border-rose-500 focus:border-rose-500" : ""}`}
                  placeholder="Enter product name"
                  required
                />
                {formErrors.name && (
                  <p className="text-rose-500 text-sm mt-1">
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="label-premium">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={productForm.category}
                  onChange={handleFormChange}
                  className={`input-premium ${formErrors.category ? "border-rose-500 focus:border-rose-500" : ""}`}
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <p className="text-rose-500 text-sm mt-1">
                    {formErrors.category}
                  </p>
                )}
              </div>

              {/* Price Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="label-premium">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={productForm.price}
                    onChange={handleFormChange}
                    className={`input-premium ${formErrors.price ? "border-rose-500 focus:border-rose-500" : ""}`}
                    placeholder="50000"
                    min="1"
                    required
                  />
                  {formErrors.price && (
                    <p className="text-rose-500 text-sm mt-1">
                      {formErrors.price}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="wasPrice" className="label-premium">
                    Was Price (₦) - Optional
                  </label>
                  <input
                    type="number"
                    id="wasPrice"
                    name="wasPrice"
                    value={productForm.wasPrice}
                    onChange={handleFormChange}
                    className="input-premium"
                    placeholder="75000"
                    min="1"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label htmlFor="stock" className="label-premium">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={productForm.stock}
                  onChange={handleFormChange}
                  className={`input-premium ${formErrors.stock ? "border-rose-500 focus:border-rose-500" : ""}`}
                  placeholder="100"
                  min="0"
                  required
                />
                {formErrors.stock && (
                  <p className="text-rose-500 text-sm mt-1">
                    {formErrors.stock}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="label-premium">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={productForm.description}
                  onChange={handleFormChange}
                  className={`input-premium min-h-[120px] resize-y ${formErrors.description ? "border-rose-500 focus:border-rose-500" : ""}`}
                  placeholder="Describe your product features, materials, dimensions, etc."
                  required
                  rows={5}
                />
                {formErrors.description && (
                  <p className="text-rose-500 text-sm mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>

              {/* Keywords */}
              <div>
                <label htmlFor="keyword" className="label-premium">
                  Search Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  id="keyword"
                  name="keyword"
                  value={productForm.keyword}
                  onChange={handleFormChange}
                  className="input-premium"
                  placeholder="headphones, wireless, noise-cancelling, audio"
                />
                <p className="text-xs text-structural/50 mt-1">
                  Keywords help customers find your product
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeProductModal}
                >
                  Cancel
                </Button>
                <Button type="submit" size="md">
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Icon Components
function OverviewIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function ProductsIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function OrdersIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function SettingsIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// Tab Components
function OverviewTab({ stats, sellerProfile, recentOrders }) {
  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon={<ProductsIcon className="h-6 w-6" />}
          color="bg-gradient-amber/10 text-gradient-amber"
        />
        <StatCard
          label="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          icon={<RevenueIcon className="h-6 w-6" />}
          color="bg-green-100 text-green-700"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={<OrdersIcon className="h-6 w-6" />}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          icon={<PendingIcon className="h-6 w-6" />}
          color="bg-amber-100 text-amber-700"
        />
      </div>

      {/* Seller Info Card */}
      <div className="card-premium p-6">
        <h2 className="font-display text-lg font-bold text-structural mb-4">
          Store Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoItem label="Store Name" value={sellerProfile.businessName} />
          <InfoItem label="Category" value={sellerProfile.businessCategory} />
          <InfoItem label="Email" value={sellerProfile.businessEmail} />
          <InfoItem
            label="Status"
            value={
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                {sellerProfile.verificationStatus}
              </span>
            }
          />
        </div>
        <div className="mt-4 pt-4 border-t border-border flex justify-end">
          <Link
            to="/seller/dashboard?tab=settings"
            className="btn-outline text-sm"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card-premium overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-structural">
            Recent Orders
          </h2>
          <Link
            href="/seller/dashboard?tab=orders"
            className="text-sm text-gradient-amber hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background-muted text-left text-sm text-structural/60">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-background-muted/50">
                  <td className="p-4 font-mono text-sm text-structural">
                    {order.id}
                  </td>
                  <td className="p-4 text-sm text-structural/70">
                    {order.date}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-structural">
                      {order.customer}
                    </div>
                    <div className="text-xs text-structural/50">
                      {order.email}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-structural/70">
                    {order.items}
                  </td>
                  <td className="p-4 font-medium text-structural">
                    {formatPrice(order.total)}
                  </td>
                  <td className="p-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="card-premium p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-structural/60">{label}</p>
          <p className="font-display text-2xl font-bold text-structural mt-1">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-structural/60">{label}</p>
      <p className="font-medium text-structural mt-1">{value}</p>
    </div>
  );
}

function RevenueIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function PendingIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ProductsTab({ products, onEdit, onDelete, onAdd, categories }) {
  if (products.length === 0) {
    return (
      <div className="card-premium p-12 text-center">
        <ProductsIcon className="h-16 w-16 mx-auto text-structural/30 mb-4" />
        <h3 className="font-display text-xl font-bold text-structural mb-2">
          No Products Yet
        </h3>
        <p className="text-structural/60 mb-6">
          Start adding products to your store
        </p>
        <Button onClick={onAdd} size="lg">
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Your First Product
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Products Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-background-muted text-left text-sm text-structural/60">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-background-muted/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-background-muted flex items-center justify-center overflow-hidden">
                        {product.img ? (
                          <img
                            src={product.img}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ProductsIcon className="h-6 w-6 text-structural/30" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-structural">
                          {product.name}
                        </p>
                        <p className="text-xs text-structural/50 font-mono">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-background-muted text-structural/70">
                      {categories.find((c) => c.value === product.cat)?.label ||
                        product.cat}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-structural">
                    {formatPrice(product.price)}
                  </td>
                  <td className="p-4 text-structural/70">
                    {product.stock || 0}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        (product.stock || 0) > 10
                          ? "bg-green-100 text-green-800"
                          : (product.stock || 0) > 0
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {(product.stock || 0) > 10
                        ? "In Stock"
                        : (product.stock || 0) > 0
                          ? "Low Stock"
                          : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(product)}
                        aria-label={`Edit ${product.name}`}
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(product.id)}
                        className="text-rose-600 hover:bg-rose-50"
                        aria-label={`Delete ${product.name}`}
                      >
                        <svg
                          className="h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ orders }) {
  const statusConfig = {
    pending: { label: "Pending", class: "bg-amber-100 text-amber-800" },
    processing: { label: "Processing", class: "bg-blue-100 text-blue-800" },
    shipped: { label: "Shipped", class: "bg-indigo-100 text-indigo-800" },
    delivered: { label: "Delivered", class: "bg-green-100 text-green-800" },
    cancelled: { label: "Cancelled", class: "bg-rose-100 text-rose-800" },
  };

  return (
    <div className="card-premium overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-background-muted text-left text-sm text-structural/60">
              <th className="p-4 font-medium">Order ID</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Items</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => {
              const config = statusConfig[order.status];
              return (
                <tr key={order.id} className="hover:bg-background-muted/50">
                  <td className="p-4 font-mono text-sm text-structural">
                    {order.id}
                  </td>
                  <td className="p-4 text-sm text-structural/70">
                    {order.date}
                  </td>
                  <td className="p-4 font-medium text-structural">
                    {order.customer}
                  </td>
                  <td className="p-4 text-sm text-structural/50">
                    {order.email}
                  </td>
                  <td className="p-4 text-sm text-structural/70">
                    {order.items}
                  </td>
                  <td className="p-4 font-medium text-structural">
                    {formatPrice(order.total)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${config.class}`}
                    >
                      {config.label}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsTab({ sellerProfile }) {
  const [formData, setFormData] = useState({
    businessName: sellerProfile.businessName || "",
    businessEmail: sellerProfile.businessEmail || "",
    businessPhone: sellerProfile.businessPhone || "",
    businessAddress: sellerProfile.businessAddress || "",
    businessCity: sellerProfile.businessCity || "",
    businessState: sellerProfile.businessState || "",
    businessCategory: sellerProfile.businessCategory || "",
    businessDescription: sellerProfile.bio || "",
    bankName: sellerProfile.bankDetails?.bankName || "",
    accountName: sellerProfile.bankDetails?.accountName || "",
    accountNumber: sellerProfile.bankDetails?.accountNumber || "",
    sortCode: sellerProfile.bankDetails?.sortCode || "",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    // In a real app, this would call an API
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const nigerianStates = [
    "Abia",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "FCT - Abuja",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara",
  ];

  const businessCategories = [
    "Electronics & Gadgets",
    "Fashion & Clothing",
    "Home & Living",
    "Beauty & Personal Care",
    "Phones & Tablets",
    "Groceries & Food",
    "Sports & Outdoors",
    "Books & Media",
    "Automotive",
    "Health & Wellness",
    "Baby & Kids",
    "Art & Collectibles",
    "Other",
  ];

  const nigerianBanks = [
    "Access Bank",
    "Citibank",
    "Diamond Bank",
    "Ecobank",
    "Fidelity Bank",
    "First Bank of Nigeria",
    "First City Monument Bank",
    "Guaranty Trust Bank",
    "Heritage Bank",
    "Keystone Bank",
    "Polaris Bank",
    "Providus Bank",
    "Stanbic IBTC Bank",
    "Standard Chartered Bank",
    "Sterling Bank",
    "SunTrust Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa",
    "Unity Bank",
    "Wema Bank",
    "Zenith Bank",
    "Other",
  ];

  return (
    <div className="max-w-3xl space-y-8">
      {/* Business Info */}
      <div className="card-premium p-6">
        <h2 className="font-display text-lg font-bold text-structural mb-6 flex items-center gap-2">
          <svg
            className="h-5 w-5 text-gradient-amber"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Business Information
        </h2>
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="businessName" className="label-premium">
                Business Name
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="input-premium"
              />
            </div>
            <div>
              <label htmlFor="businessEmail" className="label-premium">
                Business Email
              </label>
              <input
                type="email"
                id="businessEmail"
                name="businessEmail"
                value={formData.businessEmail}
                onChange={handleChange}
                className="input-premium"
              />
            </div>
          </div>
          <div>
            <label htmlFor="businessPhone" className="label-premium">
              Business Phone
            </label>
            <input
              type="tel"
              id="businessPhone"
              name="businessPhone"
              value={formData.businessPhone}
              onChange={handleChange}
              className="input-premium"
              placeholder="+234 8XX XXX XXXX"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="businessCategory" className="label-premium">
                Business Category
              </label>
              <select
                id="businessCategory"
                name="businessCategory"
                value={formData.businessCategory}
                onChange={handleChange}
                className="input-premium"
              >
                <option value="">Select Category</option>
                {businessCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="businessState" className="label-premium">
                State
              </label>
              <select
                id="businessState"
                name="businessState"
                value={formData.businessState}
                onChange={handleChange}
                className="input-premium"
              >
                <option value="">Select State</option>
                {nigerianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="businessAddress" className="label-premium">
                Address
              </label>
              <input
                type="text"
                id="businessAddress"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                className="input-premium"
                placeholder="123 Commercial Avenue"
              />
            </div>
            <div>
              <label htmlFor="businessCity" className="label-premium">
                City
              </label>
              <input
                type="text"
                id="businessCity"
                name="businessCity"
                value={formData.businessCity}
                onChange={handleChange}
                className="input-premium"
                placeholder="Lagos"
              />
            </div>
          </div>
          <div>
            <label htmlFor="businessDescription" className="label-premium">
              Business Description
            </label>
            <textarea
              id="businessDescription"
              name="businessDescription"
              value={formData.businessDescription}
              onChange={handleChange}
              className="input-premium min-h-[100px] resize-y"
              placeholder="Describe your business..."
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        </form>
      </div>

      {/* Bank Details */}
      <div className="card-premium p-6">
        <h2 className="font-display text-lg font-bold text-structural mb-6 flex items-center gap-2">
          <svg
            className="h-5 w-5 text-gradient-amber"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 22v-4a2 2 0 0 1 2-2h14v4" />
            <path d="M10 2v2M14 2v2M7 7h10" />
          </svg>
          Bank Details (for Payouts)
        </h2>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label htmlFor="bankName" className="label-premium">
              Bank Name
            </label>
            <select
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className="input-premium"
            >
              <option value="">Select Bank</option>
              {nigerianBanks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="accountName" className="label-premium">
                Account Name
              </label>
              <input
                type="text"
                id="accountName"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                className="input-premium"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="accountNumber" className="label-premium">
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="input-premium"
                placeholder="0123456789"
                maxLength={10}
              />
            </div>
          </div>
          <div>
            <label htmlFor="sortCode" className="label-premium">
              Sort Code
            </label>
            <input
              type="text"
              id="sortCode"
              name="sortCode"
              value={formData.sortCode}
              onChange={handleChange}
              className="input-premium"
              placeholder="058152036"
              maxLength={9}
            />
          </div>
          <Button type="submit" className="w-full sm:w-auto">
            Save Bank Details
          </Button>
        </form>
      </div>
    </div>
  );
}

export default SellerDashboard;
