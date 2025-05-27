import vine, { errors } from "@vinejs/vine";
import Application from "../models/application.model.js";
import { applicationSchema } from "../utils/vinejsDataValidation.js";
import { format } from "date-fns";
import User from "../models/user.model.js";

const ITEMS_PER_PAGE = 10;

export const getAllApplications = async (req, res) => {
  try {
    const { id } = req?.user;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const page = Number(req.query.page) || 1;
    // const limit = Number(req.query.limit) || ITEMS_PER_PAGE; // default limit is 10
    const limit = Number(req.query.limit);
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // // validate query parameters
    // if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Invalid query parameters",
    //   });
    // }

    // get all applications for the requested user
    const applications = await Application.find({ user: id })
      .skip(skip)
      .limit(limit)
      .sort({
        applied_date: -1,
      });

    if (!applications || applications.length === 0) {
      return res.status(200).json({
        success: true,
        applications,
        message: "No applications found",
      });
    }

    // get total number of applications and total number of pages
    const totalapplications = await Application.countDocuments({ user: id });
    const totalPage = Math.ceil(totalapplications / ITEMS_PER_PAGE);

    return res.status(200).json({
      success: true,
      applications,
      totalapplications,
      totalPage,
      currentPage: page,
      message: "applications fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting all applications", error);
    return res.status(500).json({
      success: false,
      message: "Error while getting all applications",
    });
  }
};

export const getApplication = async (req, res) => {
  try {
    const application = await Application.findOne({ _id: req.params?.id });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application fetch successfully",
      application,
    });
  } catch (error) {
    console.log("Error while getting application", error);
    return res.status(500).json({
      success: false,
      message: "Error getting application",
    });
  }
};

export const createApplication = async (req, res) => {
  try {
    // get auth user
    const { id } = req?.user;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    // get auth user
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const validDate = format(req.body.applied_date, "yyyy-MM-dd");
    // validate user inputformat(req.body.applied_date, "dd-MM-yyyy"),
    const validator = vine.compile(applicationSchema);
    const validatedData = await validator.validate({
      ...req.body,
      applied_date: validDate,
    });

    // check if application already exists
    const applicationExists = await Application.findOne({
      company_name: validatedData.company_name,
      position: validatedData.position,
      location: validatedData.location,
      status: validatedData.status,
      applied_date: validatedData.applied_date,
    });

    if (applicationExists) {
      return res.status(400).json({
        success: false,
        message: "Application already exists",
      });
    }

    // check if application status is applied
    // if (validatedData.status !== "applied") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Application status must be applied",
    //   });
    // }

    // add user id to application
    validatedData.user = id;

    // create new application
    const application = await Application.create(validatedData);

    if (!application) {
      return res.status(400).json({
        success: false,
        message: "Error while creating application",
      });
    }

    // add created application to users applications
    user.applications.push(application);
    await user.save();

    return res.status(201).json({
      success: true,
      application,
      message: "Application created successfully",
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ success: false, error: error.messages });
    }
    console.log("Error while creating application", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating application",
    });
  }
};

export const updateApplication = async (req, res) => {
  try {
    // get auth user
    const { id } = req?.user;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    // validate user input
    const validator = vine.compile(applicationSchema);
    const validatedData = await validator.validate(req.body);

    // get already existing application
    const applicationExists = await Application.findOne({
      _id: req.params.id,
      user: id,
    });

    if (!applicationExists) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // add user id to application
    validatedData.user = id;

    // update application
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id },
      validatedData,
      { new: true }
    );

    if (!application) {
      return res.status(400).json({
        success: false,
        message: "Error while updating application",
      });
    }

    return res.status(200).json({
      success: true,
      application,
      message: "Application updated successfully",
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ success: false, error: error.messages });
    }

    console.log("Error while updating application", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating application",
    });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    // get auth user
    const { id } = req?.user;

    // delete application
    const deletedapplication = await Application.findOneAndDelete({
      _id: req.params.id,
      user: id,
    });

    if (!deletedapplication) {
      return res.status(400).json({
        success: false,
        message: "Invalid request or application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application: deletedapplication,
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting application", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting application",
    });
  }
};
