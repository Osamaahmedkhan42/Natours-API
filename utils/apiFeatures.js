class APIFeatures {
    constructor(query, queryStringz) {
        this.query = query
        this.queryString = queryStringz
    }
    filter() {
        //set up filtering
        const queryObj = { ...this.queryStringz }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])

        //Advance filtering
        let queryString = JSON.stringify(queryObj)

        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        //Constructing query
        //let query = Tour.find(JSON.parse(queryString))
        this.query = this.query.find(JSON.parse(queryString))
        return this

    }
    sort() {
        if (this.queryString.sort) {
            //multi variable sort
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }
        return this

    }

    limitFields() {
        // limiting fields
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ')
            this.query = this.query.select(fields)
        }
        else {
            this.query = this.query.select('-__v')
        }

        return this
    }
    paginate() {
        // //Pagination
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 100
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        //if user enter a page where there is no data
        return this

    }

}
module.exports = APIFeatures