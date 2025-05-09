/**
 * Utility class to handle advanced query features for Mongoose models.
 *
 * This class provides methods for filtering, sorting, field limiting, and pagination
 * based on query parameters from the request object. It is designed to be chained
 * for cleaner and more modular query building.
 *
 * @class APIFeatures
 * @constructor
 * @param {Object} query - The Mongoose query object (e.g., `Model.find()`).
 * @param {Object} queryStr - The query string object from the request (e.g., `req.query`).
 *
 * Methods:
 * - **filter()**:
 *   - Filters the query based on the query string parameters.
 *   - Removes reserved fields like `page`, `sort`, `limit`, and `fields`.
 *   - Supports advanced filtering with operators like `gte`, `gt`, `lte`, and `lt`.
 *   - Example: `/api/v1/tours?price[gte]=500&duration=5`
 *
 * - **sort()**:
 *   - Sorts the query results based on one or more fields.
 *   - Default sorting is by `_id` if no `sort` parameter is provided.
 *   - Example: `/api/v1/tours?sort=price` (ascending) or `/api/v1/tours?sort=-price` (descending).
 *
 * - **limitFields()**:
 *   - Limits the fields returned in the query results to reduce payload size.
 *   - Default excludes the `__v` field.
 *   - Example: `/api/v1/tours?fields=name,price,duration`
 *
 * - **paginate()**:
 *   - Implements pagination by skipping and limiting results based on `page` and `limit` parameters.
 *   - Default page is `1` and default limit is `100`.
 *   - Example: `/api/v1/tours?page=2&limit=10`
 *
 * Example Usage:
 * ```javascript
 * const features = new APIFeatures(Tour.find(), req.query)
 *   .filter()
 *   .sort()
 *   .limitFields()
 *   .paginate();
 *
 * const tours = await features.query;
 * ```
 */
class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // gte, gt, lte, lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      this.query = this.query.sort(this.queryStr.sort.replaceAll(',', ' '));
    } else {
      this.query = this.query.sort('_id');
    }

    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      this.query = this.query.select(this.queryStr.fields.replaceAll(',', ' '));
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = +this.queryStr.page || 1;
    const limit = +this.queryStr.limit || 100;

    this.query = this.query.skip((page - 1) * limit).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
