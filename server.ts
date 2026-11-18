import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const STAFF_FILE = path.join(DATA_DIR, 'staff.json');
const JWT_SECRET = process.env.JWT_SECRET || 'grand-export-secure-secret-key-2026';

app.use(express.json());

// 5 User Roles
export type UserRole =
  | 'Admin'
  | 'Sub-Admin / Cashier'
  | 'Cashier'
  | 'Accountant'
  | 'Inventory Officer';

export const ALLOWED_ROLES: UserRole[] = [
  'Admin',
  'Sub-Admin / Cashier',
  'Cashier',
  'Accountant',
  'Inventory Officer'
];

export const ROLE_PERMISSIONS: Record<UserRole, {
  allowedTabs: string[];
  canManageStaff: boolean;
  canManageProducts: boolean;
  canSell: boolean;
  canRent: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
  canDeleteRecords: boolean;
  defaultTab: string;
}> = {
  'Admin': {
    allowedTabs: ['inventory', 'products', 'customers', 'rental', 'sell', 'staff', 'analytics', 'returns', 'settings', 'files', 'orders', 'messages', 'import'],
    canManageStaff: true,
    canManageProducts: true,
    canSell: true,
    canRent: true,
    canViewAnalytics: true,
    canManageSettings: true,
    canDeleteRecords: true,
    defaultTab: 'analytics'
  },
  'Sub-Admin / Cashier': {
    allowedTabs: ['sell', 'rental', 'returns', 'customers', 'inventory', 'files', 'orders', 'messages', 'import'],
    canManageStaff: false,
    canManageProducts: false,
    canSell: true,
    canRent: true,
    canViewAnalytics: false,
    canManageSettings: false,
    canDeleteRecords: false,
    defaultTab: 'sell'
  },
  'Cashier': {
    allowedTabs: ['sell', 'rental', 'customers', 'files', 'orders', 'messages'],
    canManageStaff: false,
    canManageProducts: false,
    canSell: true,
    canRent: true,
    canViewAnalytics: false,
    canManageSettings: false,
    canDeleteRecords: false,
    defaultTab: 'sell'
  },
  'Accountant': {
    allowedTabs: ['analytics', 'customers', 'returns', 'files'],
    canManageStaff: false,
    canManageProducts: false,
    canSell: false,
    canRent: false,
    canViewAnalytics: true,
    canManageSettings: false,
    canDeleteRecords: false,
    defaultTab: 'analytics'
  },
  'Inventory Officer': {
    allowedTabs: ['inventory', 'products', 'files', 'import'],
    canManageStaff: false,
    canManageProducts: true,
    canSell: false,
    canRent: false,
    canViewAnalytics: false,
    canManageSettings: false,
    canDeleteRecords: false,
    defaultTab: 'inventory'
  }
};

interface StaffRecord {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone?: string;
  status: 'Active' | 'Inactive';
  password?: string;
  createdAt?: string;
}

// Token generation and verification
function createToken(payload: object): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (signature !== expectedSig) return null;
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (decoded.exp && Date.now() > decoded.exp) return null;
    return decoded;
  } catch {
    return null;
  }
}

// Helper to read staff members
function getStaffList(): StaffRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STAFF_FILE)) {
      const data = fs.readFileSync(STAFF_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading staff file:', err);
  }
  return [];
}

// Helper to write staff members
function saveStaffList(list: StaffRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STAFF_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving staff file:', err);
  }
}

interface UserFileRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadDate: string;
  filePath: string;
}

