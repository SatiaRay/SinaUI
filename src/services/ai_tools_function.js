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

    return await aiToolsEndpoints.submitMayoralRequest({
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

export const aiToolsEndpoints = {
  submitMayoralRequest: async ({ mobile, address, lat, long, subject_id }) => {
    const plainAxios = axios.create({
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.REACT_APP_SERVICE_137_API_KEY}`,
      },
    });

    try {
      const res = await plainAxios.post(
        "https://arak.satia.co/api/submit/request",
        {
          mobile,
          address,
          lat,
          long,
          subject_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_SERVICE_137_API_KEY}`,
          },
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
    lat = lat ?? process.env.REACT_APP_CITY_LAT;
    lng = lng ?? process.env.REACT_APP_CITY_LON;

    try {
      const res = await axios.get("https://api.neshan.org/v1/search", {
        params: {
          term,
          lat,
          lng,
        },
        headers: {
          "Api-Key": process.env.REACT_APP_NESHAN_API_KEY,
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
