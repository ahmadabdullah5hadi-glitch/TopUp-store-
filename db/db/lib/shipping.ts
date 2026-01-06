import axios from "axios"; 

export async function shipOrder(provider: "smileone" | "codashop", playerId: string, itemId: string) {
  // البرمجة الخاصة بمزود الخدمة SmileOne
  if (provider === "smileone") {
    const res = await axios.post("https://www.smile.one/api/v2/topup", {
      uid: playerId,
      product_id: itemId
    }, {
      headers: { Authorization: `Bearer ${process.env.SMILEONE_KEY}` },
      timeout: 10000
    });
    
    if (res.data.code !== 200) throw new Error("SmileOne Failed");
  }

  // البرمجة الخاصة بمزود الخدمة Codashop
  if (provider === "codashop") {
    const res = await axios.post("https://api.codashop.com/topup", {
      playerId,
      itemCode: itemId,
      apiKey: process.env.CODASHOP_KEY
    }, { timeout: 10000 });
    
    if (!res.data.success) throw new Error("Codashop Failed");
  }
      }