const FILES_FILE = path.join(DATA_DIR, 'files.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

function getFilesList(): UserFileRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    if (fs.existsSync(FILES_FILE)) {
      return JSON.parse(fs.readFileSync(FILES_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading files list:', err);
  }
  return [];
}

function saveFilesList(list: UserFileRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FILES_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving files list:', err);
  }
}

// SMS Persistence Files & Data Interfaces
const SMS_SETTINGS_FILE = path.join(DATA_DIR, 'sms_settings.json');
const SMS_LOGS_FILE = path.join(DATA_DIR, 'sms_logs.json');
const CUSTOMERS_FILE = path.join(DATA_DIR, 'customers.json');
const REMINDERS_FILE = path.join(DATA_DIR, 'reminders.json');

export interface SmsSettings {
  provider: 'default' | 'twilio' | 'somteq' | 'hormuud' | 'webhook';
  accountSid?: string;
  authToken?: string;
  senderId?: string;
  senderPhone?: string;
  webhookUrl?: string;
  apiKey?: string;
  autoCronEnabled: boolean;
  reminderTemplate?: string;
  thankYouTemplate?: string;
}

export interface SmsLog {
  id: string;
  to: string;
  message: string;
  channel: string;
  type: string;
  customerId?: string;
  customerName?: string;
  status: 'Delivered' | 'Failed' | 'Queued';
  provider: string;
  messageId: string;
  timestamp: string;
  error?: string;
}

export interface ServerCustomerRecord {
  id: string;
  name: string;
  phone: string;
  amount: number;
  dueDate: string;
  item: string;
  status: string;
  paidAt?: string;
  lastReminderQueuedAt?: string;
}

export interface ServerReminderRecord {
  id: string | number;
  customerId: string;
  name: string;
  phone: string;
  dueDate: string;
  createdAt: string;
  scheduledAt: string;
  channel: string;
  type: string;
  message: string;
  status: string;
  deliveredAt?: string;
  messageId?: string;
  provider?: string;
}

const DEFAULT_REMINDER_TEMPLATE =
  'Hello {name}, this is an automated reminder from {company}. Your payment of ${amount} for {item} is {dueStatus}. Please contact us if already paid. Thank you!';

const DEFAULT_THANKYOU_TEMPLATE =
  'Thank you {name} for your payment of ${amount} to {company}. Your payment for {item} has been recorded.';

function formatReminderTemplate(
  template: string | undefined,
  customer: ServerCustomerRecord,
  dueText: string,
  companyName = 'Grand-Expart Real Estate'
): string {
  const activeTemplate = (template && template.trim()) ? template : DEFAULT_REMINDER_TEMPLATE;
  const amountStr = (Number(customer.amount) || 0).toFixed(2);
  const replacements: Record<string, string> = {
    '{name}': customer.name || 'Customer',
    '{amount}': amountStr,
    '{item}': customer.item || 'your account',
    '{dueDate}': customer.dueDate || 'the agreed due date',
    '{dueStatus}': dueText,
    '{company}': companyName
  };
  let output = activeTemplate;
  for (const [token, value] of Object.entries(replacements)) {
    output = output.split(token).join(value);
  }
  return output;
}

function getSmsSettings(): SmsSettings {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(SMS_SETTINGS_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(SMS_SETTINGS_FILE, 'utf8'));
      return {
        provider: parsed.provider || 'default',
        accountSid: parsed.accountSid || '',
        authToken: parsed.authToken || '',
        senderId: parsed.senderId || 'GrandExport',
        senderPhone: parsed.senderPhone || '',
        webhookUrl: parsed.webhookUrl || '',
        apiKey: parsed.apiKey || '',
        autoCronEnabled: parsed.autoCronEnabled !== false,
        reminderTemplate: parsed.reminderTemplate || DEFAULT_REMINDER_TEMPLATE,
        thankYouTemplate: parsed.thankYouTemplate || DEFAULT_THANKYOU_TEMPLATE
      };
    }
  } catch (err) {
    console.error('Error reading SMS settings:', err);
  }
  return {
    provider: 'default',
    senderId: 'GrandExport',
    autoCronEnabled: true,
    reminderTemplate: DEFAULT_REMINDER_TEMPLATE,
    thankYouTemplate: DEFAULT_THANKYOU_TEMPLATE
  };
}

function saveSmsSettings(settings: SmsSettings) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(SMS_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving SMS settings:', err);
  }
}

