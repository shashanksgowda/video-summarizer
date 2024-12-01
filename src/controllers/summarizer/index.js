const { processLinks } = require("./utils");

const generateSummary = async (req, res) => {
  const { text } = req.body;
  const links = text.split(",");
  const data = await processLinks(links);
  res.send({data});
};

const generatePDF = async (req, res) => {
//   const { text } = req.body;
//   const links = text.split(",");
//   const data = await processLinks(links);
//   res.send({data});
}

module.exports = {
  generateSummary,
  generatePDF
};
