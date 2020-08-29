function WordModel(
  text,
  description,
  synonyms,
  translation,
  nextpractice,
  correctcount,
  userId,
  groupId,
  createDate,
  persistDate
) {
  if (text) this.text = text
  if (description) this.description = description
  if (synonyms) this.synonyms = synonyms
  if (translation) this.translation = translation
  if (nextpractice) this.nextpractice = nextpractice
  if (correctcount !== null && correctcount !== undefined) this.correctcount = correctcount
  if (userId) this.userId = userId
  if (groupId) this.groupId = groupId
  if (createDate) this.createDate = createDate
  if (persistDate) this.persistDate = persistDate
}

export default WordModel