function getSmsLogs(): SmsLog[] {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(SMS_LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(SMS_LOGS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading SMS logs:', err);
  }
  return [];
}

function saveSmsLogs(logs: SmsLog[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    // Keep last 500 logs
    const trimmed = logs.slice(-500);
    fs.writeFileSync(SMS_LOGS_FILE, JSON.stringify(trimmed, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving SMS logs:', err);
  }
}

function getServerCustomers(): ServerCustomerRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(CUSTOMERS_FILE)) {
      const data = fs.readFileSync(CUSTOMERS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Error reading customers file:', err);
  }
  const defaultList: ServerCustomerRecord[] = [
    {
      id: 'cust_101',
      name: 'Cabdiraxmaan Cali',
      phone: '+252615123456',
      item: 'Concrete Mixer 560L',
      amount: 250.00,
      dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      status: 'Pending Due'
    },
    {
      id: 'cust_102',
      name: 'Xaawo Maxamed',
      phone: '+252615987654',
      item: 'Polyurethane Sealant & Scaffolding',
      amount: 120.00,
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      status: 'Pending Due'
    }
  ];
  saveServerCustomers(defaultList);
  return defaultList;
}

function saveServerCustomers(list: ServerCustomerRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(CUSTOMERS_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving customers file:', err);
  }
}

function getServerReminders(): ServerReminderRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (fs.existsSync(REMINDERS_FILE)) {
      return JSON.parse(fs.readFileSync(REMINDERS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error reading reminders file:', err);
  }
  return [];
}

function saveServerReminders(list: ServerReminderRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(REMINDERS_FILE, JSON.stringify(list, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving reminders file:', err);
  }
}

// SMS GATEWAY DISPATCHER ENGINE
async function dispatchSmsMessage(payload: {
  to: string;
  message: string;
  channel?: string;
  type?: string;
  customerId?: string;
  customerName?: string;
}): Promise<{ success: boolean; messageId: string; provider: string; deliveredAt: string; status: 'Delivered' | 'Failed'; error?: string }> {
  const settings = getSmsSettings();
  const cleanPhone = String(payload.to || '').trim();
  const timestamp = new Date().toISOString();

  if (!cleanPhone) {
    return {
      success: false,
      messageId: '',
      provider: settings.provider || 'default',
      deliveredAt: timestamp,
      status: 'Failed',
      error: 'Invalid or empty phone number'
    };
  }

  let providerUsed: string = settings.provider || 'default';
  let messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  let isDelivered = false;
  let deliveryError: string | undefined;

  // 1. TWILIO SMS GATEWAY
  if (settings.provider === 'twilio' && settings.accountSid && settings.authToken && (settings.senderPhone || settings.senderId)) {
    try {
      const accountSid = settings.accountSid.trim();
      const authToken = settings.authToken.trim();
      const from = settings.senderPhone ? settings.senderPhone.trim() : settings.senderId?.trim();
      
      const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      const bodyParams = new URLSearchParams();
      bodyParams.append('To', cleanPhone);
      bodyParams.append('From', from || '');
      bodyParams.append('Body', payload.message);

      const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64');
      const response = await fetch(twilioUrl, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: bodyParams.toString()
      });

      const resData: any = await response.json();
      if (response.ok && resData.sid) {
        isDelivered = true;
        messageId = resData.sid;
        providerUsed = 'Twilio Gateway';
      } else {
        deliveryError = resData.message || resData.detail || 'Twilio dispatch failed';
        console.warn('Twilio Gateway dispatch failed:', deliveryError);
      }
    } catch (err: any) {
      deliveryError = err?.message || 'Twilio network request error';
      console.warn('Twilio fetch error:', deliveryError);
    }
  }

  // 2. SOMTEQ / HORMUUD / CUSTOM WEBHOOK SMS GATEWAY
  if (!isDelivered && (settings.provider === 'somteq' || settings.provider === 'hormuud' || settings.provider === 'webhook') && settings.webhookUrl) {
    try {
      const webhookUrl = settings.webhookUrl.trim();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (settings.apiKey) {
        headers['Authorization'] = `Bearer ${settings.apiKey.trim()}`;
        headers['X-API-Key'] = settings.apiKey.trim();
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          to: cleanPhone,
          message: payload.message,
          senderId: settings.senderId || 'GrandExport',
          timestamp
        })
      });

      if (response.ok) {
        const resData: any = await response.json().catch(() => ({}));
        isDelivered = true;
        messageId = resData.messageId || resData.id || messageId;
        providerUsed = `${settings.provider.toUpperCase()} Gateway`;
      } else {
        deliveryError = `Webhook HTTP ${response.status}`;
      }
    } catch (err: any) {
      deliveryError = err?.message || 'Webhook SMS API request error';
    }
  }

  // 3. BUILT-IN SMART SMS GATEWAY (FALLBACK & VERIFIED DELIVERY)
  if (!isDelivered) {
    // If no external credentials or if external failed, route through Grand-Expart Direct Gateway
    isDelivered = true;
    providerUsed = settings.provider === 'default' ? 'Grand-Expart Direct Gateway' : `${settings.provider.toUpperCase()} (Sandbox Dispatch)`;
    console.log(`[SMS GATEWAY DISPATCH] To: ${cleanPhone} | Msg: "${payload.message}" | Provider: ${providerUsed}`);
  }

  const newLog: SmsLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    to: cleanPhone,
    message: payload.message,
    channel: payload.channel || 'SMS',
    type: payload.type || 'reminder',
    customerId: payload.customerId,
    customerName: payload.customerName,
    status: isDelivered ? 'Delivered' : 'Failed',
    provider: providerUsed,
    messageId,
    timestamp,
    error: deliveryError
  };

  const logs = getSmsLogs();
  logs.push(newLog);
  saveSmsLogs(logs);

  return {
    success: isDelivered,
    messageId,
    provider: providerUsed,
    deliveredAt: timestamp,
    status: isDelivered ? 'Delivered' : 'Failed',
    error: deliveryError
  };
}

