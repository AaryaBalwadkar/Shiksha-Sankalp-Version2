import { classroom } from "../model/Classroom.js";
import { channel } from "../model/Channel.js";
import { User } from "../model/UserModel.js";
import Message from "../model/Message.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import conversation from "../model/Conversation.js";
import { io } from "../lib/socket.js";

export const createClassroom = async (req, res) => {
	const { classroomName, image } = req.body;
	const whoCreated = req.user._id;

	const classroomCode = Math.floor(100000 + Math.random() * 900000).toString();

	try {
		if (!classroomName) {
			throw new Error("Classroom name is required");
		}
		if (!image) {
			throw new Error("Classroom Image is required");
		}

		// Check for duplicate classroom names
		const userClassroomNames = await User.findOne({ _id: whoCreated }).populate("classrooms");
		const names = userClassroomNames.classrooms.map((c) => c.classroomName);
		if (names.includes(classroomName)) {
			return res.status(400).json({ message: "Classroom already exists" });
		}

		// Create new classroom
		const newClassroom = new classroom({
			whoCreated,
			classroomName,
			classroomCode,
			imageUrl: image,
			participants: whoCreated,
		});
		await newClassroom.save();

		// Link classroom to the user
		await User.findByIdAndUpdate(whoCreated, {
			$push: { classrooms: newClassroom._id },
		});

		// Create default channels: Announcements and Assignments
		const defaultChannels = ["Announcements", "Assignments"];
		await Promise.all(
			defaultChannels.map((name) =>
				new channel({
					classroomName: newClassroom._id,
					lock: false,
					channelName: name,
				}).save()
			)
		);

		res.status(201).json({
			message: "Classroom created successfully",
			newClassroom: {
				...newClassroom._doc,
			},
		});
	} catch (error) {
		console.error("Error in CreateClassroomController:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const joinClassroom = async (req, res) => {
	const { code } = req.body
	const whojoined = req.user._id
	console.log(whojoined)

	//const id = new ObjectId(classroomId)

	try {
		if (!code) {
			throw new Error("Classroom name is required");
		}

		const userClassroomIds = await User.findOne({
			_id: whojoined,
		})

		const isClassroom = await classroom.findOne({
			classroomCode: code,
		})
		if (!isClassroom) {
			console.log("Classroom doesn't exist or Code is Invalid");
			return res.status(400).json({ message: "Classroom doesn't exists or Code is Invalid" });
		}

		const isClassroomAlreadyExists = userClassroomIds.classrooms.includes(isClassroom._id)

		if (isClassroomAlreadyExists) {
			console.log("classroomAlreadyExists", isClassroomAlreadyExists);
			return res.status(400).json({ message: "Classroom already exists" });
		}

		const updateUser = await User.findByIdAndUpdate(
			whojoined,
			{ $push: { classrooms: isClassroom._id } }
		)

		const updateClassroom = await classroom.findByIdAndUpdate(
			isClassroom._id,
			{ $push: { participants: whojoined } }
		)

		res.status(201).json({
			message: "Classroom joined successfully",
			updateUser: {
				...updateUser._doc,
			},
			updateClassroom: {
				...updateClassroom._doc,
			}
		});

	} catch (error) {
		console.log("Error in CreateClassroomController for joining classroom: ", error.message)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const createChannel = async (req, res) => {
  const { classroomId, channelName, lock } = req.body;
  const user = req.user._id;

  try {
    if (!channelName || !classroomId) {
      throw new Error("Classroom ID and channel name are required.");
    }

    // Validate classroom existence
    const classroomData = await classroom.findById(classroomId);
    if (!classroomData) {
      return res.status(404).json({ error: "Classroom not found." });
    }

    // Check if user is a participant
    const isParticipant = classroomData.participants.includes(user);
    if (!isParticipant) {
      return res.status(403).json({ error: "User is not a participant in this classroom." });
    }

    // Check if channel already exists
    const channelAlreadyExists = await channel.findOne({ classroomName: classroomId, channelName });
    if (channelAlreadyExists) {
      return res.status(400).json({ message: "Channel already exists" });
    }

    // Create and save the new channel
    const newChannel = new channel({
      classroomName: classroomId,
      channelName,
      lock: lock || false,
    });

    await newChannel.save();

    // Emit the newChannel event to all clients in the classroom room
    io.to(classroomId).emit("newChannel", {
      _id: newChannel._id,
      classroomName: newChannel.classroomName,
      channelName: newChannel.channelName,
      lock: newChannel.lock,
    });
    console.log(`Emitted newChannel event for classroom ${classroomId}:`, newChannel);

    res.status(201).json({
      message: "Channel created successfully",
      newChannel: {
        ...newChannel._doc,
      },
    });
  } catch (error) {
    console.log("Error in createChannel controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getClassroomCode = async (req, res) => {
	const { classroomId } = req.query
	try {
		const c = await classroom.findById(classroomId);
		res.status(200).json(c.classroomCode);
	} catch (error) {
		console.log("Error in getClassroomCode controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getClassrooms = async (req, res) => {
	try {
		const userId = req.user._id;
		//console.log(userId)

		const userClassroomNames = await User.findOne({
			_id: userId,
		}).populate("classrooms"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!userClassroomNames) return res.status(200).json([]);
		//console.log(userClassroomNames)

		const names = userClassroomNames.classrooms.map((classroom) => (classroom));
		res.status(200).json(names);
	} catch (error) {
		console.log("Error in getClassrooms controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getChannels = async (req, res) => {
	try {
		const userId = req.user._id; // User's ID from request (authenticated user)
		const { id } = req.params; // Classroom ID from request body

		const c = await classroom.findById(id)

		const channels = await channel.find({ classroomName: id })
		const channelNames = channels.map((channel) => (channel))

		if (!channelNames) return res.status(200).json([]);

		res.status(200).json([channelNames,c.classroomCode])
	} catch (error) {
		console.log("Error in getClassrooms controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteClassroom = async (req, res) => {
	const { classroomId } = req.body
	const user = req.user._id

	// const classroomCode = Math.floor(100000 + Math.random() * 900000).toString();

	try {
		if (!classroomId) {
			throw new Error("Classroom Id is required");
		}

		const findUser = await User.findById(user)
		const updateUser = await User.findOneAndUpdate(
			{ _id: user }, 
			{ $pull: { classrooms: new ObjectId(classroomId) } }
		);
		console.log(findUser)


		const findClassroomChannels = await channel.find({
			classroomName: classroomId
		})

		const channelIds = findClassroomChannels.map((ch) => (ch._id));

		const updateMessageModel = await Message.deleteMany({ receiverId: { $in: channelIds } });

		const updateConversationModel = await conversation.deleteMany({ channelId: { $in: channelIds } });

		const updateChannelModel = await channel.deleteMany({ _id: { $in: channelIds } });

		const deleteClassroom = await classroom.findByIdAndDelete(classroomId)

		res.status(200).json("Done")

	} catch (error) {
		console.log("Error in DeleteClassroomController: ", error.message)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const deleteChannel = async (req, res) => {
	const { channelId } = req.body

	try {
		if (!channelId) {
			throw new Error("Classroom Id is required");
		}
		// const findChannel = await channel.findById(channelId)

		// if(findChannel.channelName == "Announcement")
		
		const findChannel = await channel.findById(channelId)
		
		const updateMessageModel = await Message.deleteMany({ receiverId: { $in: findChannel } });
		// const updateConversationModel = await conversation.deleteMany({ channelId: { $in: findChannel } });
		const updateChannelModel = await channel.deleteMany({ _id: { $in: channelId } });

		res.status(200).json("Done")

	} catch (error) {
		console.log("Error in DeleteClassroomController: ", error.message)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const removeClassroom = async (req, res) => {
	const { classroomId } = req.body
	console.log(classroomId)
	const user = req.user._id


	// const classroomCode = Math.floor(100000 + Math.random() * 900000).toString();

	try {
		if (!classroomId) {
			throw new Error("Classroom Id is required");
		}

		const findUser = await User.findById(user)
		const updateUser = await User.findOneAndUpdate(
			{ _id: user }, 
			{ $pull: { classrooms: new ObjectId(classroomId) } }
		);

		const updateClassroom = await classroom.findOneAndUpdate(
			{ _id: classroomId }, 
			{ $pull: { participants: user } }
		)

		res.status(200).json("Done")

	} catch (error) {
		console.log("Error in DeleteClassroomController: ", error.message)
		res.status(500).json({ error: "Internal server error" })
	}
}