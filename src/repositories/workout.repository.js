import { prisma } from "../libs/prisma.js";

const logError = (error) => {
  console.error("Database Error:", error);
  throw new Error("An unexpected error occurred. Please try again.");
};

const postWorkout = async (userId, name, visibility, exercises) => {
  try {
    const workout = await prisma.workout.create({
      data: {
        userId,
        name,
        visibility,
        exercises: {
          create: exercises.map((exercise) => ({
            name: exercise.name,
            series: exercise.series,
            repetitions: exercise.repetitions,
            weight: exercise.weight,
            restTime: exercise.restTime,
            videoUrl: exercise.videoUrl,
            instructions: exercise.instructions,
          })),
        },
      },
      select: {
        id: true,
        name: true,
        visibility: true,
        userId: true,
        exercises: {
          select: {
            id: true,
            name: true,
            series: true,
            repetitions: true,
            weight: true,
            restTime: true,
            videoUrl: true,
            instructions: true,
          },
        },
      },
    });

    return workout;
  } catch (error) {
    logError(error);
  }
};

const postWorkoutAI = async (userId, workout) => {
  try {
    return await prisma.workout.create({
      data: {
        userId,
        name: String(workout.name),
        exercises: {
          create: workout.exercises.map((exercise) => ({
            name: String(exercise.name),
            series: String(exercise.series),
            repetitions: String(exercise.repetitions),
            weight: String(exercise.weight),
            restTime: String(exercise.restTime),
            videoUrl: String(exercise.videoUrl),
            instructions: String(exercise.instructions),
          })),
        },
      },
      select: {
        id: true,
        name: true,
        visibility: true,
        userId: true,
        exercises: {
          select: {
            id: true,
            name: true,
            series: true,
            repetitions: true,
            weight: true,
            restTime: true,
            videoUrl: true,
            instructions: true,
          },
        },
      },
    });
  } catch (error) {
    logError(error);
  }
};

const getWorkouts = async (userId, visibility) => {
  try {
    const workouts = await prisma.workout.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(visibility ? { visibility } : {}),
      },
      select: {
        id: true,
        name: true,
        visibility: true,
        likes: {
          select: {
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        exercises: {
          select: {
            id: true,
            name: true,
            series: true,
            repetitions: true,
            weight: true,
            restTime: true,
            videoUrl: true,
            instructions: true,
          },
        },
      },
    });

    return workouts;
  } catch (error) {
    logError(error);
  }
};

const getWorkoutByID = async (workoutId) => {
  try {
    const workout = await prisma.workout.findUnique({
      where: {
        id: workoutId,
      },
      select: {
        id: true,
        name: true,
        visibility: true,
        likes: {
          select: {
            userId: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        exercises: {
          select: {
            id: true,
            name: true,
            series: true,
            repetitions: true,
            weight: true,
            restTime: true,
            videoUrl: true,
            instructions: true,
          },
        },
      },
    });

    return workout;
  } catch (error) {
    logError(error);
  }
};

const postLikeWorkout = async (workoutId, userId) => {
  try {
    const like = await prisma.workoutLikes.create({
      data: {
        workoutId,
        userId,
      },
    });

    return like;
  } catch (error) {
    logError(error);
  }
};

const postUnlikeWorkout = async (workoutId, userId) => {
  try {
    await prisma.workoutLikes.deleteMany({
      where: {
        workoutId,
        userId,
      },
    });

    return;
  } catch (error) {
    logError(error);
  }
};

const getWorkoutLikedByUser = async (workoutId, userId) => {
  try {
    const like = await prisma.workoutLikes.findFirst({
      where: {
        workoutId,
        userId,
      },
    });

    return like;
  } catch (error) {
    logError(error);
  }
};

const getExerciseByID = async (exerciseId) => {
  try {
    const exercise = await prisma.exercise.findUnique({
      where: {
        id: exerciseId,
      },
    });

    return exercise;
  } catch (error) {
    logError(error);
  }
};

const deleteExercise = async (exerciseId) => {
  try {
    await prisma.exercise.delete({
      where: {
        id: exerciseId,
      },
    });

    return;
  } catch (error) {
    logError(error);
  }
};

const deleteWorkout = async (workoutId) => {
  try {
    await prisma.workout.delete({
      where: {
        id: workoutId,
      },
    });

    return;
  } catch (error) {
    logError(error);
  }
};

export default {
  postWorkout,
  postWorkoutAI,
  getWorkouts,
  getWorkoutByID,
  postLikeWorkout,
  getWorkoutLikedByUser,
  postUnlikeWorkout,
  getExerciseByID,
  deleteExercise,
  deleteWorkout,
};
