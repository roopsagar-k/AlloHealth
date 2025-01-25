import Joi from "joi";

export const validateDoctor = (doctor: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    specialization: Joi.string().min(3).max(50).required(),
    location: Joi.string().min(3).max(50).required(),
    availability: Joi.string().min(5).max(50).required(), // e.g., "9 AM - 5 PM"
  });

  return schema.validate(doctor);
};
