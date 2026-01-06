import { db } from "./index"; 
import { eq } from "drizzle-orm"; 
import { packages, orders, wallets, coupons } from "./schema";

// جلب بيانات الحزمة (الباقة) عن طريق الرقم المعرف
export const getPackageById = (id: number) => 
  db.query.packages.findFirst({ where: eq(packages.id, id) });

// إنشاء طلب جديد في قاعدة البيانات
export const createOrder = (data: any) => 
  db.insert(orders).values(data).execute();

// جلب بيانات الطلب عن طريق الرقم المعرف
export const getOrderById = (id: number) => 
  db.query.orders.findFirst({ where: eq(orders.id, id) });

// تحديث حالة الطلب (مثلاً من pending إلى completed)
export const updateOrderStatus = (id: number, status: any) => 
  db.update(orders).set({ status }).where(eq(orders.id, id));

// جلب بيانات محفظة المستخدم
export const getWalletByUser = (userId: number) => 
  db.query.wallets.findFirst({ where: eq(wallets.userId, userId) });

// تحديث رصيد المحفظة
export const updateWalletBalance = (userId: number, balance: number) => 
  db.update(wallets).set({ balance }).where(eq(wallets.userId, userId));

// جلب بيانات كوبون الخصم عن طريق الكود
export const getCouponByCode = (code: string) => 
  db.query.coupons.findFirst({ where: eq(coupons.code, code) });
