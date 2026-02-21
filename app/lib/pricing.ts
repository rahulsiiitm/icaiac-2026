// app/lib/pricing.ts

export const CONFERENCE_PRICING = {
  INR: {
    "Author (Student)": 5000,
    "Author (Faculty/Industry)": 8000,
    "Non-Author": 4000,
  },
  USD: {
    "Author (Student)": 120,
    "Author (Faculty/Industry)": 250,
    "Non-Author": 80,
  },
};

/**
 * Calculates the conference fee based on category and region.
 * Note: Uses the "Early Bird" rates from your Registration component.
 */
export function calculateFee(category: string, region: string): number {
  const currency = region === "INR" ? "INR" : "USD";
  
  if (category.includes("Non-Author")) {
    return CONFERENCE_PRICING[currency]["Non-Author"];
  }
  
  if (category.includes("Student")) {
    return CONFERENCE_PRICING[currency]["Author (Student)"];
  }

  if (category.includes("Faculty") || category.includes("Industry")) {
    return CONFERENCE_PRICING[currency]["Author (Faculty/Industry)"];
  }
  
  return 0;
}