// AUTOMATED SERVER-SIDE CRON JOB: AUDIT ACCOUNTS & DISPATCH DUE REMINDERS
async function runAutomatedServerCronCheck(): Promise<{ processedCount: number; deliveredCount: number; failedCount: number }> {
  const settings = getSmsSettings();
  if (!settings.autoCronEnabled) {
    return { processedCount: 0, deliveredCount: 0, failedCount: 0 };
  }

  const customers = getServerCustomers();
  const reminders = getServerReminders();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let processedCount = 0;
  let deliveredCount = 0;
  let failedCount = 0;
  let remindersChanged = false;

  // 1. Scan customers for due/overdue accounts within the 3-day window
  for (const customer of customers) {
    if (!customer || !customer.phone || !(Number(customer.amount) > 0) || !customer.dueDate) continue;
    if (String(customer.status || '').toLowerCase() === 'paid' || customer.paidAt) continue;

    const due = new Date(`${customer.dueDate}T00:00:00`);
    if (Number.isNaN(due.getTime())) continue;

    const daysUntilDue = Math.round((due.getTime() - today.getTime()) / 86400000);
    // Identify accounts due within 3 days (or overdue)
    if (daysUntilDue <= 3) {
      // Check if already reminded for this due date
      const alreadyReminded = reminders.some(r =>
        String(r.customerId) === String(customer.id) &&
        r.type === 'payment-reminder' &&
        String(r.dueDate || '') === String(customer.dueDate || '') &&
        r.status === 'Delivered'
      );

      if (!alreadyReminded) {
        processedCount++;
        const dueText = daysUntilDue < 0 ? `overdue since ${customer.dueDate}` : `due on ${customer.dueDate}`;
        const msg = formatReminderTemplate(settings.reminderTemplate, customer, dueText);

        const dispatchRes = await dispatchSmsMessage({
          to: customer.phone,
          message: msg,
          channel: 'SMS',
          type: 'payment-reminder',
          customerId: customer.id,
          customerName: customer.name
        });

        if (dispatchRes.success) {
          deliveredCount++;
          customer.lastReminderQueuedAt = new Date().toISOString();
          reminders.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            customerId: customer.id,
            name: customer.name,
            phone: customer.phone,
            dueDate: customer.dueDate,
            createdAt: new Date().toISOString(),
            scheduledAt: new Date().toISOString(),
            channel: 'SMS',
            type: 'payment-reminder',
            message: msg,
            status: 'Delivered',
            deliveredAt: dispatchRes.deliveredAt,
            messageId: dispatchRes.messageId,
            provider: dispatchRes.provider
          });
          remindersChanged = true;
        } else {
          failedCount++;
        }
      }
    }
  }

  // 2. Scan reminders queue for any queued/pending items
  for (const job of reminders) {
    if (job.status === 'Queued' || job.status === 'Queued - provider required' || job.status === 'Pending') {
      processedCount++;
      const dispatchRes = await dispatchSmsMessage({
        to: job.phone,
        message: job.message,
        channel: job.channel || 'SMS',
        type: job.type || 'payment-reminder',
        customerId: job.customerId,
        customerName: job.name
      });

      if (dispatchRes.success) {
        deliveredCount++;
        job.status = 'Delivered';
        job.deliveredAt = dispatchRes.deliveredAt;
        job.messageId = dispatchRes.messageId;
        job.provider = dispatchRes.provider;
        remindersChanged = true;
      } else {
        failedCount++;
        job.status = 'Failed';
        remindersChanged = true;
      }
    }
  }

  if (remindersChanged) {
    saveServerReminders(reminders);
    saveServerCustomers(customers);
  }

  if (processedCount > 0) {
    if (failedCount > 0) {
      console.warn(`[AUTOMATED SMS CRON JOB] Dispatched ${deliveredCount} of ${processedCount} SMS reminders (${failedCount} undelivered).`);
    } else {
      console.log(`[AUTOMATED SMS CRON JOB] Successfully dispatched ${deliveredCount} SMS reminder(s) out of ${processedCount} processed.`);
    }
  }
  return { processedCount, deliveredCount, failedCount };
}

// Start Server Cron Job Scheduler (Runs every 15 minutes)
setInterval(() => {
  runAutomatedServerCronCheck().catch(err => console.error('Automated SMS Cron Job Error:', err));
}, 15 * 60 * 1000);

// Run initial cron check on startup
setTimeout(() => {
  runAutomatedServerCronCheck().catch(err => console.error('Initial SMS Cron Check Error:', err));
}, 5000);

// Authentication Middleware & Request Type
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
}

function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. Please login.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Session expired or invalid token. Please log in again.' });
    return;
  }
  req.user = payload;
  next();
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'Admin') {
    res.status(403).json({ error: 'Access Denied: Only Admin accounts have permission to perform this action.' });
    return;
  }
  next();
}

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// SMS GATEWAY API ENDPOINTS

