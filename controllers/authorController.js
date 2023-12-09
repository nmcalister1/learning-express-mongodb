const Author = require("../models/author")
const Book = require("../models/book")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator")

exports.authorList = asyncHandler(async (req, res, next) => {
    const allAuthors = await Author.find().sort({ familyName: 1 }).exec()

    res.render("author_list", {
        title: "Author List",
        authorList: allAuthors,
    })
})

exports.authorDetail = asyncHandler(async (req, res, next) => {
    const [author, allBooksByAuthor] = await Promise.all([
        Author.findById(req.params.id).exec(),
        Book.find({ author: req.params.id }, "title summary").exec(),
    ])

    if (author === null){
        const err = new Error("Author not found")
        err.status = 404
        return next(err)
    }

    res.render("author_detail", {
        title: "Author Detail",
        author: author, 
        authorBooks: allBooksByAuthor,
    })
})

exports.authorCreateGet = (req, res, next) => {
    res.render("author_form", { title: "Create Author" })
}

exports.authorCreatePost = [
    body("firstName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified,")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
    body("familyName")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
    body("dateOfBirth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
    body("dateOfDeath", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)
        const author = new Author({
            firstName: req.body.firstName,
            familyName: req.body.familyName,
            dateOfBirth: req.body.dateOfBirth,
            dateOfDeath: req.body.dateOfDeath,
        })

        if (!errors.isEmpty()){
            res.render("author_form", {
                title: "Create Author",
                author: author, 
                errors: errors.array(),
            })
            return
        } else {
            await author.save()
            res.redirect(author.url)
        }
    })


]

exports.authorDeleteGet = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete GET")
})

exports.authorDeletePost = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Author delete POST")
})

exports.authorUpdateGet = asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update GET")
})

exports.authorUpdatePost = asyncHandler(async(req, res, next) => {
    res.send("NOT IMPLEMENTED: Author update POST")
})