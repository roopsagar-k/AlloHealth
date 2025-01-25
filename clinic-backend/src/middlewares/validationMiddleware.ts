// utils/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessages = error.details.map((detail) => ({
        message: detail.message,
        path: detail.path.join("."),
      }));
      res.status(400).json({ errors: errorMessages });
    }

    next();
  };
};
