import { ApiResponse, Lead } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000/leads";

export async function fetchTableData(
  page: number = 1,
  pageSize: number = 10,
  query?: string,
  sortOrder?: string,
  dbUserId?: number,
): Promise<ApiResponse<Lead>> {
  try {
    let url;

    if (query && query.trim() !== "") {
      url = `${API_BASE_URL}leads/search?query=${query}&user_id=${dbUserId}`;
    } else {
      url = `${API_BASE_URL}leads?page=${page}&page_size=${pageSize}&sort_order=${sortOrder}&user_id=${dbUserId}`;
    }
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      method: "GET",
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = json.data ? json.data : json;

    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      next: null,
      previous: null,
      count: 0,
      results: [],
      status: "error",
    };
  }
}

export function formatDate(dateString: string): string {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}
