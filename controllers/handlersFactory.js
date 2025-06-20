const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const apiFeatures = require("../utils/apiFeatures");

exports.createOne = (Model, arrOfFields) =>
  asyncHandler(async (req, res) => {
    const newObj = arrOfFields.reduce((acc, field) => {
      acc[field] = req.body[field];
      return acc;
    }, {});

    const document = await Model.create(newObj);
    res.status(201).json({ data: document });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const document = await Model.findById(id);
    if (!document) {
      return next(new apiError("No Document For This ID", 404));
    } else {
      await document.deleteOne();
    }

    res.status(204).send();
  });

exports.updateOne = (Model, allowedFields) =>
  asyncHandler(async (req, res, next) => {
    let document = await Model.findById(req.params.id);
    if (!document) return next(new apiError("No Document For This Id", 404));
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        document[field] = req.body[field];
      }
    });
    await document.save();
    res.status(200).json({ data: document });
  });

exports.getOne = (Model, populationOption) =>
  asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    let query = Model.findById(id);
    if (populationOption) {
      query.populate(populationOption);
    }
    let document = await query.select("-__v -password -role").exec();
    if (!document) return next(new apiError("No document For This Id", 404));
    res.status(200).json({ data: document });
  });

exports.getAll = (Model) =>
  asyncHandler(async (req, res) => {
    const ApiFeatures = new apiFeatures(Model.find(), req.query)
      .filter()
      .search();

    if (req.filterObject) {
      ApiFeatures.modelFind = ApiFeatures.modelFind.find(req.filterObject);
    }

    await ApiFeatures.paginate();

    ApiFeatures.limitFields().sort();

    const { modelFind, paginationResult } = ApiFeatures;

    const documents = await ApiFeatures.modelFind;
    res
      .status(200)
      .json({ length: documents.length, paginationResult, data: documents });
  });
