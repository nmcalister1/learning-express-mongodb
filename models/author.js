const mongoose = require("mongoose")
const { DateTime } = require("luxon")

const {Schema} = mongoose

const AuthorSchema = new Schema({
    firstName: { type: String, required: true, maxLength: 100},
    familyName: { type: String, required: true, maxLength: 100},
    dateOfBirth: { type: Date },
    dateOfDeath: { type: Date },
})

AuthorSchema.virtual("name").get(function () {
    let fullname = ""
    if (this.firstName && this.familyName){
        fullname = `${this.familyName}, ${this.firstName}`
    }
    return fullname
})

AuthorSchema.virtual("url").get(function () {
    return `/catalog/author/${this._id}`
})

AuthorSchema.virtual("dateOfBirthFormatted").get(function () {
    return this.dateOfBirth ? DateTime.fromJSDate(this.dateOfBirth).toLocaleString(DateTime.DATE_MED) : 'N/A'
})

AuthorSchema.virtual("dateOfDeathFormatted").get(function () {
    return this.dateOfDeath ? DateTime.fromJSDate(this.dateOfDeath).toLocaleString(DateTime.DATE_MED) : 'N/A'
})

module.exports = mongoose.model("Author", AuthorSchema)