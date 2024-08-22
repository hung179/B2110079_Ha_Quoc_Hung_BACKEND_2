const ContactSerVice = require('../services/contact.service');
const MongoDB = require('../utils/mongodb.util');
const ApiError = require('../api-error');


exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, 'Name can not be empty'));
  }
  try {
    const contactSerVice = new ContactSerVice(MongoDB.client);
    const document = await contactSerVice.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, 'An error occurred while creating the contact')
    );
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const contactSerVice = new ContactSerVice(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await contactSerVice.findByName(name);
    } else {
      documents = await contactSerVice.find({});
    }
  } catch (error) {
    return next(
      new ApiError(500, 'An error occurred while retrieving contacts')
    );
  }
  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const contactSerVice = new ContactSerVice(MongoDB.client);
    const document = await contactSerVice.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, 'Contact not found'));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving contact with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, 'Data to update can not be empty'));
  }

  try {
    const contactSerVice = new ContactSerVice(MongoDB.client);
    const document = await contactSerVice.update(req.params.id, req.body);
    if (!document) {
      return next(new ApiError(404, 'Contact not found'));
    }
    return res.send({ message: 'Contact was updated successfully' });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating contact with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const contactSerVice = new ContactSerVice(MongoDB.client);
    const document = await contactSerVice.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, 'Contact not found'));
    }
    return res.send({ message: 'Contact was deleted successfully' });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete contact with id=${req.params.id}`)
    );
  }
};

exports.findAllFavorite = async (_req, res, next) => {
  try {
    const contactSerVice = new ContactSerVice(MongoDB.client);
    const documents = await contactSerVice.findFavorite();
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, 'An error occurred while retrieving favorite contacts')
    );
  }
};

exports.deleteAll = async (_req, res, next) => {
  try {
    const contactSerVice = new ContactSerVice(MongoDB.client);
    const deleteCount = await contactSerVice.deleteAll();
    return res.send({
      message: `${deleteCount} contacts were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, 'An error occurred while removing all contacts')
    );
  }
};