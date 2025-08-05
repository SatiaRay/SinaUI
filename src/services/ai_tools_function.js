import { tool } from "@openai/agents/realtime";
import axios from "axios";
import { z } from "zod";

// Submit request in 137 mayoral application
export const submitRequest = tool({
  name: "Mayoral-submitRequest",
  description: "ثبت پیام در سامانه شهرداری 137",
  parameters: z.object({
    mobile: z.string(),
    address: z.string(),
    lat: z.string(),
    long: z.string(),
    subject_id: z.number(),
  }),
  async execute({ mobile, address, lat, long, subject_id }) {
    console.log("Executing submitRequest with parameters:", {
      mobile,
      address,
      lat,
      long,
      subject_id,
    });

    return await aiToolsEndpoints.submitRequest({
      mobile,
      address,
      lat,
      long,
      subject_id,
    });
  },
});

// Neshan Search API
export const neshanSearch = tool({
  name: "Neshan-search_address",
  description: "جستجوی مکان با استفاده از سرویس نشان",
  parameters: z.object({
    term: z.string(),
  }),
  async execute({ term }) {
    console.log("Executing Neshan search with term:", term);

    return await aiToolsEndpoints.neshanSearch({ term });
  },
});

// Endpoints
export const aiToolsEndpoints = {
  submitRequest: async ({ mobile, address, lat, long, subject_id }) => {
    try {
      const plainAxios = axios.create({
        headers: {
          common: {
            "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SERVICE_137_API_KEY}`,
          }
        },
      });

      const res = await plainAxios.post(
        "https://137.iranlms.ir/api/v1/requests",
        {
          mobile,
          address,
          lat,
          long,
          subject_id,
        }
      );
      return res.data;
    } catch (error) {
      console.error("Error submitting request:", error);
      return {
        success: false,
        message: error,
      };
    }
  },
  neshanSearch: async ({ term, lat = null, lng = null }) => {
    lat = lat ?? process.env.CITY_LAT;
    lng = lng ?? process.env.CITY_LON;

    try {
      const plainAxios = axios.create({
        headers: {
          common: {
            "Api-Key": process.env.NESHAN_API_KEY,
          }
        },
      });

      const res = await plainAxios.get(`https://api.neshan.org/v1/search`, {
        params: {
          term,
          lat,
          lng,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error in Neshan search:", error);
      return {
        success: false,
        message: error,
      };
    }
  },
};
