import { Queue } from "../entities/Queue";
import { Patient } from "../entities/Patient";

export const seedQueue = async () => {
  const patient1 = await Patient.findOne({ where: { name: "John Doe" } });
  const patient2 = await Patient.findOne({ where: { name: "Jane Doe" } });

  if (patient1 && patient2) {
    const queue1 = new Queue();
    queue1.patient = patient1;
    queue1.queueNumber = 1;
    queue1.status = "waiting";
    await queue1.save();

    const queue2 = new Queue();
    queue2.patient = patient2;
    queue2.queueNumber = 2;
    queue2.status = "waiting";
    await queue2.save();
  }
};
