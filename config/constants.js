// ==================== ORDER STATUSES ====================
export const STATUSES = {
  new: { label: 'جديد', bg: '#eff6ff', fg: '#1d4ed8', border: '#bfdbfe', dot: '#3b82f6' },
  preparing: { label: 'قيد التجهيز', bg: '#fffbeb', fg: '#b45309', border: '#fde68a', dot: '#f59e0b' },
  delivered: { label: 'تم التوصيل', bg: '#ecfdf5', fg: '#047857', border: '#a7f3d0', dot: '#10b981' },
  cancelled: { label: 'ملغي', bg: '#fef2f2', fg: '#b91c1c', border: '#fecaca', dot: '#ef4444' },
};

export const STATUS_KEYS = Object.keys(STATUSES);

// ==================== ORDER SOURCES ====================
export const SOURCE_KEYS = ['website', 'whatsapp', 'instagram', 'phone', 'other'];

export const SOURCE_LABELS = {
  website: 'المتجر',
  whatsapp: 'واتساب',
  instagram: 'انستقرام',
  phone: 'اتصال',
  other: 'غير ذلك',
};

// ==================== PAYMENT METHODS ====================
export const PAYMENT_KEYS = ['cash', 'knet', 'transfer'];

export const PAYMENT_LABELS = {
  cash: 'كاش',
  knet: 'كي نت',
  transfer: 'تحويل بنكي',
};

// ==================== USER ROLES ====================
export const ROLES = {
  owner: { label: 'مالك', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
  manager: { label: 'مدير', color: '#0369a1', bg: '#eff6ff', border: '#bfdbfe' },
  staff: { label: 'موظف', color: '#525252', bg: '#f5f5f5', border: '#d4d4d4' },
};

export const ROLE_KEYS = Object.keys(ROLES);

export const can = {
  manageOrders: (role) => ['owner', 'manager', 'staff'].includes(role),
  deleteOrders: (role) => ['owner', 'manager'].includes(role),
  manageProducts: (role) => ['owner', 'manager'].includes(role),
  manageSettings: (role) => ['owner', 'manager'].includes(role),
  manageUsers: (role) => role === 'owner',
};

export const ROLE_DESCRIPTIONS = {
  owner: 'كل الصلاحيات + إدارة المستخدمين',
  manager: 'كل شي عدا إدارة المستخدمين',
  staff: 'الطلبات فقط، بدون حذف',
};

// ==================== KUWAIT AREAS BY GOVERNORATE ====================
export const KW_AREAS_BY_GOV = {
  'العاصمة': [
    'الشرق', 'المرقاب', 'الدسمة', 'الدعية', 'القبلة', 'الصوابر', 'الشامية', 'الشويخ',
    'كيفان', 'القادسية', 'المنصورية', 'الفيحاء', 'النزهة', 'الروضة', 'العديلية',
    'الخالدية', 'السرة', 'اليرموك', 'قرطبة', 'الصليبخات', 'الدوحة', 'غرناطة',
    'الشويخ السكنية', 'النهضة', 'الرابية', 'بنيد القار', 'عبدالله السالم',
    'ضاحية عبدالله السالم', 'الصالحية',
  ],
  'حولي': [
    'السالمية', 'الرميثية', 'حولي', 'ميدان حولي', 'بيان', 'مشرف', 'سلوى', 'الجابرية',
    'الشعب', 'البدع', 'الزهراء', 'الشهداء', 'الصديق', 'حطين', 'السلام', 'الرومانسية',
    'النقرة', 'الشعب البحري', 'شرق السالمية', 'غرب السالمية', 'جنوب السرة',
  ],
  'الفروانية': [
    'الفروانية', 'الرحاب', 'إشبيلية', 'العمرية', 'خيطان', 'الأندلس', 'الرقعي',
    'العارضية', 'الرابية', 'جليب الشيوخ', 'صباح الناصر', 'الضجيج',
    'العارضية الصناعية', 'خيطان الجنوبي', 'العمرية الصناعية', 'الفردوس',
    'جابر العلي', 'مطار الكويت',
  ],
  'مبارك الكبير': [
    'المسيلة', 'صباح السالم', 'المسايل', 'القصور', 'العدان', 'القرين', 'مبارك الكبير',
    'أبو الحصانية', 'أبو فطيرة', 'الفنيطيس', 'صبحان', 'الفنطاس', 'الوسطى',
  ],
  'الأحمدي': [
    'الأحمدي', 'الفحيحيل', 'المنقف', 'الرقة', 'هدية', 'العقيلة', 'فهد الأحمد',
    'الظهر', 'الصباحية', 'الفنطاس', 'المهبولة', 'أبو حليفة', 'الفنيطيس',
    'علي صباح السالم', 'جابر العلي', 'ضاحية فهد الأحمد', 'صباح الأحمد البحرية',
    'الخيران', 'الزور', 'الوفرة السكنية', 'الوفرة الزراعية', 'المقوع',
    'ميناء عبدالله', 'الشعيبة', 'الرياض', 'بنيدر',
  ],
  'الجهراء': [
    'الجهراء', 'الواحة', 'النعيم', 'القصر', 'سعد العبدالله', 'الصليبية', 'تيماء',
    'العيون', 'العبدلي', 'الصبية', 'كبد', 'الروضتين', 'النسيم',
    'جهراء الأقرة', 'الواحة الجديدة', 'الجهراء الصناعية',
  ],
};

export const KW_GOVS = Object.keys(KW_AREAS_BY_GOV);

// ==================== APP DEFAULTS ====================
export const DEFAULT_SETTINGS = {
  shopName: 'متجري',
  shopPhone: '',
  defaultDeliveryFee: 1.0,
};

export const STORAGE_BUCKET = 'products';
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
