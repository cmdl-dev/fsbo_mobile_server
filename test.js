const { Leads, House, User } = require("./models");

// Promise.all([
//   User.create({
//     firstName: "Cesar",
//     lastName: "Hernandez",
//     email: "tinh572@gmail.com",
//     password: "passwordhash"
//   }),
//   House.create({
//     streetAddress: "12258 Dunrobin Ave",
//     city: "Downey",
//     state: "CA",
//     zip: "90242",
//     price: "900000",
//     leadId: "1"
//   }),
//   Leads.create({
//     firstName: "Cesar",
//     lastName: "Hernandez",
//     email: "tinh572@gmail.com",
//     phone: "5622292574"
//   })
// ]).catch(e => console.log(e));
// Promise.all([Leads.findAll(), User.findOne({ where: { id: 1 } })]).then(
//   ([leads, user]) => {
//     leads.forEach(lead => {
//       lead.addUser(user, { through: "lead_user" });
//     });
//   }
// );

// User.findAll({ include: [{ model: Leads }] }).then(users => {
//   users.forEach(user => {
//     user.Leads.forEach(leads => {
//       console.log(leads.get({ plain: true }));
//     });
//   });
// });

User.findOne({ where: { id: 1 }, include: [Leads] }).then(user => {
  console.log(user.Leads);
});
