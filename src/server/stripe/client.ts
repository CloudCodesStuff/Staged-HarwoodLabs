import { env } from "@/env";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_SK, {
  apiVersion: "2025-05-28.basil",
});