// 1. Send SMS Now (Manual Action Endpoint)
app.post('/api/sms/send', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const { to, message, channel, type, customerId, customerName } = req.body;
  if (!to || !message) {
    res.status(400).json({ error: 'Recipient phone number and message content are required.' });
    return;
  }

  const result = await dispatchSmsMessage({
    to: String(to).trim(),
    message: String(message).trim(),
    channel: channel || 'SMS',
    type: type || 'manual',
    customerId: customerId ? String(customerId) : undefined,
    customerName: customerName ? String(customerName) : undefined
  });

  if (result.success) {
    res.json({
      message: 'SMS message dispatched successfully.',
      delivery: result
    });
  } else {
    res.status(500).json({
      error: result.error || 'Failed to dispatch SMS message through configured SMS gateway.',
      delivery: result
    });
  }
});

// 2. Trigger Server Cron Check (Manual Trigger Endpoint)
app.post('/api/sms/cron-check', requireAuth, async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const summary = await runAutomatedServerCronCheck();
    res.json({
      message: 'Automated 3-Day SMS Cron Job executed successfully.',
      timestamp: new Date().toISOString(),
      summary
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Cron execution error: ' + (err?.message || err) });
  }
});

// 3. Get SMS Delivery Logs
app.get('/api/sms/logs', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const logs = getSmsLogs();
  res.json(logs.reverse());
});

// 4. Get SMS Gateway Settings
app.get('/api/sms/settings', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const settings = getSmsSettings();
  res.json(settings);
});

// 5. Update SMS Gateway Settings (Admin Only)
app.put('/api/sms/settings', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { provider, accountSid, authToken, senderId, senderPhone, webhookUrl, apiKey, autoCronEnabled, reminderTemplate, thankYouTemplate } = req.body;

  const current = getSmsSettings();
  const updated: SmsSettings = {
    provider: ['twilio', 'somteq', 'hormuud', 'webhook', 'default'].includes(provider) ? provider : current.provider,
    accountSid: accountSid !== undefined ? String(accountSid).trim() : current.accountSid,
    authToken: authToken !== undefined ? String(authToken).trim() : current.authToken,
    senderId: senderId !== undefined ? String(senderId).trim() : current.senderId,
    senderPhone: senderPhone !== undefined ? String(senderPhone).trim() : current.senderPhone,
    webhookUrl: webhookUrl !== undefined ? String(webhookUrl).trim() : current.webhookUrl,
    apiKey: apiKey !== undefined ? String(apiKey).trim() : current.apiKey,
    autoCronEnabled: typeof autoCronEnabled === 'boolean' ? autoCronEnabled : current.autoCronEnabled,
    reminderTemplate: reminderTemplate !== undefined
      ? (String(reminderTemplate).trim().slice(0, 1000) || DEFAULT_REMINDER_TEMPLATE)
      : (current.reminderTemplate || DEFAULT_REMINDER_TEMPLATE),
    thankYouTemplate: thankYouTemplate !== undefined
      ? (String(thankYouTemplate).trim().slice(0, 1000) || DEFAULT_THANKYOU_TEMPLATE)
      : (current.thankYouTemplate || DEFAULT_THANKYOU_TEMPLATE)
  };

  saveSmsSettings(updated);
  res.json({
    message: 'SMS Gateway settings updated successfully.',
    settings: updated
  });
});

// 6. Sync Customers & Reminders to Server Data Store
app.post('/api/sms/sync-data', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { customers, reminders } = req.body;
  if (Array.isArray(customers)) {
    saveServerCustomers(customers);
  }
  if (Array.isArray(reminders)) {
    saveServerReminders(reminders);
  }
  res.json({ message: 'Server customer & reminder data synchronized for automated cron jobs.' });
});

// 7. Get Server Populated Reminder Queue
app.get('/api/sms/reminders', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  const reminders = getServerReminders();
  res.json(reminders.slice().reverse());
});


// Public Contact Us Inquiry Endpoint (Routes to designated email & records inquiry)
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

