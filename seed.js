const bycrpt = require("bcrypt");
const faker = require("faker");
const Promise = require("bluebird");
const { Leads, House, User } = require("./models");

const createUsers = async () => {
  const password = "123456";
  let hashedPassword = "";
  try {
    hashedPassword = await bycrpt.hash(password, 10);
  } catch (e) {
    console.log(e);
  }
  return User.create({
    firstName: "Cesar",
    lastName: "Hernandez",
    email: "tinh572@gmail.com",
    password: hashedPassword
  });
};

const createHouse = () => {
  return House.create({
    streetAddress: "12258 Dunrobin Ave",
    city: "Downey",
    state: "CA",
    zip: "90242",
    price: "900000",
    leadId: "1"
  });
};
const createLeads = async () => {
  const leads = [];
  for (let i = 0; i < 100; i += 1) {
    const lead = {};
    (lead.firstName = faker.name.firstName()),
      (lead.lastName = faker.name.lastName()),
      (lead.email = faker.internet.email()),
      (lead.phone = faker.phone.phoneNumber(faker.phone.phoneNumberFormat()));
    leads.push(lead);
  }
  return Promise.map(leads, lead => {
    return Leads.create(lead);
  });
};
const connectUserAndLeads = async () => {
  const leads = await Leads.findAll();
  const user = await User.findOne({ where: { id: 1 } });
  leads.forEach(lead => {
    user.addLeads(lead, { through: "lead_user" });
  });
  //   console.log(leads);
};

(async function() {
  //   await createUsers();
  //   await createHouse();
  //   await createLeads();
  await connectUserAndLeads();
})();
