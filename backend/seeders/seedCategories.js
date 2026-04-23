const { sequelize, Category } = require("../models");

async function seedCategories() {
  try {
    await sequelize.authenticate();

    console.log("Seeding categories...");

    const categories = [
      { name: "Office Supplies", description: "Office materials and tools" },
      { name: "Software", description: "Software licenses and SaaS" },
      { name: "Marketing", description: "Advertising and marketing costs" },
      { name: "Travel", description: "Business travel expenses" },
      { name: "Equipment", description: "Hardware and office equipment" },
      { name: "Consulting", description: "External consultants" },
      { name: "Utilities", description: "Electricity, internet, water" },
      { name: "Training", description: "Employee training programs" },
      { name: "Rent", description: "Office or building rental costs" },
      { name: "Telecommunications", description: "Phone and communication services" },
      { name: "Licenses", description: "Business and professional licenses" }
    ];

    for (let category of categories) {
      await Category.create(category);
    }

    console.log("Categories created successfully");
    process.exit();

  } catch (error) {
    console.error("Error seeding categories:", error);
  }
}

seedCategories();