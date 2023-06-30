const express = require("express");
const router = express.Router();
const machine_test = require("./controller");

router.post("/addBucket", machine_test.addBucket);
router.post("/addBall", machine_test.addBall);
router.put("/updateBucket/:id", machine_test.updateBucket);
router.put("/updateBall/:id", machine_test.updateBall);
router.get("/retrieveBucket/:id", machine_test.getBucketInformation);
router.get("/retrieveAllBuckets", machine_test.retrieveAllBuckets);
router.get("/retrieveBall/:id", machine_test.getBallInformation);
router.get("/retrieveAllBalls", machine_test.retrieveAllBalls);
router.delete("/deleteBucket/:id", machine_test.deleteBucket);
router.delete("/deleteBall/:id", machine_test.deleteBall);

router.post("/placeBalls", machine_test.placeBalls);
router.put("/reset", machine_test.reset);
router.get("/bucketViews", machine_test.bucketViews);

module.exports = router;