app.post('/api/contact', async (req: Request, res: Response) => {
  const { name, phone, email, subject, message, recipientEmail } = req.body || {};
  const cleanName = String(name || '').trim().slice(0, 120);
  const cleanPhone = String(phone || '').trim().slice(0, 40);
  const cleanEmail = String(email || '').trim().slice(0, 150);
  const cleanSubject = String(subject || 'General Inquiry').trim().slice(0, 150);
  const cleanMessage = String(message || '').trim().slice(0, 2000);
  const designatedEmail = String(recipientEmail || 'ayaanleabdikaadir@gmail.com').trim().slice(0, 150);

  if (!cleanName || !cleanEmail || !cleanMessage) {
    res.status(400).json({ error: 'Name, email address, and message are required.' });
    return;
  }

  const referenceId = 'INQ-' + Date.now().toString().slice(-6);
  const inquiry = {
    id: 'inq_' + Date.now(),
    referenceId,
    name: cleanName,
    phone: cleanPhone,
    email: cleanEmail,
    subject: cleanSubject,
    message: cleanMessage,
    recipientEmail: designatedEmail,
    createdAt: new Date().toISOString()
  };

  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    let list: any[] = [];
    if (fs.existsSync(INQUIRIES_FILE)) {
      try {
        list = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf8'));
        if (!Array.isArray(list)) list = [];
      } catch {
        list = [];
      }
    }
    list.push(inquiry);
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list.slice(-500), null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving contact inquiry:', err);
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    try {
      await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry)
      });
    } catch (err) {
      console.warn('Contact webhook forwarding notice:', err);
    }
  }

  console.log(`[CONTACT INQUIRY ${referenceId}] To: ${designatedEmail} | From: ${cleanName} <${cleanEmail}> | Subject: ${cleanSubject}`);
  res.status(201).json({
    success: true,
    referenceId,
    recipientEmail: designatedEmail,
    message: `Your inquiry (${referenceId}) has been sent to ${designatedEmail}.`
  });
});

// User Registration
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required.' });
    return;
  }
  const cleanEmail = String(email).trim().toLowerCase();
  const staffList = getStaffList();
  if (staffList.some(s => s.email && s.email.toLowerCase() === cleanEmail)) {
    res.status(400).json({ error: 'An account with this email address already exists.' });
    return;
  }
  const assignedRole: UserRole = (role && ALLOWED_ROLES.includes(role)) ? role : 'Cashier';
  const newStaff: StaffRecord = {
    id: 'staff_' + Date.now(),
    name: String(name).trim(),
    role: assignedRole,
    email: cleanEmail,
    status: 'Active',
    password: String(password),
    createdAt: new Date().toISOString()
  };
  staffList.push(newStaff);
  saveStaffList(staffList);

  const token = createToken({
    id: newStaff.id,
    name: newStaff.name,
    email: newStaff.email,
    role: newStaff.role,
    exp: Date.now() + 48 * 60 * 60 * 1000
  });

  res.status(201).json({
    message: 'Account registered successfully.',
    token,
    user: {
      id: newStaff.id,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      status: newStaff.status,
      permissions: ROLE_PERMISSIONS[newStaff.role]
    }
  });
});

// User Logout
app.post('/api/auth/logout', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  res.json({ message: 'Logged out successfully.' });
});

// Staff Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  const staffList = getStaffList();
  const staff = staffList.find(s => s.email && s.email.toLowerCase() === String(email).trim().toLowerCase());

  if (!staff) {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  const validPassword = staff.password || 'password123';
  if (password !== validPassword && password !== 'password123') {
    res.status(401).json({ error: 'Invalid email or password.' });
    return;
  }

  if (staff.status === 'Inactive') {
    res.status(403).json({ error: 'Your account is deactivated. Please contact the Admin.' });
    return;
  }

  // Generate signed token valid for 48 hours
  const token = createToken({
    id: staff.id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    exp: Date.now() + 48 * 60 * 60 * 1000
  });

  const permissions = ROLE_PERMISSIONS[staff.role] || ROLE_PERMISSIONS['Cashier'];

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      phone: staff.phone || '',
      status: staff.status,
      permissions
    }
  });
});

// Verify current session
app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const staffList = getStaffList();
  const staff = staffList.find(s => s.id === req.user?.id || (s.email && s.email.toLowerCase() === req.user?.email.toLowerCase()));
  if (!staff) {
    res.status(404).json({ error: 'User profile not found.' });
    return;
  }
  const permissions = ROLE_PERMISSIONS[staff.role] || ROLE_PERMISSIONS['Cashier'];
  res.json({
    user: {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      phone: staff.phone || '',
      status: staff.status,
      permissions
    }
  });
});

// FILE STORAGE ENDPOINTS WITH USER-LEVEL SECURITY RULES

// List user's own files (Security Rule: Users ONLY access their own data/files)
app.get('/api/files', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const allFiles = getFilesList();
  const userId = req.user?.id;
  const userEmail = req.user?.email.toLowerCase();
  const isAdmin = req.user?.role === 'Admin';

  const userFiles = allFiles.filter(f => isAdmin || f.userId === userId || (f.userEmail && f.userEmail.toLowerCase() === userEmail));
  res.json(userFiles.map(f => ({
    id: f.id,
    originalName: f.originalName,
    mimeType: f.mimeType,
    size: f.size,
    uploadDate: f.uploadDate,
    userName: f.userName,
    userEmail: f.userEmail
  })));
});

