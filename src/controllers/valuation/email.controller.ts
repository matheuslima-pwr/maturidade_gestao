import { ValuationData } from "@/@types/valuation";
import { sendEmailService } from "@/services/valuation/email.service";

export const sendEmailHandler = async (userId: string, body: ValuationData) => {
    return await sendEmailService(userId, body);
}