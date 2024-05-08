function fieldRemoval(schema) {
    schema.set('toJSON', {
        transfrom: (dec, ret) => {
            delete ret.password
            delete ret.createdAt
            delete ret.updatedAt
            delete ret.__v
            delete ret.refreshToken
            ret.id = ret._id
            delete ret._id
        }
    })
}

export default fieldRemoval