const dashboardService = require("../services/dashboardService");
const asyncHandler = require("../utils/asyncHandler");
const { ok } = require("../utils/response");

exports.getDashboard = asyncHandler(async (req, res) => {
  const data = await dashboardService.getDashboardSummary();
  return ok(res, data);
});
