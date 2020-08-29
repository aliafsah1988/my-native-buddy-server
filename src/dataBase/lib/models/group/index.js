function GroupModel(
  name,
  description,
  userId,
  createDate,
  persistDate
) {
  if (name) this.name = name
  if (description) this.description = description
  if (userId) this.userId = userId
  if (createDate) this.createDate = createDate
  if (persistDate) this.persistDate = persistDate
}

export default GroupModel
