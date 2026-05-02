import {
  handleContactSalesFetchRequest,
  resolveContactSalesEnv,
} from "../contact-sales-service";

export default {
  async fetch(request: Request) {
    return handleContactSalesFetchRequest(request, resolveContactSalesEnv(process.env));
  },
};

