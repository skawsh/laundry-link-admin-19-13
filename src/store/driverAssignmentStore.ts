
interface Order {
  id: string;
  customer: string;
  address: string;
  status: string;
  date: string;
  phoneNumber: string;
}

interface DriverAssignment {
  driverId: string;
  driverName: string;
  orders: Order[];
}

// In-memory store for driver assignments
let driverAssignments: DriverAssignment[] = [];

export const getDriverAssignments = () => {
  return driverAssignments;
};

export const getDriverAssignment = (driverId: string) => {
  return driverAssignments.find(assignment => assignment.driverId === driverId);
};

export const assignOrdersToDriver = (
  driverId: string,
  driverName: string,
  orders: Order[]
) => {
  // Check if driver already has assignments
  const existingAssignmentIndex = driverAssignments.findIndex(
    assignment => assignment.driverId === driverId
  );

  if (existingAssignmentIndex >= 0) {
    // Update existing assignment
    const existingOrders = driverAssignments[existingAssignmentIndex].orders;
    
    // Add new orders (avoiding duplicates)
    const newOrders = orders.filter(
      newOrder => !existingOrders.some(order => order.id === newOrder.id)
    );
    
    driverAssignments[existingAssignmentIndex].orders = [
      ...existingOrders,
      ...newOrders
    ];
  } else {
    // Create new assignment
    driverAssignments.push({
      driverId,
      driverName,
      orders
    });
  }

  console.log("Updated driver assignments:", driverAssignments);
  return driverAssignments;
};

export const removeOrderFromDriver = (driverId: string, orderId: string) => {
  const driverIndex = driverAssignments.findIndex(
    assignment => assignment.driverId === driverId
  );

  if (driverIndex >= 0) {
    driverAssignments[driverIndex].orders = driverAssignments[driverIndex].orders.filter(
      order => order.id !== orderId
    );
  }

  return driverAssignments;
};

export const getAssignedOrdersForDriver = (driverId: string): Order[] => {
  const assignment = driverAssignments.find(a => a.driverId === driverId);
  return assignment ? assignment.orders : [];
};

export const getAllAssignedOrders = (): Order[] => {
  return driverAssignments.flatMap(assignment => assignment.orders);
};
