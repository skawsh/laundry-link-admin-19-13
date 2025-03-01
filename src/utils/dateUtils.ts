
// Helper function to generate dates in 2025 with proper date constraints
export const createOrderDate = (month: number, day: number): string => {
  // Create a date in 2025
  const orderDate = new Date(2025, month - 1, day);
  
  // Get today's date but in 2025
  const today = new Date();
  const todayIn2025 = new Date(2025, today.getMonth(), today.getDate());
  
  // If the order date would be after today (in 2025), adjust it to today
  if (orderDate > todayIn2025) {
    return todayIn2025.toISOString().split('T')[0];
  }
  
  return orderDate.toISOString().split('T')[0];
};

export const createDeliveredDate = (orderDate: string, washType: 'express' | 'standard' | 'combined' = 'standard'): string | undefined => {
  const date = new Date(orderDate);
  
  // Get today's date but in 2025
  const today = new Date();
  const todayIn2025 = new Date(2025, today.getMonth(), today.getDate());
  
  // Set days to add based on wash type
  let daysToAdd = 4; // Default for standard or combined
  if (washType === 'express') {
    daysToAdd = 1;
  }
  
  date.setDate(date.getDate() + daysToAdd);
  
  // If the delivery date would be after today (in 2025), make it today or undefined
  if (date > todayIn2025) {
    // If the order was placed very recently (less than the required days ago), don't set a delivery date
    const orderDateObj = new Date(orderDate);
    const daysDifference = Math.floor((todayIn2025.getTime() - orderDateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < daysToAdd) {
      return undefined;
    }
    return todayIn2025.toISOString().split('T')[0];
  }
  
  return date.toISOString().split('T')[0];
};

export const formatIndianRupees = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};
