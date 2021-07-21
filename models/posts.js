const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

const voteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'users', required: true},
    vote: { type: Number, requred: true}
  },
  {
    _id: false
  }
)

//Creating a Schema for Answers
const answerSchema = new Schema(
  {
    body:  {
      type: String,
      required: [true, "This field cannot be empty"]
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    votes: [voteSchema],
    score: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true, }
)

// Creating a Schema for Post
const postsSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a title"],
    },
    body: {
      type: String,
      required: [true, "Please explain your question"],
      minlength: [30, 'Minimum body length is 30 characters']
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    answers: [answerSchema],
  },
  {
    timestamps: true,
  }
);

answerSchema.methods = {
  vote: function (user, vote) {
    const existingVote = this.votes.find((v) => v.user._id.equals(user));

    if (existingVote) {
      // reset score
      this.score -= existingVote.vote;
      if (vote == 0) {
        // remove vote
        this.votes.pull(existingVote);
      } else {
        //change vote
        this.score += vote;
        existingVote.vote = vote;
      }
    } else if (vote !== 0) {
      // new vote
      this.score += vote;
      this.votes.push({ user, vote });
    }
    return this;
  },
};

postsSchema.plugin(mongoose_fuzzy_searching, { fields: ['title', 'body'] });

const posts = mongoose.model("posts", postsSchema);

module.exports = posts;
