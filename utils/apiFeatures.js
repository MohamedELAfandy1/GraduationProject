class apiFeatures {
  //model.find(),req.query
  constructor(modelFind, reqQuery) {
    this.reqQuery = reqQuery;
    this.modelFind = modelFind;
  }
  filter() {
    const reqQueryObj = { ...this.reqQuery };
    const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
    excludedFields.forEach((field) => delete reqQueryObj[field]);

    let queryStr = JSON.stringify(reqQueryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

    const parsedQuery = JSON.parse(queryStr, (key, value) => {
      if (!isNaN(value) && typeof value === "string") {
        return Number(value);
      }
      return value;
    });
    this.modelFind = this.modelFind.find(parsedQuery);
    return this;
  }
  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(",").join(" ");
      this.modelFind = this.modelFind.sort(sortBy);
    } else {
      this.modelFind = this.modelFind.sort("-updatedAt");
    }
    return this;
  }
  limitFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields
        .split(",")
        .map((field) => field.trim());
      const sensitiveFields = ["password", "role"];

      const filteredFields = fields.filter(
        (field) => !sensitiveFields.includes(field)
      );

      if (filteredFields.length === 0) {
        this.modelFind = this.modelFind.select("-__v -password -role");
      } else {
        this.modelFind = this.modelFind.select(filteredFields.join(" "));
      }
    } else {
      this.modelFind = this.modelFind.select("-__v -password -role");
    }
    return this;
  }
  search() {
    if (this.reqQuery.keyword) {
      const query = {};
      query.$or = [
        { name: { $regex: this.reqQuery.keyword, $options: "i" } },
        { title: { $regex: this.reqQuery.keyword, $options: "i" } },
        { description: { $regex: this.reqQuery.keyword, $options: "i" } },
      ];
      this.modelFind = this.modelFind.find(query);
    }
    return this;
  }
  async paginate() {
    const allProductsCount = await this.modelFind.clone().countDocuments(); // Use clone() to reuse query

    const page = Math.max(1, parseInt(this.reqQuery.page) || 1);
    const limit = Math.max(1, parseInt(this.reqQuery.limit) || 20);
    const skip = (page - 1) * limit;

    let pagination = {};
    pagination.currentPage = +page;
    pagination.limit = +limit;
    pagination.numberOfPages = Math.ceil(allProductsCount / limit);

    const endIndex = page * limit;
    if (endIndex < allProductsCount) {
      pagination.next = +page + 1;
    }
    if (skip > 0) {
      pagination.previous = +page - 1;
    }

    this.modelFind = this.modelFind.skip(skip).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}
module.exports = apiFeatures;
