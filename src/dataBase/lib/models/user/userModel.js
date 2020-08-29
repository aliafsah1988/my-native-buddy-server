function userModel(
  email,
  password,
  role,
  active,
  firstName,
  lastName,
  phone_number,
  location,
  birth_date,
  deleted,
  createDate,
  persistDate
) {
  if (email) this.email = email
  if (password) this.password = password
  if (role) this.role = role
  if (active !== null || active !== undefined) this.active = active
  if (firstName) this.firstName = firstName
  if (lastName) this.lastName = lastName
  if (phone_number) this.phone_number = phone_number
  if (location) this.location = location
  if (birth_date) this.birth_date = birth_date
  if (deleted !== null || deleted !== undefined) this.deleted = deleted
  if (createDate) this.createDate = createDate
  if (persistDate) this.persistDate = persistDate
}

export default userModel
