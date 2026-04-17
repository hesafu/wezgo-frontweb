import { createClient } from "@/utils/supabase/client";

/**
 * Trip Service - Data fetching and mutations for Trips
 * TASK FRT-TK-011: Fetching Trips: Supabase integration for list of trips
 */
const supabase = createClient();

export const tripService = {
  /**
   * Fetch all trips for the authenticated user
   */
  async getTrips() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user authenticated");

    // We fetch trips where the user is an owner or participant
    // For now, assuming a simple 'trips' table with 'created_by'
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .order("start_date", { ascending: true });

    if (error) {
      console.error("Error fetching trips:", error);
      throw error;
    }

    return data;
  },

  /**
   * Fetch a single trip by ID
   */
  async getTripById(id) {
    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching trip ${id}:`, error);
      throw error;
    }

    return data;
  }
};
