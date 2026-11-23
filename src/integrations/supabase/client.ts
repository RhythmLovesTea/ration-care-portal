// Frontend Demo Data & Mock Supabase Client
// Fully self-contained: works out-of-the-box on Vercel without external backend or Supabase setup.

const STORAGE_KEY = 'ration_care_demo_state_v1';

// Initial rich sample data for Indian Public Distribution System (PDS)
const initialData = {
  currentUser: {
    id: 'demo-user-beneficiary',
    email: 'sunita.devi@ration.gov.in',
    name: 'Sunita Devi',
    role: 'beneficiary' as 'admin' | 'beneficiary'
  },
  profile: {
    id: 'demo-user-beneficiary',
    name: 'Sunita Devi',
    aadhaar: 'XXXX-XXXX-4829',
    phone: '9876543210',
    ration_card_number: 'RC-MH-2024-98432',
    card_type: 'Priority Household (PHH)',
    issue_date: '2021-04-15'
  },
  householdMembers: [
    { id: 'hm-1', name: 'Ramesh Kumar', relationship: 'Spouse', age: 44 },
    { id: 'hm-2', name: 'Pooja Kumar', relationship: 'Daughter', age: 16 },
    { id: 'hm-3', name: 'Aman Kumar', relationship: 'Son', age: 11 },
    { id: 'hm-4', name: 'Kanti Devi', relationship: 'Mother-in-law', age: 68 }
  ],
  entitlements: {
    rice_total: 25,
    rice_used: 15,
    wheat_total: 20,
    wheat_used: 12,
    sugar_total: 5,
    sugar_used: 2,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  },
  historicalEntitlements: [
    { month: 6, year: 2025, rice_total: 25, rice_used: 25, wheat_total: 20, wheat_used: 20, sugar_total: 5, sugar_used: 5 },
    { month: 7, year: 2025, rice_total: 25, rice_used: 23, wheat_total: 20, wheat_used: 18, sugar_total: 5, sugar_used: 4 },
    { month: 8, year: 2025, rice_total: 25, rice_used: 25, wheat_total: 20, wheat_used: 20, sugar_total: 5, sugar_used: 5 },
    { month: 9, year: 2025, rice_total: 25, rice_used: 21, wheat_total: 20, wheat_used: 17, sugar_total: 5, sugar_used: 3 },
    { month: 10, year: 2025, rice_total: 25, rice_used: 25, wheat_total: 20, wheat_used: 20, sugar_total: 5, sugar_used: 5 },
    { month: 11, year: 2025, rice_total: 25, rice_used: 15, wheat_total: 20, wheat_used: 12, sugar_total: 5, sugar_used: 2 }
  ],
  transactions: [
    {
      id: 'TXN-90241',
      user_id: 'demo-user-beneficiary',
      item_type: 'Rice (10 kg)',
      amount: 10,
      fps_shop_id: 'shop-1',
      fps_name: 'FPS Shop #234 - Mumbai Central',
      transaction_date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'TXN-88120',
      user_id: 'demo-user-beneficiary',
      item_type: 'Wheat (8 kg)',
      amount: 8,
      fps_shop_id: 'shop-1',
      fps_name: 'FPS Shop #234 - Mumbai Central',
      transaction_date: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString(),
      created_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'TXN-82015',
      user_id: 'demo-user-beneficiary',
      item_type: 'Sugar (2 kg)',
      amount: 2,
      fps_shop_id: 'shop-1',
      fps_name: 'FPS Shop #234 - Mumbai Central',
      transaction_date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
      created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString()
    }
  ],
  shops: [
    {
      id: 'shop-1',
      name: 'FPS Shop #234',
      location: 'Mumbai Central, Ward C',
      latitude: 19.0176,
      longitude: 72.8562,
      rice_stock: 450,
      wheat_stock: 380,
      sugar_stock: 120,
      status: 'good',
      contact_number: '+91 98201 12345',
      working_hours: '9:00 AM - 6:00 PM (Mon-Sat)',
      last_inspection_date: '2025-10-15',
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 'shop-2',
      name: 'FPS Shop #567',
      location: 'Andheri West, Station Road',
      latitude: 19.1136,
      longitude: 72.8697,
      rice_stock: 120,
      wheat_stock: 90,
      sugar_stock: 25,
      status: 'low',
      contact_number: '+91 98202 23456',
      working_hours: '8:30 AM - 5:30 PM (Mon-Sat)',
      last_inspection_date: '2025-10-20',
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 'shop-3',
      name: 'FPS Shop #891',
      location: 'Bandra East, Govt Colony',
      latitude: 19.0596,
      longitude: 72.8395,
      rice_stock: 550,
      wheat_stock: 480,
      sugar_stock: 150,
      status: 'good',
      contact_number: '+91 98203 34567',
      working_hours: '9:00 AM - 7:00 PM (Daily)',
      last_inspection_date: '2025-10-25',
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 'shop-4',
      name: 'FPS Shop #432',
      location: 'Dadar Market, Plaza Area',
      latitude: 19.0176,
      longitude: 72.8479,
      rice_stock: 50,
      wheat_stock: 40,
      sugar_stock: 10,
      status: 'critical',
      contact_number: '+91 98204 45678',
      working_hours: '10:00 AM - 4:00 PM',
      last_inspection_date: '2025-10-28',
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString()
    }
  ],
  complaints: [
    {
      id: 'CMP-8941',
      user_id: 'demo-user-beneficiary',
      subject: 'Delayed Wheat Stock Delivery',
      description: 'Fair price shop #432 informed us that wheat stock was unavailable during regular distribution hours.',
      status: 'pending',
      image_url: null,
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      resolved_at: null,
      resolved_by: null
    },
    {
      id: 'CMP-7720',
      user_id: 'demo-user-beneficiary',
      subject: 'Weighing Scale Discrepancy',
      description: 'Biometric authentication was accepted but receipt showed 25kg while actual given was 23kg.',
      status: 'resolved',
      image_url: null,
      created_at: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 11 * 24 * 3600 * 1000).toISOString(),
      resolved_by: 'demo-admin-id'
    }
  ],
  alerts: [
    {
      id: 'ALT-101',
      shop_id: 'shop-2',
      message: 'Duplicate Biometric Transaction detected within 10 minutes',
      severity: 'high',
      created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'ALT-102',
      shop_id: 'shop-4',
      message: 'Stock level critical: Grain supplies below 15% threshold',
      severity: 'high',
      created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'ALT-103',
      shop_id: 'shop-1',
      message: 'Minor distribution variance between biometric log and POS dispatch',
      severity: 'medium',
      created_at: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
    }
  ],
  ratings: [
    {
      id: 'rat-1',
      shop_id: 'shop-1',
      user_id: 'demo-user-beneficiary',
      rating: 5,
      comment: 'Very polite staff and fast electronic weighing.',
      created_at: new Date().toISOString()
    },
    {
      id: 'rat-2',
      shop_id: 'shop-2',
      user_id: 'demo-user-beneficiary',
      rating: 3,
      comment: 'Shop was closed before the designated working hours.',
      created_at: new Date().toISOString()
    }
  ]
};

