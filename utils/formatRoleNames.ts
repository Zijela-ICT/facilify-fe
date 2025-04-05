export function formatRoleName(role:string) {
    return role?.replace(/_/g, " ") // Replace underscores with spaces
      .toLowerCase() // Convert to lowercase
      .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
      .replace(" Role", ""); // Remove the word "Role" if present
  }
  