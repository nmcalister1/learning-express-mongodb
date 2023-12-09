const mongoose = require("mongoose")
const { DateTime } = require("luxon")

const {Schema} = mongoose

const BookInstanceSchema = new Schema({
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true},
    imprint: { type: String, required: true },
    status: {
        type: String, 
        required: true, 
        enum: ["Available", "Maintenance", "Loaned", "Reserved"],
        default: "Maintenance",
    },
    dueBack: { type: Date, default: Date.now },
})

BookInstanceSchema.virtual("url").get(function () {
    return `/catalog/bookinstance/${this._id}`
})

BookInstanceSchema.virtual("dueBackFormatted").get(function () {
    return DateTime.fromJSDate(this.dueBack).toLocaleString(DateTime.DATE_MED)
})

BookInstanceSchema.virtual("dueBack_yyyy_mm_dd").get(function () {
    return DateTime.fromJSDate(this.dueBack).toISODate(); // format 'YYYY-MM-DD'
})
  

module.exports = mongoose.model("BookInstance", BookInstanceSchema)