// Safe storage access with fallback
function getStore(): typeof initialData {
  if (typeof window === 'undefined') return initialData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(raw);
  } catch (e) {
    return initialData;
  }
}

function saveStore(data: typeof initialData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

// Chatbot response generator
function getChatbotResponse(message: string): string {
  const q = message.toLowerCase();

  if (q.includes('entitlement') || q.includes('quota') || q.includes('balance') || q.includes('ration') || q.includes('राशन') || q.includes('कोटा')) {
    return 'Your monthly quota status for Card RC-MH-2024-98432:\n• Rice: 10 kg remaining (25 kg total)\n• Wheat: 8 kg remaining (20 kg total)\n• Sugar: 3 kg remaining (5 kg total)\n\n(इस महीने आपके पास 10 किग्रा चावल, 8 किग्रा गेहूं और 3 किग्रा चीनी शेष है।)';
  }

  if (q.includes('complaint') || q.includes('grievance') || q.includes('report') || q.includes('fraud') || q.includes('missing') || q.includes('शिकायत')) {
    return 'You can file a complaint anytime using the Complaints section or the "Report Missing" button on your Dashboard. All grievances receive an automated reference ID and are inspected by the Food & Civil Supplies vigilance officer within 48 hours.';
  }

  if (q.includes('shop') || q.includes('timing') || q.includes('time') || q.includes('fps') || q.includes('dealer') || q.includes('दुकान') || q.includes('समय')) {
    return 'Your assigned Fair Price Shop (FPS Shop #234 at Mumbai Central) is open Monday to Saturday from 9:00 AM to 6:00 PM. Contact: +91 98201 12345. Biometric e-POS weighing is active.';
  }

  if (q.includes('aadhaar') || q.includes('otp') || q.includes('biometric') || q.includes('आधार')) {
    return 'Ration distribution uses Aadhaar-authenticated e-POS machines. If biometric verification fails, you can use OTP authentication sent to your registered mobile number.';
  }

  if (q.includes('card') || q.includes('download') || q.includes('कार्ड')) {
    return 'You can view and download your Digital Ration Card with a verified QR code directly under the "Digital Ration Card" section on your Dashboard.';
  }

  return 'Hello! I am your Ration Care AI Assistant. You can ask me about your monthly ration entitlements, shop timings, stock availability, biometric authentication, or filing a grievance. (नमस्ते! आप मुझसे राशन कोटा, दुकान के समय, या शिकायत दर्ज करने के बारे में पूछ सकते हैं।)';
}

// Fluent query builder for Supabase .from() emulation
class MockQueryBuilder {
  private tableName: string;
  private filters: Array<(item: any) => boolean> = [];
  private sortFn: ((a: any, b: any) => number) | null = null;
  private limitCount: number | null = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(_columns = '*') {
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push((item) => item[field] === value);
    return this;
  }

  order(field: string, options: { ascending?: boolean } = { ascending: true }) {
    this.sortFn = (a, b) => {
      const valA = a[field];
      const valB = b[field];
      if (valA < valB) return options.ascending ? -1 : 1;
      if (valA > valB) return options.ascending ? 1 : -1;
      return 0;
    };
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  private execute(): any[] {
    const store = getStore();
    let data: any[] = [];

    if (this.tableName === 'shops') {
      data = [...store.shops];
    } else if (this.tableName === 'complaints') {
      data = [...store.complaints];
    } else if (this.tableName === 'alerts') {
      data = [...store.alerts];
    } else if (this.tableName === 'fps_ratings') {
      data = [...store.ratings];
    } else if (this.tableName === 'transactions') {
      data = [...store.transactions];
    } else if (this.tableName === 'household_members') {
      data = [...store.householdMembers];
    } else if (this.tableName === 'profiles') {
      data = [store.profile];
    } else if (this.tableName === 'user_roles') {
      data = [
        {
          id: 'role-1',
          user_id: store.currentUser.id,
          role: store.currentUser.role,
          created_at: new Date().toISOString()
        }
      ];
    }

    for (const filter of this.filters) {
      data = data.filter(filter);
    }

    if (this.sortFn) {
      data.sort(this.sortFn);
    }

    if (this.limitCount !== null) {
      data = data.slice(0, this.limitCount);
    }

    return data;
  }

  async single() {
    const res = this.execute();
    return { data: res[0] || null, error: res[0] ? null : { message: 'Row not found' } };
  }

  async maybeSingle() {
    const res = this.execute();
    return { data: res[0] || null, error: null };
  }

  then(resolve: (val: { data: any[]; error: any }) => any, reject?: (err: any) => any) {
    try {
      const res = this.execute();
      return Promise.resolve(resolve({ data: res, error: null }));
    } catch (e) {
      if (reject) return Promise.reject(reject(e));
      return Promise.resolve(resolve({ data: [], error: e }));
    }
  }

  async insert(rowOrRows: any) {
    const store = getStore();
    const rows = Array.isArray(rowOrRows) ? rowOrRows : [rowOrRows];
    for (const row of rows) {
      const newRow = {
        id: row.id || `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
        created_at: new Date().toISOString(),
        ...row
      };
      if (this.tableName === 'complaints') {
        store.complaints.unshift(newRow);
      } else if (this.tableName === 'fps_ratings') {
        store.ratings.unshift(newRow);
      }
    }
    saveStore(store);
    return { data: rows, error: null };
  }

  async upsert(row: any) {
    const store = getStore();
    if (this.tableName === 'fps_ratings') {
      const existingIdx = store.ratings.findIndex(
        (r) => r.shop_id === row.shop_id && r.user_id === row.user_id
      );
      if (existingIdx >= 0) {
        store.ratings[existingIdx] = { ...store.ratings[existingIdx], ...row };
      } else {
        store.ratings.push({
          id: `rat-${Date.now()}`,
          created_at: new Date().toISOString(),
          ...row
        });
      }
      saveStore(store);
    }
    return { data: [row], error: null };
  }

  async update(values: any) {
    const store = getStore();
    if (this.tableName === 'complaints') {
      store.complaints = store.complaints.map((c) => {
        if (this.filters.every((f) => f(c))) {
          return { ...c, ...values };
        }
        return c;
      });
      saveStore(store);
    }
    return { data: values, error: null };
  }
}

// Complete mock client matching Supabase API
export const supabase = {
  auth: {
    async signInWithPassword({ email, password }: { email: string; password?: string }) {
      const store = getStore();
      const isAdmin = email.toLowerCase().includes('admin');
      store.currentUser = {
        id: isAdmin ? 'demo-user-admin' : 'demo-user-beneficiary',
        email,
        name: isAdmin ? 'District Ration Officer' : 'Sunita Devi',
        role: isAdmin ? 'admin' : 'beneficiary'
      };
      saveStore(store);

      return {
        data: {
          user: {
            id: store.currentUser.id,
            email: store.currentUser.email
          },
          session: {
            access_token: 'demo-token-12345',
            user: store.currentUser
          }
        },
        error: null
      };
    },

    async signUp({ email, options }: { email: string; password?: string; options?: any }) {
      const store = getStore();
      const name = options?.data?.name || 'Registered Beneficiary';
      const aadhaar = options?.data?.aadhaar || 'XXXXXXXX4829';
      const phone = options?.data?.phone || '9876543210';

      store.currentUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        role: 'beneficiary'
      };
      store.profile = {
        id: store.currentUser.id,
        name,
        aadhaar,
        phone,
        ration_card_number: `RC-MH-${Math.floor(10000 + Math.random() * 90000)}`,
        card_type: 'Priority Household (PHH)',
        issue_date: new Date().toISOString().split('T')[0]
      };
      saveStore(store);

      return {
        data: {
          user: {
            id: store.currentUser.id,
            email
          }
        },
        error: null
      };
    },

    async getUser() {
      const store = getStore();
      return {
        data: {
          user: {
            id: store.currentUser.id,
            email: store.currentUser.email
          }
        },
        error: null
      };
    },

    async signOut() {
      return { error: null };
    }
  },

  from(tableName: string) {
    return new MockQueryBuilder(tableName);
  },

  functions: {
    async invoke(functionName: string, options?: { body?: any }) {
      const store = getStore();

      switch (functionName) {
        case 'beneficiary-data':
          return {
            data: {
              entitlements: store.entitlements,
              transactions: store.transactions,
              profile: store.profile,
              householdMembers: store.householdMembers,
              historicalEntitlements: store.historicalEntitlements
            },
            error: null
          };

        case 'admin-shops':
          return {
            data: {
              shops: store.shops
            },
            error: null
          };

        case 'admin-alerts':
          return {
            data: {
              alerts: store.alerts
            },
            error: null
          };

        case 'submit-complaint': {
          const body = options?.body || {};
          const newComplaint = {
            id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
            user_id: store.currentUser.id,
            subject: body.subject || 'General Complaint',
            description: body.description || '',
            status: 'pending',
            image_url: null,
            created_at: new Date().toISOString(),
            resolved_at: null,
            resolved_by: null
          };
          store.complaints.unshift(newComplaint);
          saveStore(store);
          return {
            data: { complaint: newComplaint },
            error: null
          };
        }

        case 'resolve-complaint': {
          const complaintId = options?.body?.complaintId;
          store.complaints = store.complaints.map((c) =>
            c.id === complaintId
              ? { ...c, status: 'resolved', resolved_at: new Date().toISOString() }
              : c
          );
          saveStore(store);
          return {
            data: { success: true },
            error: null
          };
        }

        case 'chatbot': {
          const message = options?.body?.message || '';
          return {
            data: { response: getChatbotResponse(message) },
            error: null
          };
        }

        default:
          return { data: null, error: { message: `Function ${functionName} not found` } };
      }
    }
  }
} as any;
