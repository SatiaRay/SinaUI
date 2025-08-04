import { tool } from "@openai/agents-realtime";
import { z } from "zod";

// Define parameter schemas for each function
const getConnectionLogsParams = z.object({
  serial: z.string(),
  beginDate: z.string().nullable(), // Changed to nullable
  endDate: z.string().nullable(), // Changed to nullable
});

const getServiceInfoParams = z.object({
  serial: z.string(),
  beginDate: z.string().nullable(), // Changed to nullable
  endDate: z.string().nullable(), // Changed to nullable
});

const getAccountsListParams = z.object({
  beginDate: z.string().nullable(), // Changed to nullable
  endDate: z.string().nullable(), // Changed to nullable
});

const searchAddressParams = z.object({
  searchTerm: z.string(),
});

const submitRequestParams = z.object({
  mobile: z.string(),
  address: z.string(),
  lat: z.number(),
  long: z.number(),
  subject_id: z.number(),
});

// Define each tool with its corresponding schema and execute logic
const getConnectionLogsTool = tool({
  name: "AppSatiaCo-get_connection_logs",
  description: "Fetch internet consumption details for a specific service.",
  parameters: getConnectionLogsParams,
  execute: async ({ serial, beginDate, endDate }) => {
    // API call or data processing logic
    console.log(
      `Fetching connection logs for ${serial} from ${beginDate} to ${endDate}`
    );
    // Call your backend API here or implement the logic
  },
});

const getServiceInfoTool = tool({
  name: "AppSatiaCo-get_service_info",
  description: "Fetch service subscription details for a user.",
  parameters: getServiceInfoParams,
  execute: async ({ serial, beginDate, endDate }) => {
    console.log(
      `Fetching service info for ${serial} from ${beginDate} to ${endDate}`
    );
    // Call your backend API here or implement the logic
  },
});

const getAccountsListTool = tool({
  name: "AppSatiaCo-get_accounts_list",
  description: "Get a list of all user subscriptions.",
  parameters: getAccountsListParams,
  execute: async ({ beginDate, endDate }) => {
    console.log(`Fetching accounts list from ${beginDate} to ${endDate}`);
    // Call your backend API here or implement the logic
  },
});

const searchAddressTool = tool({
  name: "Neshan-search_address",
  description:
    "Search for an address and get full details including geolocation.",
  parameters: searchAddressParams,
  execute: async ({ searchTerm }) => {
    console.log(`Searching for address: ${searchTerm}`);
    // Call the Neshan API or your address service here
  },
});

const submitRequestTool = tool({
  name: "Mayoral-submitRequest",
  description: "Submit a report request to the local municipality.",
  parameters: submitRequestParams,
  execute: async ({ mobile, address, lat, long, subject_id }) => {
    console.log(
      `Submitting request: ${mobile}, ${address}, ${lat}, ${long}, ${subject_id}`
    );
    // Call your API or process the report submission here
  },
});

const tools = [
  getConnectionLogsTool,
  getServiceInfoTool,
  getAccountsListTool,
  searchAddressTool,
  submitRequestTool,
];

export default tools;
