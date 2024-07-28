import httpStatus from "http-status";
import User from "../models/User";

const updateUserDetails = async (req, res) => {
  const { contactDetails, industry, expertise, portfolioLinks } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        profile: { contactDetails, industry, expertise, portfolioLinks },
      },
      {
        new: true,
      }
    );
    res.status(httpStatus.OK).json({ message: updatedUser });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: error,
    });
  }
};