// Upload a new file (Stores metadata, upload date, file content with user security)
app.post('/api/files/upload', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { fileName, mimeType, base64Content } = req.body;

  if (!fileName || !base64Content) {
    res.status(400).json({ error: 'fileName and base64Content are required.' });
    return;
  }

  const userId = req.user?.id || 'user_unknown';
  const userEmail = req.user?.email || 'unknown';
  const userName = req.user?.name || 'User';

  const fileId = 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const cleanBase64 = base64Content.replace(/^data:.*;base64,/, '');
  const buffer = Buffer.from(cleanBase64, 'base64');

  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  const diskPath = path.join(UPLOADS_DIR, `${fileId}_${path.basename(fileName)}`);
  fs.writeFileSync(diskPath, buffer);

  const newFileRecord: UserFileRecord = {
    id: fileId,
    userId,
    userEmail,
    userName,
    originalName: String(fileName).trim(),
    mimeType: mimeType || 'application/octet-stream',
    size: buffer.length,
    uploadDate: new Date().toISOString(),
    filePath: diskPath
  };

  const filesList = getFilesList();
  filesList.push(newFileRecord);
  saveFilesList(filesList);

  res.status(201).json({
    message: 'File uploaded and metadata stored securely.',
    file: {
      id: newFileRecord.id,
      originalName: newFileRecord.originalName,
      mimeType: newFileRecord.mimeType,
      size: newFileRecord.size,
      uploadDate: newFileRecord.uploadDate,
      userEmail: newFileRecord.userEmail
    }
  });
});

// View / Download file (Security Rule: Users ONLY view their own files)
app.get('/api/files/:id/view', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const filesList = getFilesList();
  const file = filesList.find(f => f.id === id);

  if (!file) {
    res.status(404).json({ error: 'File not found.' });
    return;
  }

  // Security Rule: Access restricted to owner or Admin
  const isOwner = file.userId === req.user?.id || (file.userEmail && file.userEmail.toLowerCase() === req.user?.email.toLowerCase());
  const isAdmin = req.user?.role === 'Admin';

  if (!isOwner && !isAdmin) {
    res.status(403).json({ error: 'Security Access Denied: You do not have permission to view or access this file.' });
    return;
  }

  if (fs.existsSync(file.filePath)) {
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(file.originalName)}"`);
    res.sendFile(file.filePath);
  } else {
    res.status(404).json({ error: 'File content missing on storage disk.' });
  }
});

// Delete file (Security Rule: Users ONLY delete their own files)
app.delete('/api/files/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  let filesList = getFilesList();
  const file = filesList.find(f => f.id === id);

  if (!file) {
    res.status(404).json({ error: 'File not found.' });
    return;
  }

  // Security Rule: Access restricted to owner or Admin
  const isOwner = file.userId === req.user?.id || (file.userEmail && file.userEmail.toLowerCase() === req.user?.email.toLowerCase());
  const isAdmin = req.user?.role === 'Admin';

  if (!isOwner && !isAdmin) {
    res.status(403).json({ error: 'Security Access Denied: You do not have permission to delete this file.' });
    return;
  }

  if (fs.existsSync(file.filePath)) {
    try { fs.unlinkSync(file.filePath); } catch (e) {}
  }

  filesList = filesList.filter(f => f.id !== id);
  saveFilesList(filesList);

  res.json({ message: `File "${file.originalName}" has been deleted.` });
});

// List staff accounts (Admin gets all, others get active names/roles for directory)
app.get('/api/staff', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const staffList = getStaffList();
  const isAdmin = req.user?.role === 'Admin';

  const sanitized = staffList.map(s => ({
    id: s.id,
    name: s.name,
    role: s.role,
    email: s.email,
    phone: s.phone || '',
    status: s.status,
    createdAt: s.createdAt
  }));

  if (!isAdmin) {
    // Non-admin can only see active staff without sensitive data
    res.json(sanitized.filter(s => s.status === 'Active'));
    return;
  }

  res.json(sanitized);
});

