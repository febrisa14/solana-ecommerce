import axios from "axios";

export async function convertUSDToSOL(usdAmount: number): Promise<number> {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
    );
    const solPrice = response.data.solana.usd;
    return Number((usdAmount / solPrice).toFixed(4));
  } catch (error) {
    console.error("Price conversion error:", error);
    throw new Error("Unable to fetch current SOL price");
  }
}
