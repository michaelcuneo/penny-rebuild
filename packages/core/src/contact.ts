export * as Contact from "./contact";

// Add the Contact to the DynamoDB Database.
export async function create() {
  const id = crypto.randomUUID();
  // write to database
  return id;
}

export async function list() {
  const id = crypto.randomUUID();
  // list all contacts
  return id;
}
