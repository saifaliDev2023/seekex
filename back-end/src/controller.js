const { Bucket, Ball, BallBucket } = require("./model");
const { Op, where } = require("sequelize");

const machine_test = {
  // ** Function to add a new bucket
  async addBucket(req, res, next) {
    try {
      const { bucket_name, max_volume } = req.body;
      const bucket = await Bucket.create({
        bucket_name,
        max_volume,
        empty_volume: max_volume,
      });
      res.status(201).json(bucket);
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to create a new bucket" });
    }
  },

  // ** Function to add a new ball
  async addBall(req, res, next) {
    try {
      let { color, volume } = req.body;
      const ball = await Ball.create({
        color,
        volume,
      });

      res.status(201).json(ball);
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to create a new ball" });
    }
  },

  // Update Bucket
  async updateBucket(req, res, next) {
    try {
      const { bucket_name, max_volume, empty_volume } = req.body;
      const bucket = await Bucket.findByPk(req.params.id);
      bucket.bucket_name = bucket_name;
      bucket.max_volume = max_volume;
      bucket.empty_volume = empty_volume;
      await bucket.save();
      res
        .status(201)
        .json({ message: "Bucket update succesfuly", data: bucket });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to update bucket" });
    }
  },

  // Update Ball
  async updateBall(req, res, next) {
    try {
      const { color, volume } = req.body;
      const ball = await Ball.findByPk(req.params.id);
      ball.color = color;
      ball.volume = volume;
      await ball.save();
      res.status(201).json({ message: "ball update succesfuly", data: ball });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to update ball" });
    }
  },

  // Retrieve Bucket Information
  async getBucketInformation(req, res, next) {
    try {
      const bucket = await Bucket.findByPk(req.params.id);
      res.status(201).json(bucket);
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to retrive bucket info" });
    }
  },

  // Retrieve Ball Information
  async getBallInformation(req, res, next) {
    try {
      const ball = await Ball.findByPk(req.params.id);
      res.status(201).json(ball);
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to retrive ball info" });
    }
  },

  // Delete Ball Information
  async deleteBucket(req, res, next) {
    try {
      const bucket = await Bucket.destroy({ where: { id: req.params.id } });
      res.status(201).json({ message: "Bucket destroy succesfuly" });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to delete bucket info" });
    }
  },

  // Delete Ball Information
  async deleteBall(req, res, next) {
    try {
      const ball = await Ball.destroy({ where: { id: req.params.id } });
      res.status(201).json({ message: "Ball destroy succesfuly" });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to delete ball info" });
    }
  },

  // Delete Ball Information
  async deleteBall(req, res, next) {
    try {
      const ball = await Ball.destroy({ where: { id: req.params.id } });
      res.status(201).json({ message: "Ball destroy succesfuly" });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to delete ball info" });
    }
  },

  // Function to place balls in buckets
  async placeBalls(req, res, next) {
    try {
      const buckets = await Bucket.findAll();
      const balls = await Ball.findAll();
      const db_balls = balls.reduce((acc, value) => {
        acc[value.dataValues.id] = value.dataValues.volume;
        return acc;
      }, {});
      const placeBalls = req.body;
      const keys1 = Object.keys(placeBalls);
      const keys2 = Object.keys(db_balls);
      const result = keys1
        .map((value, index) => {
          const ball_id = keys2[index];
          if (value == ball_id) {
            const balls = placeBalls[value];
            const volume = db_balls[ball_id];
            return {
              ball_id,
              total_ball: parseInt(balls) || 0,
              volume,
              total_volume: parseInt(balls) * parseInt(volume) || 0,
            };
          }
        })
        .filter(Boolean);
      let BallSum = result.reduce((acc, obj) => acc + obj.total_volume, 0);
      let halfVolume = [],
        fullVolume = [],
        bucketBallsResponse = [];
      buckets.forEach((value) => {
        if (
          value.dataValues.max_volume > value.dataValues.empty_volume &&
          value.dataValues.empty_volume !== 0
        ) {
          halfVolume.push(value.dataValues);
        } else {
          fullVolume.push(value.dataValues);
        }
      });
      halfVolume.sort(
        (a, b) =>
          a.max_volume - a.empty_volume - (b.max_volume - b.empty_volume)
      );
      fullVolume.sort((a, b) => b.empty_volume - a.empty_volume);
      let halfVolumeCheck = true,
        fullVolumeCheck = true,
        totalBalls = [];
      while (BallSum > 0) {
        if (halfVolumeCheck && halfVolume.length > 0) {
          for (let j = 0; j < halfVolume.length; j++) {
            for (let i = 0; i < result.length; ) {
              if (halfVolume[j].empty_volume >= result[i].volume) {
                if (result[i].total_ball != 0) {
                  result[i].total_ball -= 1;
                } else {
                  i++;
                  continue;
                }
                halfVolume[j].empty_volume -= result[i].volume;
                BallSum -= result[i].volume;
                result[i].total_volume -= result[i].volume;
                totalBalls.push({ ball_id: result[i].ball_id });
                halfVolume[j].exist_balls = countBallRepetitions(totalBalls);
              } else {
                i++;
              }
            }
          }
          await updateRecord(halfVolume);
          halfVolumeCheck = false;
        } else if (fullVolumeCheck && fullVolume.length > 0) {
          ({ BallSum, fullVolumeCheck } = await manageVolume(
            fullVolume,
            result,
            BallSum,
            totalBalls,
            fullVolumeCheck
          ));
        } else {
          bucketBallsResponse.push(await getBucketBalls());
          bucketBallsResponse.push(
            "Error: The available space or capacity is completely exhausted; all additional data deleted!"
          );
          return res.status(200).send({ data: bucketBallsResponse });
        }
      }
      bucketBallsResponse.push(await getBucketBalls());
      return res.status(200).send({
        message: "Place balls successfully",
        data: bucketBallsResponse,
      });
    } catch (error) {
      console.error("Error placing balls:", error);
    }

    async function manageVolume(
      volume,
      result,
      BallSum,
      totalBalls,
      fullVolumeCheck
    ) {
      for (let j = 0; j < volume.length; j++) {
        for (let i = 0; i < result.length; ) {
          if (volume[j].empty_volume >= result[i].volume) {
            if (result[i].total_ball != 0) {
              result[i].total_ball -= 1;
            } else {
              i++;
              continue;
            }
            volume[j].empty_volume -= result[i].volume;
            BallSum -= result[i].volume;
            result[i].total_volume -= result[i].volume;
            totalBalls.push({ ball_id: result[i].ball_id });
            volume[j].exist_balls = countBallRepetitions(totalBalls);
          } else {
            i++;
          }
        }
      }
      await updateRecord(volume);
      fullVolumeCheck = false;
      return { BallSum, fullVolumeCheck };
    }

    function countBallRepetitions(balls) {
      const repetitions = {};
      for (let ball of balls) {
        const id = ball.ball_id;
        repetitions[id] = repetitions[id] ? repetitions[id] + 1 : 1;
      }
      return repetitions;
    }

    async function updateRecord(bucketData) {
      for (const value of bucketData) {
        const dbBucketData = await Bucket.findByPk(value.id);
        let exist_balls = addObjectValues(
          value.exist_balls,
          JSON.parse(dbBucketData.exist_balls)
        );
        dbBucketData.empty_volume = value.empty_volume;
        dbBucketData.exist_balls = exist_balls;
        const storeBalls = await dbBucketData.save();
        return storeBalls;
      }
    }

    function addObjectValues(obj1, obj2) {
      let result = {};
      if (obj2 == null || typeof obj1 != "object") {
        result = obj1;
        return result;
      }
      for (let key in obj1) {
        if (obj2.hasOwnProperty(key)) {
          result[key] = obj1[key] + obj2[key];
        } else {
          result[key] = obj1[key];
        }
      }
      for (let key in obj2) {
        if (!obj1.hasOwnProperty(key)) {
          result[key] = obj2[key];
        }
      }
      return result;
    }
  },

  // Function to retrieve all buckets
  async retrieveAllBuckets(req, res, next) {
    try {
      let data = await Bucket.findAll();
      res.status(201).json({ message: "Retrieve Data succesfuly", data });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to retrieve all buckets" });
    }
  },

  // Function to retrieve all balls
  async retrieveAllBalls(req, res, next) {
    try {
      let data = await Ball.findAll();
      res.status(201).json({ message: "Retrieve Data succesfuly", data });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to retrieve all balls" });
    }
  },

  // Function to reset buckets volume
  async reset(req, res, next) {
    try {
      let buckets = await Bucket.findAll();
      buckets.forEach(async (bucket) => {
        bucket.empty_volume = bucket.max_volume;
        bucket.exist_balls = null;
        await bucket.save();
      });
      res.status(201).json({ message: "ReSet Data succesfuly", buckets });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to reset all balls" });
    }
  },

  async bucketViews(req, res, next) {
    try {
      let data = await getBucketBalls();
      res.status(201).json({ message: "Retrieve Data succesfuly", data });
    } catch (error) {
      console.log("error:", error);
      res.status(500).json({ error: "Failed to retrieve all balls" });
    }
  },
};

async function getBucketBalls() {
  let ballsResponse = [];
  const buckets = await Bucket.findAll();
  for (let value of buckets) {
    let ballDetails = {};
    let notNull = value.dataValues.exist_balls;
    if (notNull != null) {
      let exist_balls = JSON.parse(value.exist_balls);
      let bucket_name = value.bucket_name;
      for (let key in exist_balls) {
        let getBall = await Ball.findByPk(parseInt(key));
        let ball_color = getBall.dataValues.color;
        let ball_qty = exist_balls[key];
        ballDetails[ball_color] = ball_qty;
      }
      let output = `Bucket ${bucket_name}: Place`;
      for (let color in ballDetails) {
        const count = ballDetails[color];
        output += ` ${color} ${count} ball${count > 1 ? "s" : ""},`;
      }
      ballsResponse.push(output);
    }
  }
  return ballsResponse;
}
module.exports = machine_test;
