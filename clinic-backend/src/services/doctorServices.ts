import { Doctor } from "../entities/Doctor";

export const getDoctors = async () => {
  return await Doctor.find();
};

export const createDoctor = async (doctorData: Partial<Doctor>) => {
  const doctor = Doctor.create(doctorData);
  return await doctor.save();
};

export const updateDoctor = async (
  doctorId: number,
  updateData: Partial<Doctor>
) => {
  const doctor = await Doctor.findOneBy({ id: doctorId });
  if (!doctor) throw new Error("Doctor not found");

  Object.assign(doctor, updateData);
  return await doctor.save();
};

export const deleteDoctor = async (doctorId: number) => {
  const doctor = await Doctor.findOneBy({ id: doctorId });
  if (!doctor) throw new Error("Doctor not found");

  return await doctor.remove();
};
