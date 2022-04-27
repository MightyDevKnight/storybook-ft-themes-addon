function managerEntries(entry = []) {
  return [...entry, require.resolve("./register.tsx")]; //👈 Addon implementation
}

module.exports = { managerEntries };
