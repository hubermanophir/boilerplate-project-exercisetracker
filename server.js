const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const User = require("./models/user");
// const Exercise = require("./models/exercise");
const { json } = require("body-parser");
const { find } = require("./models/user");

//----------------------------------middleware-----------------------------------------------
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(json());

//connecting to database
mongoose
	.connect(
		"mongodb+srv://hubermanophir:Password123@testcluster.oqqu5.mongodb.net/ExerciseTracker?retryWrites=true&w=majority",
		{
			useCreateIndex: true,
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		}
	)
	.then(() => console.log("Connected Successfully to Mongoose atlas"))
	.catch((err) => console.log(err));

//-------------------------------------Routes---------------------------------------------

//loading static HTML page
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/views/index.html");
});

//Making a new user
app.post("/api/exercise/new-user", async (req, res) => {
	const body = req.body;
	const userName = body.username;
	if (userName === "") {
		return res.status(400).send("Username cannot be empty");
	}
	let user;
	try {
		user = await User.find({ username: userName });
	} catch (err) {
		return res
			.status(500)
			.send("Internal server error could not find user" + err);
	}
	if (user[0] === undefined) {
		const newUser = new User({
			username: userName,
			count: 0,
		});
		try {
			await newUser.save();
		} catch (err) {
			return res.status(500).send("Internal server error" + err);
		}
		const id = newUser._id;
		const username = newUser.username;
		const obj = {
			username: username,
			_id: id,
		};
		console.log(obj.username);
		res.json(obj);
	} else {
		return res.status(400).send("Username already taken");
	}
});

//Get all users
app.get("/api/exercise/users", async (req, res) => {
	let userArray;
	try {
		userArray = await User.find({});
	} catch (err) {
		return res
			.status(500)
			.send("Internal server error, could not get users" + err);
	}
	res.json(userArray);
});

//Adding a new exercise to a user
app.post("/api/exercise/add", async (req, res) => {
	const body = req.body;
	const exercise = {};
	const outputObject = {};
	if (body.date === "") {
		exercise.date = new Date();
	} else {
		exercise.date = new Date(body.date);
	}
	exercise.duration = body.duration;
	exercise.description = body.description;
	try {
		await User.findByIdAndUpdate(body.userId, {
			$push: { log: exercise },
			$inc: { count: 1 },
		});
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
	let user;
	try {
		user = await User.findById(body.userId);
	} catch (err) {
		return res
			.status(500)
			.send("Internal server error, could not find user" + err);
	}
	const id = user._id;
	outputObject.username = user.username;
	outputObject.description = exercise.description;
	outputObject.duration = Number(exercise.duration);
	outputObject._id = mongoose.Types.ObjectId(id);
	outputObject.date = exercise.date.toDateString();
	res.json(outputObject);
});

//Getting the user and all his exercises
app.get("/api/exercise/log", async (req, res) => {
	const query = req.query;
	let user;
	try {
		user = await User.findById(query.userId);
	} catch (err) {
		return res.status(500).send("Internal server error");
	}
	const { log } = user;
	let filtered;
	filtered = log;

	filtered.sort(function (a, b) {
		let dateA = a.date,
			dateB = b.date;
		return dateA - dateB;
	});

	if (!query.userId) {
		return res.status(400).send("userId required");
	}

	if (query.to) {
		filtered = filtered.filter((element) => {
			if (element.date <= new Date(query.to)) {
				return element;
			}
		});
	}
	if (query.from) {
		filtered = filtered.filter((element) => {
			if (element.date >= new Date(query.from)) {
				return element;
			}
		});
	}

	if (query.limit) {
		query.limit =
			query.limit > filtered.length ? filtered.length : query.limit;
		const temp = [];
		for (let i = 0; i < Number(query.limit); i++) {
			temp.push(filtered[i]);
		}
		filtered = temp;
	}
	const temp = [];
	for (const item of filtered) {
		temp.push({
			description: item.description,
			duration: item.duration,
			date: item.date.toDateString(),
		});
	}
	filtered = temp;
	const object = {
		_id: mongoose.Types.ObjectId(user._id),
		username: user.username,
		count: filtered.length,
		log: filtered,
	};
	return res.status(200).json(object);
});

//------------------------------App-Listen---------------------------------------------
const listener = app.listen(process.env.PORT || 3000, () => {
	console.log("Your app is listening on port " + listener.address().port);
});