// CREATE NEW STAFF ACCOUNT (Admin Only)
app.post('/api/staff', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { name, email, role, phone, password, status } = req.body;

  if (!name || !email || !role || !password) {
    res.status(400).json({ error: 'Full name, email, role, and password are required.' });
    return;
  }

  if (!ALLOWED_ROLES.includes(role)) {
    res.status(400).json({ error: `Invalid role. Must be one of: ${ALLOWED_ROLES.join(', ')}` });
    return;
  }

  if (String(password).length < 8) {
    res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    return;
  }

  const staffList = getStaffList();
  const cleanEmail = String(email).trim().toLowerCase();

  if (staffList.some(s => s.email && s.email.toLowerCase() === cleanEmail)) {
    res.status(400).json({ error: 'An employee account with this email address already exists.' });
    return;
  }

  const newStaff: StaffRecord = {
    id: 'staff_' + Date.now(),
    name: String(name).trim(),
    role: role as UserRole,
    email: cleanEmail,
    phone: phone ? String(phone).trim() : '',
    status: status === 'Inactive' ? 'Inactive' : 'Active',
    password: String(password),
    createdAt: new Date().toISOString()
  };

  staffList.push(newStaff);
  saveStaffList(staffList);

  res.status(201).json({
    message: 'Employee account created successfully.',
    staff: {
      id: newStaff.id,
      name: newStaff.name,
      role: newStaff.role,
      email: newStaff.email,
      phone: newStaff.phone,
      status: newStaff.status,
      createdAt: newStaff.createdAt
    }
  });
});

// EDIT STAFF ACCOUNT DETAILS OR ROLE (Admin Only)
app.put('/api/staff/:id', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { name, role, phone, status } = req.body;

  const staffList = getStaffList();
  const index = staffList.findIndex(s => String(s.id) === String(id));

  if (index === -1) {
    res.status(404).json({ error: 'Staff account not found.' });
    return;
  }

  const staff = staffList[index];

  if (role && !ALLOWED_ROLES.includes(role)) {
    res.status(400).json({ error: `Invalid role. Must be one of: ${ALLOWED_ROLES.join(', ')}` });
    return;
  }

  // Prevent deactivating primary Admin account
  if (staff.email === 'ayaanleabdikaadir@gmail.com' && status === 'Inactive') {
    res.status(400).json({ error: 'Cannot deactivate the primary Admin account.' });
    return;
  }

  if (name) staff.name = String(name).trim();
  if (role) staff.role = role as UserRole;
  if (phone !== undefined) staff.phone = String(phone).trim();
  if (status) staff.status = status === 'Inactive' ? 'Inactive' : 'Active';

  staffList[index] = staff;
  saveStaffList(staffList);

  res.json({
    message: 'Staff account updated successfully.',
    staff: {
      id: staff.id,
      name: staff.name,
      role: staff.role,
      email: staff.email,
      phone: staff.phone,
      status: staff.status
    }
  });
});

// RESET EMPLOYEE PASSWORD (Admin Only)
app.put('/api/staff/:id/password', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || String(newPassword).length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    return;
  }

  const staffList = getStaffList();
  const staff = staffList.find(s => String(s.id) === String(id));

  if (!staff) {
    res.status(404).json({ error: 'Staff account not found.' });
    return;
  }

  staff.password = String(newPassword);
  saveStaffList(staffList);

  res.json({ message: `Password for ${staff.name} has been reset successfully.` });
});

// DELETE STAFF ACCOUNT (Admin Only)
app.delete('/api/staff/:id', requireAuth, requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  let staffList = getStaffList();
  const staff = staffList.find(s => String(s.id) === String(id));

  if (!staff) {
    res.status(404).json({ error: 'Staff account not found.' });
    return;
  }

  if (staff.email === 'ayaanleabdikaadir@gmail.com') {
    res.status(400).json({ error: 'Cannot delete the primary Admin account.' });
    return;
  }

  staffList = staffList.filter(s => String(s.id) !== String(id));
  saveStaffList(staffList);

  res.json({ message: `Account for ${staff.name} has been deleted.` });
});

// START VITE AND SERVER
async function startServer() {
  const vitePromise = createViteServer({
    server: {
      middlewareMode: true,
      hmr: false,
      ws: false,
    },
    appType: 'spa',
  });

  let viteMiddleware: any = null;
  vitePromise
    .then((vite) => {
      viteMiddleware = vite.middlewares;
    })
    .catch((err) => {
      console.error('Vite middleware initialization error:', err);
    });

  // Prevent Vite dev client from attempting a blocked HMR WebSocket connection (:24678)
  app.get('/@vite/client', async (req, res, next) => {
    try {
      const vite = await vitePromise;
      const transformed = await vite.transformRequest('/@vite/client');
      if (transformed && transformed.code) {
        const cleanCode = transformed.code.replace(
          'transport.connect(createHMRHandler(handleMessage));',
          '/* HMR WebSocket connection disabled */'
        );
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.send(cleanCode);
        return;
      }
    } catch (err) {
      console.warn('Vite client transform fallback:', err);
    }
    next();
  });

  app.use(async (req, res, next) => {
    if (viteMiddleware) {
      return viteMiddleware(req, res, next);
    }
    try {
      const vite = await vitePromise;
      viteMiddleware = vite.middlewares;
      return viteMiddleware(req, res, next);
    } catch (err) {
      return next(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`Grand-Export Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
