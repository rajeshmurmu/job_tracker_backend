import vine, { errors } from "@vinejs/vine";
import Job from "../models/job.model.js";
import { jobSchema } from "../utils/vinejsDataValidation.js";

const ITEMS_PER_PAGE = 10;

export const getAllJobs = async (req, res) => {
  try {
    const { id } = req?.user;

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || ITEMS_PER_PAGE;
    const skip = (page - 1) * ITEMS_PER_PAGE;

    // validate query parameters
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
      });
    }

    // get all jobs for the requested user
    const jobs = await Job.find({ user: id }).skip(skip).limit(limit).sort({
      applied_date: -1,
    });

    if (!jobs || jobs.length === 0) {
      return res.status(200).json({
        success: true,
        jobs,
        message: "No jobs found",
      });
    }

    // get total number of jobs and total number of pages
    const totalJobs = await Job.countDocuments({ user: id });
    const totalPage = Math.ceil(totalJobs / ITEMS_PER_PAGE);

    return res.status(200).json({
      success: true,
      jobs,
      totalJobs,
      totalPage,
      currentPage: page,
      message: "Jobs fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting all jobs", error);
    return res.status(500).json({
      success: false,
      message: "Error while getting all jobs",
    });
  }
};

export const getJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params?.id });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Job fetch successfully",
      job,
    });
  } catch (error) {
    console.log("Error while getting job", error);
    return res.status(500).json({
      success: false,
      message: "Error getting job",
    });
  }
};

export const createJob = async (req, res) => {
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
    const validator = vine.compile(jobSchema);
    const validatedData = await validator.validate(req.body);

    // check if job already exists
    const jobExists = await Job.findOne({
      company_name: validatedData.company_name,
      position: validatedData.position,
      location: validatedData.location,
      status: validatedData.status,
      applied_date: validatedData.applied_date,
    });

    if (jobExists) {
      return res.status(400).json({
        success: false,
        message: "Job already exists",
      });
    }

    // check if job status is applied
    // if (validatedData.status !== "applied") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Job status must be applied",
    //   });
    // }

    // add user id to job
    validatedData.user = id;

    // create new job
    const job = await Job.create(validatedData);

    if (!job) {
      return res.status(400).json({
        success: false,
        message: "Error while creating job",
      });
    }

    return res.status(201).json({
      success: true,
      job,
      message: "Job created successfully",
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ success: false, error: error.messages });
    }
    console.log("Error while creating job", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating job",
    });
  }
};

export const updateJob = async (req, res) => {
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
    const validator = vine.compile(jobSchema);
    const validatedData = await validator.validate(req.body);

    // get already existing job
    const jobExists = await Job.findOne({ _id: req.params.id, user: id });

    if (!jobExists) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // add user id to job
    validatedData.user = id;

    // update job
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id },
      validatedData,
      { new: true }
    );

    if (!job) {
      return res.status(400).json({
        success: false,
        message: "Error while updating job",
      });
    }

    return res.status(200).json({
      success: true,
      job,
      message: "Job updated successfully",
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ success: false, error: error.messages });
    }

    console.log("Error while updating job", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating job",
    });
  }
};

export const deleteJob = async (req, res) => {
  try {
    // get auth user
    const { id } = req?.user;

    // delete job
    const deletedJob = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req?.user?.id,
    });

    if (!deletedJob) {
      return res.status(400).json({
        success: false,
        message: "Invalid request or job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job: deletedJob,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting job", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting job",
    });
  }
};
