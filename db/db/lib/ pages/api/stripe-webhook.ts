import { buffer } from "micro";
import Stripe from "stripe";
import { getOrderById, updateOrderStatus } from "@/db/queries";
import { shipOrder } from "@/lib/shipping";
import { notifyTelegram } from "@/lib/telegram";

// إعدادات API لتعطيل الـ Body Parser الافتراضي لأن سترب تحتاج البيانات بصيغتها الخام (Raw)
export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: any, res: any) {
  const sig = req.headers["stripe-signature"];
  const body = await buffer(req);
  let event;

  try {
    // التحقق من أن الطلب قادم فعلاً من Stripe وليس من شخص يحاول الاحتيال
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // عند نجاح عملية الدفع (Checkout Session Completed)
  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;
    
    // استخراج بيانات الطلب المخزنة في الـ Metadata
    const { orderId, playerId, itemId, provider } = session.metadata;

    // التأكد من وجود الطلب في قاعدة بياناتنا وأنه لم يكتمل مسبقاً
    const order = await getOrderById(Number(orderId));
    if (!order || order.status === "completed") {
      return res.json({ ok: true });
    }

    // تحديث حالة الطلب إلى "قيد المعالجة"
    await updateOrderStatus(order.id, "processing");

    try {
      // تنفيذ عملية الشحن الفورية عبر المزود (SmileOne أو Codashop)
      await shipOrder(provider, playerId, itemId);
      
      // تحديث الحالة إلى "تم بنجاح"
      await updateOrderStatus(order.id, "completed");

      // إرسال إشعار لك على تلجرام بنجاح العملية
      await notifyTelegram(
        `✅ تم شحن طلب جديد بنجاح!\n\n` +
        `👤 ID اللاعب: ${playerId}\n` +
        `💎 الكمية: ${order.gems}\n` +
        `💰 السعر: $${order.priceUSD / 100}\n` +
        `🚚 المزود: ${provider}`
      );
    } catch (error) {
      // في حال فشل الشحن (مشكلة في API المزود مثلاً)
      await updateOrderStatus(order.id, "failed");
      await notifyTelegram(`⚠️ فشل شحن طلب للاعب: ${playerId}\nيرجى مراجعته يدوياً.`);
    }
  }

  res.json({ received: true });
}
